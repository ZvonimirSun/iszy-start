<script setup lang="ts">
import { zh_cn } from '@nuxt/ui/locale'

const { url, title, subtitle, description } = usePublicConfig()
const route = useRoute()
const pageTitle = computed(() => route.path === '/' ? `${title} - ${subtitle}` : title)

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: zh_cn.code,
    dir: zh_cn.dir,
  },
})

useSeoMeta({
  title: () => pageTitle.value,
  description,
  ogTitle: () => pageTitle.value,
  ogDescription: description,
  ogUrl: () => `${url}${route.path}`,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UApp :locale="zh_cn">
    <NuxtPage />
  </UApp>
</template>
