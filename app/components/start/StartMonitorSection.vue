<script setup lang="ts">
import type { MonitorModule } from '#shared/types/home'

defineProps<{
  modules: MonitorModule[]
}>()

const emit = defineEmits<{
  add: []
}>()
</script>

<template>
  <section id="monitors" class="min-h-dvh bg-zinc-950 px-5 py-10 text-white">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-sm text-lime-300">
            已登录
          </p>
          <h1 class="mt-1 text-2xl font-semibold">
            监控面板
          </h1>
        </div>
        <UButton icon="i-lucide-plus" label="添加模块" @click="emit('add')" />
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="module in modules" :key="module.id" class="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20">
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
    </div>
  </section>
</template>
