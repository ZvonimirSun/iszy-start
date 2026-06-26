<script setup lang="ts">
import type { HomeShortcut } from '#shared/types/home'

defineProps<{
  shortcuts: HomeShortcut[]
}>()

const emit = defineEmits<{
  edit: [shortcut: HomeShortcut]
  save: []
}>()

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<HomeShortcut>('form', { required: true })
</script>

<template>
  <USlideover v-model:open="open" title="常用站点">
    <template #body>
      <div class="space-y-5">
        <div class="grid grid-cols-2 gap-2">
          <UButton
            v-for="shortcut in shortcuts"
            :key="shortcut.id"
            :icon="shortcut.icon"
            :label="shortcut.label"
            color="neutral"
            variant="subtle"
            @click="emit('edit', shortcut)"
          />
        </div>
        <USeparator />
        <UForm :state="form" class="space-y-4" @submit="emit('save')">
          <UFormField label="名称" name="label">
            <UInput v-model="form.label" />
          </UFormField>
          <UFormField label="地址" name="url">
            <UInput v-model="form.url" />
          </UFormField>
          <UFormField label="图标" name="icon">
            <UInput v-model="form.icon" />
          </UFormField>
          <UButton type="submit" icon="i-lucide-save" label="保存" block />
        </UForm>
      </div>
    </template>
  </USlideover>
</template>
