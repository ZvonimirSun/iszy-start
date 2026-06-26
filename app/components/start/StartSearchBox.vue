<script setup lang="ts">
import type { SearchEngine } from '#shared/types/home'

const props = defineProps<{
  active: boolean
  searchEngine: SearchEngine
}>()

const emit = defineEmits<{
  activate: []
  deactivate: [event: FocusEvent]
  search: []
}>()

const query = defineModel<string>({ required: true })

const searchBoxClass = computed(() => [
  props.active
    ? 'max-w-xl bg-zinc-950 px-4 shadow-2xl shadow-black/30'
    : 'max-w-xl bg-white/8 px-4 shadow-lg shadow-black/10 backdrop-blur-md',
])
</script>

<template>
  <form
    class="mt-8 flex h-12 w-full items-center rounded-full transition duration-300"
    :class="searchBoxClass"
    @submit.prevent="emit('search')"
    @click="emit('activate')"
    @focusin="emit('activate')"
    @focusout="emit('deactivate', $event)"
  >
    <button
      v-show="active"
      type="button"
      class="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10"
      aria-label="切换搜索引擎"
    >
      <UIcon :name="searchEngine.icon" class="size-4" />
    </button>
    <input
      v-model="query"
      class="h-full min-w-0 flex-1 bg-transparent text-center text-sm text-white outline-none placeholder:text-white"
      placeholder="搜索"
    >
    <button v-show="active" type="submit" class="ml-3 flex size-8 shrink-0 items-center justify-center rounded-full text-lime-300 transition hover:bg-white/10" aria-label="搜索">
      <UIcon name="i-lucide-search" class="size-5" />
    </button>
  </form>
</template>
