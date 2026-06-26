import type { Optional } from '@zvonimirsun/iszy-common'
import type { H3Event } from 'h3'
import type { StringValue } from 'ms'
import type { SessionData, SessionTombstone } from '#server/types/session'
import { randomBytes } from 'node:crypto'
import ms from 'ms'

const SESSION_TOMBSTONE_TTL = 30
const sessionIdLength = 32

export function getSessionId(event: H3Event): string | undefined {
  const { session: sessionConfig } = useRuntimeConfig()
  return getCookie(event, sessionConfig.cookieName)
}

export function getSessionKey(sessionId: string): string {
  return `session:${sessionId}`
}

export function setSessionId(id: string, data: Optional<SessionData, 'id'>): SessionData {
  data.id = id
  return data as SessionData
}

export async function getRedisSession(event: H3Event): Promise<SessionData | null> {
  const storage = useStorage<SessionData | SessionTombstone>('redis')
  const sessionId = getSessionId(event)
  if (!sessionId) {
    return null
  }

  const data = await storage.getItem(getSessionKey(sessionId))
  if (!data) {
    return null
  }

  if ('redirectTo' in data) {
    const newData = await storage.getItem(getSessionKey(data.redirectTo))
    if (!newData || 'redirectTo' in newData) {
      return null
    }
    useRedisSession(event, newData)
    return newData
  }

  return data
}

export async function setRedisSession(event: H3Event, data?: Optional<SessionData, 'id'> | null) {
  const { session: sessionConfig } = useRuntimeConfig()
  const cookieName = sessionConfig.cookieName
  const ttl = ms(sessionConfig.maxAge as StringValue) / 1000
  const storage = useStorage<SessionData>('redis')

  let sessionId = getSessionId(event)
  if (!data) {
    if (sessionId) {
      await storage.removeItem(getSessionKey(sessionId))
    }
    deleteCookie(event, cookieName)
    return
  }

  if (!sessionId) {
    sessionId = createSessionId()
  }

  const sessionData = setSessionId(sessionId, data)
  await storage.setItem(getSessionKey(sessionId), sessionData, { ttl })
  setSessionCookie(event, sessionData.id, ttl)
}

export async function rotateRedisSession(event: H3Event, data: Optional<SessionData, 'id'>) {
  const { session: sessionConfig } = useRuntimeConfig()
  const ttl = ms(sessionConfig.maxAge as StringValue) / 1000
  const storage = useStorage<SessionData | SessionTombstone>('redis')
  const oldSessionId = getSessionId(event)
  const sessionId = createSessionId()
  const sessionData = setSessionId(sessionId, data)

  await storage.setItem(getSessionKey(sessionId), sessionData, { ttl })
  if (oldSessionId) {
    await storage.setItem(getSessionKey(oldSessionId), { redirectTo: sessionId }, { ttl: SESSION_TOMBSTONE_TTL })
  }

  setSessionCookie(event, sessionData.id, ttl)
  return sessionData
}

export function useRedisSession(event: H3Event, session: SessionData) {
  const { session: sessionConfig } = useRuntimeConfig()
  setSessionCookie(event, session.id, ms(sessionConfig.maxAge as StringValue) / 1000)
}

export async function destroyRedisSession(event: H3Event): Promise<void> {
  return setRedisSession(event, undefined)
}

function setSessionCookie(event: H3Event, sessionId: string, maxAge: number) {
  const { session: sessionConfig } = useRuntimeConfig()
  setCookie(event, sessionConfig.cookieName, sessionId, {
    maxAge,
    domain: sessionConfig.domain || undefined,
    sameSite: 'lax',
    httpOnly: true,
    secure: !import.meta.dev,
    priority: 'high',
  })
}

function createSessionId() {
  return randomBytes(sessionIdLength).toString('base64url').slice(0, sessionIdLength)
}
