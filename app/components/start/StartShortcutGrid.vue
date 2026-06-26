<script setup lang="ts">
import type { ContextMenuItem } from '@nuxt/ui'
import type { HomeShortcut } from '#shared/types/home'

defineProps<{
  shortcuts: HomeShortcut[]
}>()

const emit = defineEmits<{
  add: []
  delete: [shortcut: HomeShortcut]
}>()

function toneClass(tone: HomeShortcut['tone']) {
  return {
    blue: 'text-blue-300',
    green: 'text-lime-300',
    rose: 'text-rose-300',
    amber: 'text-amber-300',
    violet: 'text-violet-300',
    sky: 'text-sky-300',
    zinc: 'text-zinc-200',
  }[tone]
}

function shortcutMenuItems(shortcut: HomeShortcut): ContextMenuItem[][] {
  return [
    [
      {
        label: '删除',
        icon: 'i-lucide-trash-2',
        color: 'error',
        onSelect: () => emit('delete', shortcut),
      },
    ],
  ]
}
</script>

<template>
  <div class="pointer-events-none mx-auto mt-10 w-full max-w-2xl overflow-visible px-1 pb-4">
    <div class="grid grid-cols-3 gap-x-9 gap-y-7 sm:grid-cols-5">
      <UContextMenu
        v-for="shortcut in shortcuts"
        :key="shortcut.id"
        :items="shortcutMenuItems(shortcut)"
        :ui="{ content: 'w-32 bg-zinc-950/95 text-white ring-white/10 backdrop-blur-md' }"
      >
        <ULink
          :to="shortcut.url"
          class="group pointer-events-auto flex min-w-0 cursor-pointer flex-col items-center gap-3"
          @click.stop
        >
          <span class="flex size-20 items-center justify-center rounded-2xl bg-zinc-950/82 shadow-xl ring-1 ring-white/10 transition-colors group-hover:bg-zinc-900">
            <UIcon :name="shortcut.icon" class="size-7" :class="toneClass(shortcut.tone)" />
          </span>
          <span class="max-w-24 truncate text-sm font-medium text-white drop-shadow">{{ shortcut.label }}</span>
        </ULink>
      </UContextMenu>
      <button type="button" class="group pointer-events-auto flex cursor-pointer flex-col items-center gap-3" @click.stop="emit('add')">
        <span class="flex size-20 items-center justify-center rounded-2xl bg-black/35 ring-1 ring-white/10 transition group-hover:bg-black/50">
          <UIcon name="i-lucide-plus" class="size-8 text-white/72" />
        </span>
      </button>
    </div>
  </div>
</template>
