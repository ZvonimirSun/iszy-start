<script setup lang="ts">
import type { HomeShortcut } from '#shared/types/home'

defineProps<{
  shortcuts: HomeShortcut[]
}>()

const emit = defineEmits<{
  open: [shortcut: HomeShortcut]
}>()
</script>

<template>
  <div class="mx-auto flex max-w-full items-center justify-center">
    <div class="flex max-w-[min(92vw,720px)] items-center gap-2 overflow-x-auto rounded-2xl bg-zinc-950/58 px-3 py-2 shadow-2xl shadow-black/25 backdrop-blur-md">
      <button
        v-for="shortcut in shortcuts"
        :key="shortcut.id"
        type="button"
        class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900/90 text-white/80 transition-colors hover:bg-zinc-800 hover:text-white"
        :aria-label="shortcut.label"
        @click="emit('open', shortcut)"
      >
        <UIcon :name="shortcut.icon" class="size-5" />
      </button>
    </div>
  </div>
</template>
