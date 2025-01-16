import { Redis } from '@upstash/redis'

class RateLimit {
  private redis: Redis
  private readonly WINDOW_SIZE: number // в секунди
  private readonly MAX_REQUESTS: number

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL!,
      token: process.env.UPSTASH_REDIS_TOKEN!
    })
    this.WINDOW_SIZE = 60 // 1 минута
    this.MAX_REQUESTS = 20 // максимум заявки за минута
  }

  async check(identifier: string): Promise<{ success: boolean; remaining: number }> {
    const key = `rate-limit:${identifier}`
    const now = Math.floor(Date.now() / 1000)
    const windowStart = now - this.WINDOW_SIZE

    try {
      // Премахване на стари записи
      await this.redis.zremrangebyscore(key, 0, windowStart)

      // Вземане на броя заявки в текущия прозорец
      const requestCount = await this.redis.zcount(key, windowStart, now)

      if (requestCount >= this.MAX_REQUESTS) {
        return { success: false, remaining: 0 }
      }

      // Добавяне на нова заявка
      await this.redis.zadd(key, { score: now, member: now.toString() })
      await this.redis.expire(key, this.WINDOW_SIZE)

      return {
        success: true,
        remaining: this.MAX_REQUESTS - requestCount - 1
      }
    } catch (error) {
      console.error('Rate limit check error:', error)
      // При грешка позволяваме заявката
      return { success: true, remaining: 0 }
    }
  }
}

export const rateLimit = new RateLimit()