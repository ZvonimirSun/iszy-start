import ms from 'ms'

export default defineNuxtConfig({
  extends: ['@zvonimirsun/iszy-nuxt-auth-layer'],
  runtimeConfig: {
    public: {
      url: 'http://localhost:3000',
      title: 'ISZY Home',
      subtitle: '浏览器起始页',
      description: '聚合 Google 搜索、常用站点、账号登录和个人监控模块的浏览器起始页。',
      apiOrigin: '',
      backgroundImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=85',
      piniaPluginPersistedstate: {
        storage: 'indexedDB',
        cookieOptions: {
          maxAge: ms('10y'),
          refresh: true,
          sameSite: 'lax',
        },
        indexedDBOptions: {
          name: 'iszy_start',
          storeName: 'state',
          debounce: 300,
        },
      },
    },
    redis: {
      host: '',
      port: 6379,
      password: undefined,
    },
    session: {
      cookieName: 'ISZY_HOME_SESSION_ID',
      maxAge: '7d',
      domain: '',
    },
  },
  compatibilityDate: '2026-03-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@zvonimirsun/pinia-plugin-persistedstate/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    optimizeDeps: {
      include: ['reka-ui'],
    },
  },
})
