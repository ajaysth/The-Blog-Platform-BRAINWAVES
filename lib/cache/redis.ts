


import { Redis } from "@upstash/redis"







let redis: Redis | null = null;







if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {



  redis = new Redis({



    url: process.env.UPSTASH_REDIS_REST_URL,



    token: process.env.UPSTASH_REDIS_REST_TOKEN,



  });



} else {



  console.warn("Upstash Redis credentials are not fully configured. Notification caching will be disabled.");



}







export class NotificationCache {



  private static readonly CACHE_TTL = 60 // seconds



  private static readonly UNREAD_COUNT_KEY = (userId: string) => `unread:${userId}`



  private static readonly NOTIFICATIONS_KEY = (userId: string, page: number) => 



    `notifications:${userId}:${page}`







  static async getUnreadCount(userId: string): Promise<number | null> {



    if (!redis) return null;



    return await redis.get(this.UNREAD_COUNT_KEY(userId))



  }







  static async setUnreadCount(userId: string, count: number) {



    if (!redis) return;



    await redis.setex(this.UNREAD_COUNT_KEY(userId), this.CACHE_TTL, count)



  }







  static async invalidateUnreadCount(userId: string) {



    if (!redis) return;



    await redis.del(this.UNREAD_COUNT_KEY(userId))



  }







  static async getNotifications(userId: string, page: number): Promise<any | null> { 



    if (!redis) return null;



    const key = this.NOTIFICATIONS_KEY(userId, page); 



    const cached = await redis.get(key);



    return cached;



  }







  static async setNotifications(userId: string, page: number, data: any) {



    if (!redis) return;



    await redis.setex(



      this.NOTIFICATIONS_KEY(userId, page),



      this.CACHE_TTL,



      JSON.stringify(data)



    )



  }







  static async invalidateNotifications(userId: string) {



    if (!redis) return;



    const pattern = `notifications:${userId}:*`



    const keys = await redis.keys(pattern)



    if (keys.length > 0) {



      await redis.del(...keys)



    }



  }



}