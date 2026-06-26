import type { PublicUser, ResultDto } from '@zvonimirsun/iszy-common'
import type { H3Event } from 'h3'
import type { NitroFetchRequest, TypedInternalResponse } from 'nitropack'
import type { FetchError } from 'ofetch'
import type { SessionData } from '#server/types/session'
import { getProxyRequestHeaders } from 'h3'

export async function authFetch<T = unknown>(event: H3Event, ...params: Parameters<typeof $fetch>): Promise<TypedInternalResponse<NitroFetchRequest, T>> {
  const sessionId = getSessionId(event)
  const { apiOrigin } = usePublicConfig()
  const [url, opts = {}] = params
  const headers: Record<string, string> = {
    ..._getForwardRequestHeaders(event),
    ...(opts.headers as Record<string, string> | undefined),
  }

  opts.headers = headers
  opts.baseURL = apiOrigin

  const doRequest = async (): Promise<TypedInternalResponse<NitroFetchRequest, T>> => {
    if (sessionId) {
      const sessionData = await getRedisSession(event)
      if (sessionData) {
        headers.authorization = `Bearer ${sessionData.access_token}`
      }
    }
    return $fetch(url, opts)
  }

  try {
    return await doRequest()
  }
  catch (error) {
    if (sessionId && (error as FetchError)?.response?.status === 401) {
      try {
        useRedisSession(event, await _refreshWithLock(sessionId, async () => _refreshToken(event)))
        return doRequest()
      }
      catch {
        await destroyRedisSession(event)
        throw error
      }
    }
    throw error
  }
}

async function _refreshToken(event: H3Event): Promise<SessionData> {
  const sessionData = await getRedisSession(event)
  if (!sessionData) {
    throw new Error('REFRESH_FAILED')
  }

  const { apiOrigin } = usePublicConfig()
  const res = await $fetch<ResultDto<{
    access_token: string
    refresh_token: string
    profile: PublicUser
  }>>(`${apiOrigin}/auth/refresh`, {
    method: 'POST',
    headers: {
      ..._getForwardRequestHeaders(event),
      Authorization: `Bearer ${sessionData.refresh_token}`,
    },
  })

  if (!res.success) {
    throw new Error('REFRESH_FAILED')
  }

  return rotateRedisSession(event, {
    access_token: res.data!.access_token,
    refresh_token: res.data!.refresh_token,
  })
}

const locks = new Map<string, Promise<SessionData>>()

async function _refreshWithLock(sessionId: string, fn: () => Promise<SessionData>) {
  if (locks.has(sessionId)) {
    return locks.get(sessionId)!
  }

  const promise = (async () => {
    try {
      return await fn()
    }
    finally {
      locks.delete(sessionId)
    }
  })()

  locks.set(sessionId, promise)
  return promise
}

function _getForwardRequestHeaders(event: H3Event) {
  const headers = getProxyRequestHeaders(event, { host: false }) as Record<string, string>
  const remoteAddr = getRequestIP(event, { xForwardedFor: true }) || ''
  const xForwardedFor = headers['x-forwarded-for'] || remoteAddr

  delete headers.cookie
  delete headers.authorization

  headers['x-forwarded-for'] = xForwardedFor
  headers['x-real-ip'] = remoteAddr

  return headers
}
