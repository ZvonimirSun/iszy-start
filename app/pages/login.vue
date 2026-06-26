<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const { title } = usePublicConfig()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const loading = ref(false)
const error = ref<string>()
const redirect = computed(() => typeof route.query.redirect === 'string' ? route.query.redirect : '/')

const fields: AuthFormField[] = [
  { name: 'userName', type: 'text', label: '用户名', required: true },
  { name: 'password', type: 'password', label: '密码', required: true },
]

const schema = z.object({
  userName: z.string('请输入用户名'),
  password: z.string('请输入密码'),
})

type Schema = z.output<typeof schema>

useSeoMeta({
  title: () => `登录 - ${title}`,
  robots: 'noindex,nofollow',
})

onMounted(async () => {
  if (await userStore.pullProfile()) {
    await router.push(redirect.value)
  }
})

async function login(event: FormSubmitEvent<Schema>) {
  if (loading.value) {
    return
  }

  try {
    loading.value = true
    error.value = undefined
    await userStore.login(event.data)
    toast.add({ title: '登录成功', color: 'success' })
    await router.push(redirect.value)
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center bg-zinc-950 px-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :loading="loading"
        title="欢迎回来"
        icon="i-lucide-lock"
        separator="或"
        :submit="{ label: '登录' }"
        @submit="login"
      >
        <template v-if="error" #validation>
          <UAlert color="error" icon="i-lucide-info" :title="error" />
        </template>
        <template #footer>
          <ULink to="/" class="text-primary font-medium">
            返回首页
          </ULink>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
