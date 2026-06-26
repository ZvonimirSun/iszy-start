import type { ResultDto } from '@zvonimirsun/iszy-common'
import type { PublicSimpleUser } from '#shared/types/user'

export default defineEventHandler(async (event): Promise<ResultDto<{
  logged: boolean
  profile?: PublicSimpleUser
}>> => {
  const session = await getRedisSession(event)
  if (!session) {
    return {
      success: true,
      data: { logged: false },
      message: '未登录',
    }
  }

  try {
    const res = await authFetch<ResultDto<PublicSimpleUser>>(event, '/user/me')
    return {
      success: true,
      data: {
        logged: !!res.success,
        profile: res.success ? toPublicSimpleUser(res.data!) : undefined,
      },
      message: res.success ? '已登录' : '未登录',
    }
  }
  catch {
    return {
      success: true,
      data: { logged: false },
      message: '未登录',
    }
  }
})
