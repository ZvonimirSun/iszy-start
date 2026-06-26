export type ShortcutIconTone = 'blue' | 'green' | 'rose' | 'amber' | 'violet' | 'sky' | 'zinc'

export interface SearchEngine {
  id: string
  label: string
  icon: string
  searchUrl: string
  homeUrl: string
}

export interface HomePageSettings {
  backgroundImage: string
  searchEngineId: string
  dockEnabled: boolean
}

export interface HomeShortcut {
  id: string
  label: string
  url: string
  icon: string
  tone: ShortcutIconTone
}

export type MonitorModuleKind = 'http' | 'custom'

export interface MonitorModuleBase {
  id: string
  title: string
  kind: MonitorModuleKind
  enabled: boolean
  description?: string
}

export interface HttpMonitorModule extends MonitorModuleBase {
  kind: 'http'
  url: string
  method: 'GET' | 'POST'
  expectedStatus: number
}

export interface CustomMonitorModule extends MonitorModuleBase {
  kind: 'custom'
  componentKey: string
  config?: Record<string, unknown>
}

export type MonitorModule = HttpMonitorModule | CustomMonitorModule
