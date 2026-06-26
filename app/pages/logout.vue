<script setup lang="ts">
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

useSeoMeta({
  title: '退出登录',
  robots: 'noindex,nofollow',
})

onMounted(async () => {
  try {
    await userStore.logout()
    toast.add({ title: '已退出登录', color: 'success' })
  }
  catch {
    toast.add({ title: '登出失败', color: 'error' })
  }
  finally {
    await router.push('/')
  }
})
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center bg-zinc-950 px-4">
    <UPageCard class="w-full max-w-sm text-center">
      <UIcon name="i-lucide-log-out" class="mx-auto size-8 text-primary" />
      <p class="mt-4 text-sm text-muted">
        正在退出...
      </p>
    </UPageCard>
  </div>
</template>
