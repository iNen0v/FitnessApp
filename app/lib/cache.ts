interface CacheItem<T> {
    data: T
    timestamp: number
  }
  
  class Cache {
    private cache: Map<string, CacheItem<any>>
    private readonly TTL: number // Time To Live в милисекунди
  
    constructor(ttlMinutes: number = 60) {
      this.cache = new Map()
      this.TTL = ttlMinutes * 60 * 1000
    }
  
    set(key: string, data: any): void {
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      })
    }
  
    get<T>(key: string): T | null {
      const item = this.cache.get(key)
      if (!item) return null
  
      if (Date.now() - item.timestamp > this.TTL) {
        this.cache.delete(key)
        return null
      }
  
      return item.data as T
    }
  
    clear(): void {
      this.cache.clear()
    }
  }
  
  export const aiResponseCache = new Cache(60)