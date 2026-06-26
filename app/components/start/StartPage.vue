<script setup lang="ts">
import type { HomeShortcut, MonitorModule } from '#shared/types/home'

const { backgroundImage: defaultBackgroundImage } = usePublicConfig()
const homeStore = useHomeStore()
const userStore = useUserStore()
const toast = useToast()

const query = ref('')
const time = ref(formatClock())
const searchActive = ref(false)
const shortcutsOpen = ref(false)
const pageSettingsOpen = ref(false)
const shortcutSettingsOpen = ref(false)
const monitorSettingsOpen = ref(false)
const aboutOpen = ref(false)

const shortcutForm = reactive<HomeShortcut>(createShortcutForm())
const monitorForm = reactive<MonitorModule>(createMonitorForm())

const backgroundImage = computed(() => homeStore.pageSettings.backgroundImage || defaultBackgroundImage)
const enabledModules = computed(() => homeStore.monitorModules.filter(item => item.enabled))

let clockTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
  userStore.pullProfile().catch(() => {})
})

onBeforeUnmount(() => {
  if (clockTimer) {
    clearInterval(clockTimer)
  }
})

function updateClock() {
  time.value = formatClock()
}

function formatClock() {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

function search() {
  const keyword = query.value.trim()
  const engine = homeStore.selectedSearchEngine
  const target = keyword
    ? engine.searchUrl.replace('{query}', encodeURIComponent(keyword))
    : engine.homeUrl
  window.location.href = target
}

function activateSearch() {
  searchActive.value = true
}

function deactivateSearch(event: FocusEvent) {
  const nextTarget = event.relatedTarget
  if (nextTarget instanceof Node && event.currentTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
    return
  }
  searchActive.value = false
}

function toggleShortcuts() {
  if (searchActive.value) {
    return
  }
  shortcutsOpen.value = !shortcutsOpen.value
}

function editShortcut(shortcut?: HomeShortcut) {
  Object.assign(shortcutForm, shortcut ?? createShortcutForm())
  shortcutSettingsOpen.value = true
}

function saveShortcut() {
  if (!shortcutForm.label.trim() || !shortcutForm.url.trim()) {
    toast.add({ title: '站点名称和地址不能为空', color: 'error' })
    return
  }
  homeStore.upsertShortcut({ ...shortcutForm, label: shortcutForm.label.trim(), url: shortcutForm.url.trim() })
  toast.add({ title: '常用站点已保存', color: 'success' })
}

function deleteShortcut(shortcut: HomeShortcut) {
  homeStore.removeShortcut(shortcut.id)
}

function editMonitor(module?: MonitorModule) {
  Object.assign(monitorForm, module ?? createMonitorForm())
  monitorSettingsOpen.value = true
}

function saveMonitor() {
  if (!monitorForm.title.trim()) {
    toast.add({ title: '监控名称不能为空', color: 'error' })
    return
  }
  homeStore.upsertMonitorModule({ ...monitorForm, title: monitorForm.title.trim() })
  toast.add({ title: '监控模块已保存', color: 'success' })
}

function createShortcutForm(): HomeShortcut {
  return {
    id: crypto.randomUUID(),
    label: '',
    url: '',
    icon: 'i-lucide-bookmark',
    tone: 'blue',
  }
}

function createMonitorForm(): MonitorModule {
  return {
    id: crypto.randomUUID(),
    title: '',
    kind: 'http',
    enabled: true,
    description: '',
    url: '',
    method: 'GET',
    expectedStatus: 200,
  }
}
</script>

<template>
  <div class="min-h-dvh bg-zinc-950 text-white">
    <StartHero
      v-model:query="query"
      :background-image="backgroundImage"
      :time="time"
      :search-active="searchActive"
      :shortcuts-open="shortcutsOpen"
      :dock-enabled="homeStore.pageSettings.dockEnabled"
      :shortcuts="homeStore.shortcuts"
      :logged="userStore.logged"
      :profile="userStore.profile"
      :search-engine="homeStore.selectedSearchEngine"
      @activate-search="activateSearch"
      @deactivate-search="deactivateSearch"
      @search="search"
      @toggle-shortcuts="toggleShortcuts"
      @close-shortcuts="shortcutsOpen = false"
      @edit-shortcut="editShortcut"
      @delete-shortcut="deleteShortcut"
      @open-general-settings="pageSettingsOpen = true"
      @open-search-settings="pageSettingsOpen = true"
      @open-wallpaper-settings="pageSettingsOpen = true"
      @open-shortcut-settings="shortcutSettingsOpen = true"
      @open-about="aboutOpen = true"
    />

    <StartMonitorSection
      v-if="userStore.logged"
      :modules="enabledModules"
      @add="editMonitor()"
    />

    <StartShortcutSettingsModal
      v-model:open="shortcutSettingsOpen"
      v-model:form="shortcutForm"
      :shortcuts="homeStore.shortcuts"
      @edit="editShortcut"
      @save="saveShortcut"
    />

    <StartPageSettingsModal
      v-model:open="pageSettingsOpen"
      v-model:settings="homeStore.pageSettings"
      :search-engines="homeStore.searchEngines"
    />

    <StartMonitorSettingsModal
      v-model:open="monitorSettingsOpen"
      v-model:form="monitorForm"
      @save="saveMonitor"
    />

    <UModal v-model:open="aboutOpen" title="关于 ISZY Home" :ui="{ content: 'max-w-md' }">
      <template #body>
        <p class="text-sm text-muted">
          ISZY Home 是一个面向浏览器首页的个人起始页，后续会继续扩展搜索、常用站点、Dock、监控模块和个性化配置。
        </p>
      </template>
    </UModal>
  </div>
</template>
