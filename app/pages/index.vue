<script setup lang="ts">
import type { HomeShortcut, MonitorModule } from '#shared/types/home'

const { backgroundImage } = usePublicConfig()
const homeStore = useHomeStore()
const userStore = useUserStore()
const toast = useToast()

const query = ref('')
const time = ref('')
const searchFocused = ref(false)
const shortcutsOpen = ref(false)
const settingsOpen = ref(false)
const monitorSettingsOpen = ref(false)

const shortcutForm = reactive<HomeShortcut>({
  id: '',
  label: '',
  url: '',
  icon: 'i-lucide-bookmark',
  tone: 'blue',
})

const monitorForm = reactive<MonitorModule>({
  id: '',
  title: '',
  kind: 'http',
  enabled: true,
  description: '',
  url: '',
  method: 'GET',
  expectedStatus: 200,
})

const enabledModules = computed(() => homeStore.monitorModules.filter(item => item.enabled))
const heroClass = computed(() => [
  shortcutsOpen.value ? 'backdrop-blur-md bg-black/45' : 'bg-black/32',
  searchFocused.value ? 'search-mode' : '',
])

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
  time.value = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

function search() {
  const keyword = query.value.trim()
  const target = keyword
    ? `https://www.google.com/search?q=${encodeURIComponent(keyword)}`
    : 'https://www.google.com/'
  window.location.href = target
}

function toggleShortcuts() {
  if (searchFocused.value) {
    return
  }
  shortcutsOpen.value = !shortcutsOpen.value
}

function closeShortcuts() {
  shortcutsOpen.value = false
}

function editShortcut(shortcut?: HomeShortcut) {
  Object.assign(shortcutForm, shortcut ?? {
    id: crypto.randomUUID(),
    label: '',
    url: '',
    icon: 'i-lucide-bookmark',
    tone: 'blue',
  })
  settingsOpen.value = true
}

function saveShortcut() {
  if (!shortcutForm.label.trim() || !shortcutForm.url.trim()) {
    toast.add({ title: '站点名称和地址不能为空', color: 'error' })
    return
  }
  homeStore.upsertShortcut({ ...shortcutForm, label: shortcutForm.label.trim(), url: shortcutForm.url.trim() })
  toast.add({ title: '常用站点已保存', color: 'success' })
}

