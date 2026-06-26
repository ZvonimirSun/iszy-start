<script setup lang="ts">
import type { MonitorModule } from '#shared/types/home'

const emit = defineEmits<{
  save: []
}>()

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<MonitorModule>('form', { required: true })
</script>

<template>
  <USlideover v-model:open="open" title="监控模块">
    <template #body>
      <UForm :state="form" class="space-y-4" @submit="emit('save')">
        <UFormField label="名称" name="title">
          <UInput v-model="form.title" />
        </UFormField>
        <UFormField label="地址" name="url">
          <UInput v-if="form.kind === 'http'" v-model="form.url" />
          <UInput v-else v-model="form.componentKey" />
        </UFormField>
        <UFormField label="描述" name="description">
          <UTextarea v-model="form.description" :rows="3" />
        </UFormField>
        <UFormField label="启用" name="enabled">
          <USwitch v-model="form.enabled" />
        </UFormField>
        <UButton type="submit" icon="i-lucide-save" label="保存" block />
      </UForm>
    </template>
  </USlideover>
</template>
