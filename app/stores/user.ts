import type { ResultDto } from '@zvonimirsun/iszy-common'
import type { PublicSimpleUser } from '#shared/types/user'

interface LoginAttemptFailureData {
  code: 'LOGIN_FAILED'
  failedCount: number
  remainingAttempts: number
  maxAttempts: number
  windowSeconds: number
}

interface LoginBanFailureData {
  code: 'LOGIN_BANNED'
  retryAfterSeconds: number
  bannedUntil: string
}

type LoginFailureData = LoginAttemptFailureData | LoginBanFailureData
type LoginResultData = PublicSimpleUser | LoginFailureData

export const useUserStore = defineStore('user', () => {
  const profilePulled = ref(false)
  const profile = ref<PublicSimpleUser>()
  const logged = computed(() => !!profile.value)

  async function login({ userName, password }: { userName: string, password: string }) {
    if (!userName || !password) {
      throw new Error('请输入用户名和密码')
    }

    const res = await $fetch<ResultDto<LoginResultData>>('/api/auth/login', {
      method: 'POST',
      body: {
        userName: userName.trim(),
        password,
      },
    })

    if (!res.success) {
      profile.value = undefined
      throw new Error(formatLoginFailureMessage(res.message, res.data))
    }

    profilePulled.value = true
    profile.value = res.data as PublicSimpleUser
  }

  async function logout() {
    const res = await $fetch<ResultDto<void>>('/api/auth/logout', { method: 'POST' })
    if (!res.success) {
      throw new Error(res.message || '登出失败')
    }
    profile.value = undefined
    profilePulled.value = true
  }

  async function pullProfile(force?: boolean) {
    if (profilePulled.value && !force) {
      return logged.value
    }
    const res = await $fetch<ResultDto<{ logged: boolean, profile?: PublicSimpleUser }>>('/api/auth/check')
    profile.value = res.data?.logged ? res.data.profile : undefined
    profilePulled.value = true
    return logged.value
  }

  function formatLoginFailureMessage(message: string, data?: LoginResultData) {
    if (data && 'code' in data && data.code === 'LOGIN_BANNED') {
      return '登录失败次数过多，请稍后再试。'
    }
    return message || '登录失败'
  }

  return {
    profilePulled,
    profile,
    logged,
    login,
    logout,
    pullProfile,
  }
})
