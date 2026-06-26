<script setup lang="ts">
import type { HomeShortcut, SearchEngine } from '#shared/types/home'
import type { PublicSimpleUser } from '#shared/types/user'

const props = defineProps<{
  backgroundImage: string
  time: string
  searchActive: boolean
  shortcutsOpen: boolean
  dockEnabled: boolean
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
  openGeneralSettings: []
  openSearchSettings: []
  openWallpaperSettings: []
  openShortcutSettings: []
  openAbout: []
}>()

const query = defineModel<string>('query', { required: true })

const backgroundClass = computed(() => props.searchActive ? 'scale-105 blur-md' : '')
const heroClass = computed(() => [
  props.shortcutsOpen ? 'backdrop-blur-md bg-black/45' : '',
  props.searchActive ? 'backdrop-blur-sm bg-black/35' : 'bg-black/24',
])
const dockShortcuts = computed(() => props.shortcuts.slice(0, 12))
</script>

<template>
  <section
    class="relative flex min-h-dvh overflow-hidden"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="absolute inset-0 bg-cover bg-center transition duration-500" :class="backgroundClass" :style="{ backgroundImage: `url(${backgroundImage})` }" />
    <div class="absolute inset-0 transition duration-300" :class="heroClass" @click.self="emit('closeShortcuts')" />

    <div class="relative z-10 grid min-h-dvh w-full grid-rows-[auto_1fr_auto] px-5 py-6">
      <div class="flex justify-end">
        <StartActionMenu
          :logged="logged"
          :profile="profile"
          @open-general-settings="emit('openGeneralSettings')"
          @open-search-settings="emit('openSearchSettings')"
          @open-wallpaper-settings="emit('openWallpaperSettings')"
          @open-shortcut-settings="emit('openShortcutSettings')"
          @open-about="emit('openAbout')"
        />
      </div>

      <div class="mx-auto flex w-full max-w-3xl flex-col items-center pt-[7dvh]">
        <div class="flex items-start justify-center">
          <button
            type="button"
            class="cursor-pointer text-6xl font-light leading-none text-white drop-shadow-xl transition focus:outline-none sm:text-7xl"
            @click.stop="emit('toggleShortcuts')"
          >
            {{ time || '--:--' }}
          </button>
        </div>

        <div class="min-h-[24rem] w-full">
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

      <div class="min-h-14">
        <StartDock
          v-if="dockEnabled"
          :shortcuts="dockShortcuts"
          @open="emit('openShortcut', $event)"
        />
        <div v-else-if="logged" class="flex justify-center">
          <UButton to="#monitors" icon="i-lucide-chevron-down" color="neutral" variant="ghost" aria-label="监控模块" class="text-white/75" />
        </div>
      </div>
    </div>
  </section>
</template>
