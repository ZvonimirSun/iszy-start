<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { PublicSimpleUser } from '#layers/iszy-nuxt-auth-layer/shared/types/auth'

const props = defineProps<{
  logged: boolean
  profile?: PublicSimpleUser
}>()

const emit = defineEmits<{
  openGeneralSettings: []
  openSearchSettings: []
  openWallpaperSettings: []
  openShortcutSettings: []
  openAbout: []
}>()

const userLabel = computed(() => props.profile?.nickName || props.profile?.userName || '登录')
const accountTarget = computed(() => props.logged ? '/logout' : '/login')

const items = computed<DropdownMenuItem[][]>(() => [
  [
    { label: '常规设置', icon: 'i-lucide-settings', onSelect: () => emit('openGeneralSettings') },
    { label: '搜索引擎偏好', icon: 'i-lucide-search', onSelect: () => emit('openSearchSettings') },
    { label: '壁纸偏好', icon: 'i-lucide-image', onSelect: () => emit('openWallpaperSettings') },
    { label: '常用站点', icon: 'i-lucide-grid-3x3', onSelect: () => emit('openShortcutSettings') },
  ],
  [
    { label: '帮助和反馈', icon: 'i-lucide-circle-help' },
    { label: '关于', icon: 'i-lucide-info', onSelect: () => emit('openAbout') },
  ],
  [
    { label: '浏览器扩展', icon: 'i-lucide-chrome' },
  ],
])
</script>

<template>
  <div class="flex items-center justify-end gap-2">
    <UTooltip :text="userLabel">
      <UButton
        :to="accountTarget"
        :icon="logged ? 'i-lucide-user-check' : 'i-lucide-circle-user-round'"
        color="neutral"
        variant="ghost"
        class="text-white/75 hover:text-white"
        :aria-label="userLabel"
      />
    </UTooltip>
    <UDropdownMenu :items="items" :ui="{ content: 'w-48 bg-zinc-950/95 text-white ring-white/10 backdrop-blur-md' }">
      <UTooltip text="操作">
        <UButton
          icon="i-lucide-settings"
          color="neutral"
          variant="ghost"
          class="text-white/75 hover:text-white"
          aria-label="操作菜单"
        />
      </UTooltip>
    </UDropdownMenu>
  </div>
</template>
