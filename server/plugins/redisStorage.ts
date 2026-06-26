import memoryDriver from 'unstorage/drivers/memory'
import redisDriver from 'unstorage/drivers/redis'

export default defineNitroPlugin(() => {
  const storage = useStorage()
  const redisConfig = useRuntimeConfig().redis

  storage.mount('redis', redisConfig.host
    ? redisDriver({
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
      })
    : memoryDriver())
})
