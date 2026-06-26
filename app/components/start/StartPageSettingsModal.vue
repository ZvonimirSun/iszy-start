<script setup lang="ts">
import type { HomePageSettings, SearchEngine } from '#shared/types/home'

defineProps<{
  searchEngines: SearchEngine[]
}>()

const open = defineModel<boolean>('open', { required: true })
const settings = defineModel<HomePageSettings>('settings', { required: true })
</script>

<template>
  <UModal v-model:open="open" title="常规设置" :ui="{ content: 'max-w-lg' }">
    <template #body>
      <UForm :state="settings" class="space-y-5">
        <UFormField label="默认搜索引擎" name="searchEngineId">
          <USelect
            v-model="settings.searchEngineId"
            :items="searchEngines.map(item => ({ label: item.label, value: item.id, icon: item.icon }))"
          />
        </UFormField>
        <UFormField label="壁纸地址" name="backgroundImage">
          <UInput v-model="settings.backgroundImage" placeholder="留空使用默认壁纸" />
        </UFormField>
        <UFormField label="显示底部 Dock" name="dockEnabled">
          <USwitch v-model="settings.dockEnabled" />
        </UFormField>
      </UForm>
    </template>
  </UModal>
</template>