function editMonitor(module?: MonitorModule) {
  Object.assign(monitorForm, module ?? {
    id: crypto.randomUUID(),
    title: '',
    kind: 'http',
    enabled: true,
    description: '',
    url: '',
    method: 'GET',
    expectedStatus: 200,
  })
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

function openShortcut(shortcut: HomeShortcut) {
  window.open(shortcut.url, '_self')
}

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
  <div class="min-h-dvh bg-zinc-950 text-white">
    <section
      class="relative flex min-h-dvh overflow-hidden"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    >
      <div class="absolute inset-0 bg-cover bg-center transition duration-500" :style="{ backgroundImage: `url(${backgroundImage})` }" />
      <div class="absolute inset-0 transition duration-300" :class="heroClass" @click.self="closeShortcuts" />

      <div class="relative z-10 flex min-h-dvh w-full flex-col px-5 py-6">
        <div class="flex justify-end gap-2">
          <UTooltip text="账号">
            <UButton
              :to="userStore.logged ? undefined : '/login'"
              :label="userStore.profile?.nickName || userStore.profile?.userName"
              :icon="userStore.logged ? 'i-lucide-user-check' : 'i-lucide-circle-user-round'"
              color="neutral"
              variant="ghost"
              class="text-white/80 hover:text-white"
            />
          </UTooltip>
          <UTooltip text="设置">
            <UButton icon="i-lucide-settings" color="neutral" variant="ghost" class="text-white/80 hover:text-white" @click="settingsOpen = true" />
          </UTooltip>
        </div>

        <div class="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center pt-[8dvh]">
          <button
            type="button"
            class="text-6xl font-light leading-none text-white drop-shadow-xl transition hover:scale-[1.02] focus:outline-none sm:text-7xl"
            @click.stop="toggleShortcuts"
          >
            {{ time || '--:--' }}
          </button>

          <form
            v-show="!shortcutsOpen"
            class="mt-8 flex h-12 w-full max-w-xl items-center rounded-full bg-zinc-950/72 px-4 shadow-2xl shadow-black/25 ring-1 ring-white/10 transition"
            :class="searchFocused ? 'scale-[1.03] bg-zinc-950/88 ring-2 ring-lime-300/80' : ''"
            @submit.prevent="search"
          >
            <UIcon name="i-simple-icons-google" class="mr-3 size-4 text-zinc-300" />
            <input
              v-model="query"
              class="h-full min-w-0 flex-1 bg-transparent text-center text-sm text-white outline-none placeholder:text-zinc-300"
              placeholder="搜索"
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            >
            <button type="submit" class="ml-3 flex size-8 items-center justify-center rounded-full text-lime-300 transition hover:bg-white/10" aria-label="搜索">
              <UIcon name="i-lucide-search" class="size-5" />
            </button>
          </form>

          <div v-if="shortcutsOpen" class="mt-10 grid w-full max-w-2xl grid-cols-3 gap-x-9 gap-y-7 sm:grid-cols-5">
            <button
              v-for="shortcut in homeStore.shortcuts"
              :key="shortcut.id"
              type="button"
              class="group flex min-w-0 flex-col items-center gap-3"
              @click.stop="openShortcut(shortcut)"
            >
              <span class="flex size-20 items-center justify-center rounded-2xl bg-zinc-950/82 shadow-xl ring-1 ring-white/10 transition group-hover:-translate-y-1 group-hover:bg-zinc-900">
                <UIcon :name="shortcut.icon" class="size-7" :class="toneClass(shortcut.tone)" />
              </span>
              <span class="max-w-24 truncate text-sm font-medium text-white drop-shadow">{{ shortcut.label }}</span>
            </button>
            <button type="button" class="group flex flex-col items-center gap-3" @click.stop="editShortcut()">
              <span class="flex size-20 items-center justify-center rounded-2xl bg-black/35 ring-1 ring-white/10 transition group-hover:bg-black/50">
                <UIcon name="i-lucide-plus" class="size-8 text-white/72" />
              </span>
            </button>
          </div>
        </div>

        <div class="flex justify-center pb-4">
          <UButton to="#monitors" icon="i-lucide-chevron-down" color="neutral" variant="ghost" aria-label="监控模块" class="text-white/75" />
        </div>
      </div>
    </section>

    <section id="monitors" class="min-h-dvh bg-zinc-950 px-5 py-10 text-white">
      <div class="mx-auto max-w-6xl">
        <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-sm text-lime-300">
              {{ userStore.logged ? '已登录' : '未登录' }}
            </p>
            <h1 class="mt-1 text-2xl font-semibold">
              监控面板
            </h1>
          </div>
          <UButton :to="userStore.logged ? undefined : '/login'" :icon="userStore.logged ? 'i-lucide-plus' : 'i-lucide-log-in'" :label="userStore.logged ? '添加模块' : '登录'" @click="userStore.logged && editMonitor()" />
        </div>

        <div v-if="userStore.logged" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="module in enabledModules" :key="module.id" class="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs uppercase text-zinc-400">
                  {{ module.kind === 'http' ? 'HTTP' : 'CUSTOM' }}
                </p>
                <h2 class="mt-1 text-lg font-semibold">
                  {{ module.title }}
                </h2>
              </div>
              <UBadge color="success" variant="subtle">
                已启用
              </UBadge>
            </div>
            <p class="mt-4 min-h-10 text-sm text-zinc-300">
              {{ module.description || '暂无描述' }}
            </p>
            <div v-if="module.kind === 'http'" class="mt-5 rounded-md bg-black/25 p-3 font-mono text-xs text-zinc-300">
              {{ module.method }} {{ module.url }} -> {{ module.expectedStatus }}
            </div>
            <div v-else class="mt-5 rounded-md bg-black/25 p-3 font-mono text-xs text-zinc-300">
              {{ module.componentKey }}
            </div>
          </article>
        </div>

        <div v-else class="rounded-lg border border-white/10 bg-white/[0.06] p-8 text-center">
          <UIcon name="i-lucide-lock" class="mx-auto size-8 text-lime-300" />
          <p class="mt-3 text-sm text-zinc-300">
            登录后展示个人接口监听和自定义监控模块。
          </p>
        </div>
      </div>
    </section>

    <USlideover v-model:open="settingsOpen" title="常用站点">
      <template #body>
        <div class="space-y-5">
          <div class="grid grid-cols-2 gap-2">
            <UButton v-for="shortcut in homeStore.shortcuts" :key="shortcut.id" :icon="shortcut.icon" :label="shortcut.label" color="neutral" variant="subtle" @click="editShortcut(shortcut)" />
          </div>
          <USeparator />
          <UForm :state="shortcutForm" class="space-y-4" @submit="saveShortcut">
            <UFormField label="名称" name="label">
              <UInput v-model="shortcutForm.label" />
            </UFormField>
            <UFormField label="地址" name="url">
              <UInput v-model="shortcutForm.url" />
            </UFormField>
            <UFormField label="图标" name="icon">
              <UInput v-model="shortcutForm.icon" />
            </UFormField>
            <UButton type="submit" icon="i-lucide-save" label="保存" block />
          </UForm>
        </div>
      </template>
    </USlideover>

    <USlideover v-model:open="monitorSettingsOpen" title="监控模块">
      <template #body>
        <UForm :state="monitorForm" class="space-y-4" @submit="saveMonitor">
          <UFormField label="名称" name="title">
            <UInput v-model="monitorForm.title" />
          </UFormField>
          <UFormField label="地址" name="url">
            <UInput v-if="monitorForm.kind === 'http'" v-model="monitorForm.url" />
            <UInput v-else v-model="monitorForm.componentKey" />
          </UFormField>
          <UFormField label="描述" name="description">
            <UTextarea v-model="monitorForm.description" :rows="3" />
          </UFormField>
          <UFormField label="启用" name="enabled">
            <USwitch v-model="monitorForm.enabled" />
          </UFormField>
          <UButton type="submit" icon="i-lucide-save" label="保存" block />
        </UForm>
      </template>
    </USlideover>
  </div>
</template>
