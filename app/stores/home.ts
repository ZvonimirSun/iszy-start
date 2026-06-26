import type { HomeShortcut, MonitorModule } from '#shared/types/home'
import { useLocalStorage } from '@vueuse/core'

const defaultShortcuts: HomeShortcut[] = [
  { id: 'translate', label: '翻译', url: 'https://translate.google.com/', icon: 'i-lucide-languages', tone: 'blue' },
  { id: 'github', label: 'GitHub', url: 'https://github.com/', icon: 'i-simple-icons-github', tone: 'zinc' },
  { id: 'images', label: '图片', url: 'https://images.google.com/', icon: 'i-lucide-image', tone: 'rose' },
  { id: 'docs', label: '文档', url: 'https://docs.google.com/', icon: 'i-lucide-file-text', tone: 'amber' },
  { id: 'drive', label: '网盘', url: 'https://drive.google.com/', icon: 'i-lucide-cloud', tone: 'sky' },
  { id: 'mail', label: '邮箱', url: 'https://mail.google.com/', icon: 'i-lucide-mail', tone: 'rose' },
  { id: 'music', label: '音乐', url: 'https://music.youtube.com/', icon: 'i-lucide-music', tone: 'violet' },
  { id: 'video', label: '视频', url: 'https://www.youtube.com/', icon: 'i-lucide-play', tone: 'rose' },
]

const defaultModules: MonitorModule[] = [
  {
    id: 'api-gateway',
    title: '主 API 可用性',
    kind: 'http',
    enabled: true,
    description: '预留的自定义接口监听示例，可在设置中替换为真实地址。',
    url: 'https://example.com/health',
    method: 'GET',
    expectedStatus: 200,
  },
  {
    id: 'custom-slot',
    title: '自定义监控模块',
    kind: 'custom',
    enabled: false,
    description: '扩展类型占位，后续可映射到组件注册表。',
    componentKey: 'placeholder',
  },
]

export const useHomeStore = defineStore('home', () => {
  const shortcuts = useLocalStorage<HomeShortcut[]>('iszy-home:shortcuts', defaultShortcuts)
  const monitorModules = useLocalStorage<MonitorModule[]>('iszy-home:monitor-modules', defaultModules)

  function upsertShortcut(shortcut: HomeShortcut) {
    const index = shortcuts.value.findIndex((item: HomeShortcut) => item.id === shortcut.id)
    if (index >= 0) {
      shortcuts.value[index] = shortcut
      return
    }
    shortcuts.value.push(shortcut)
  }

  function removeShortcut(id: string) {
    shortcuts.value = shortcuts.value.filter((item: HomeShortcut) => item.id !== id)
  }

  function upsertMonitorModule(module: MonitorModule) {
    const index = monitorModules.value.findIndex((item: MonitorModule) => item.id === module.id)
    if (index >= 0) {
      monitorModules.value[index] = module
      return
    }
    monitorModules.value.push(module)
  }

  return {
    shortcuts,
    monitorModules,
    upsertShortcut,
    removeShortcut,
    upsertMonitorModule,
  }
})
