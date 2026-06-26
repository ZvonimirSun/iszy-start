<script setup lang="ts">
import type { HomeShortcut, SearchEngine } from '#shared/types/home'
import type { PublicSimpleUser } from '#shared/types/user'

const props = defineProps<{
  backgroundImage: string
  time: string
  searchActive: boolean
  shortcutsOpen: boolean
  shortcuts: HomeShortcut[]
  logged: boolean
  profile?: PublicSimpleUser
  searchEngine: SearchEngine
}>()

const emit = defineEmits<{
  activateSearch: []
  deactivateSearch: [event: FocusEvent]
  search: []
  toggleShortcuts: []
  closeShortcuts: []
  openShortcut: [shortcut: HomeShortcut]
  editShortcut: [shortcut?: HomeShortcut]
  openSettings: []
}>()

const query = defineModel<string>('query', { required: true })

const userLabel = computed(() => props.profile?.nickName || props.profile?.userName)
const backgroundClass = computed(() => props.searchActive ? 'scale-105 blur-md' : '')
const heroClass = computed(() => [
  props.shortcutsOpen ? 'backdrop-blur-md bg-black/45' : '',
  props.searchActive ? 'backdrop-blur-sm bg-black/35' : 'bg-black/24',
])
</script>

<template>
  <section
    class="relative flex min-h-dvh overflow-hidden"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="absolute inset-0 bg-cover bg-center transition duration-500" :class="backgroundClass" :style="{ backgroundImage: `url(${backgroundImage})` }" />
    <div class="absolute inset-0 transition duration-300" :class="heroClass" @click.self="emit('closeShortcuts')" />

    <div class="relative z-10 flex min-h-dvh w-full flex-col px-5 py-6">
      <div class="flex justify-end gap-2">
        <UTooltip text="账号">
          <UButton
            v-show="shortcutsOpen"
            :to="logged ? undefined : '/login'"
            :label="userLabel"
            :icon="logged ? 'i-lucide-user-check' : 'i-lucide-circle-user-round'"
            color="neutral"
            variant="ghost"
            class="text-white/80 hover:text-white"
          />
        </UTooltip>
        <UTooltip text="设置">
          <UButton v-show="shortcutsOpen" icon="i-lucide-settings" color="neutral" variant="ghost" class="text-white/80 hover:text-white" @click="emit('openSettings')" />
        </UTooltip>
      </div>

      <div class="mx-auto grid w-full max-w-3xl flex-1 grid-rows-[7rem_1fr] justify-items-center pt-[8dvh]">
        <button
          type="button"
          class="cursor-pointer text-6xl font-light leading-none text-white drop-shadow-xl transition focus:outline-none sm:text-7xl"
          @click.stop="emit('toggleShortcuts')"
        >
          {{ time || '--:--' }}
        </button>

        <div class="w-full">
          <StartSearchBox
            v-show="!shortcutsOpen"
            v-model="query"
            :active="searchActive"
            :search-engine="searchEngine"
            @activate="emit('activateSearch')"
            @deactivate="emit('deactivateSearch', $event)"
            @search="emit('search')"
          />

          <StartShortcutGrid
            v-if="shortcutsOpen"
            :shortcuts="shortcuts"
            @open="emit('openShortcut', $event)"
            @add="emit('editShortcut')"
          />
        </div>
      </div>

      <div v-if="logged" class="flex justify-center pb-4">
        <UButton to="#monitors" icon="i-lucide-chevron-down" color="neutral" variant="ghost" aria-label="监控模块" class="text-white/75" />
      </div>
    </div>
  </section>
</template>
