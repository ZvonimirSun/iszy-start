<script setup lang="ts">
import type { HomeShortcut } from '#shared/types/home'

defineProps<{
  shortcuts: HomeShortcut[]
}>()

const emit = defineEmits<{
  open: [shortcut: HomeShortcut]
  add: []
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
</script>

<template>
  <div class="pointer-events-none mx-auto mt-10 w-full max-w-2xl overflow-auto px-1 pb-4">
    <div class="grid grid-cols-3 gap-x-9 gap-y-7 sm:grid-cols-5">
      <button
        v-for="shortcut in shortcuts"
        :key="shortcut.id"
        type="button"
        class="group pointer-events-auto flex min-w-0 flex-col items-center gap-3"
        @click.stop="emit('open', shortcut)"
      >
        <span class="flex size-20 items-center justify-center rounded-2xl bg-zinc-950/82 shadow-xl ring-1 ring-white/10 transition group-hover:-translate-y-1 group-hover:bg-zinc-900">
          <UIcon :name="shortcut.icon" class="size-7" :class="toneClass(shortcut.tone)" />
        </span>
        <span class="max-w-24 truncate text-sm font-medium text-white drop-shadow">{{ shortcut.label }}</span>
      </button>
      <button type="button" class="group pointer-events-auto flex flex-col items-center gap-3" @click.stop="emit('add')">
        <span class="flex size-20 items-center justify-center rounded-2xl bg-black/35 ring-1 ring-white/10 transition group-hover:bg-black/50">
          <UIcon name="i-lucide-plus" class="size-8 text-white/72" />
        </span>
      </button>
    </div>
  </div>
</template>
