export class NotificationBatcher {
  private static queue: Map<string, any[]> = new Map()
  private static batchTimeout: NodeJS.Timeout | null = null
  private static readonly BATCH_DELAY = 1000 // 1 second
  private static readonly BATCH_SIZE = 50

  static async queueNotification(notification: any) {
    const userId = notification.userId
    
    if (!this.queue.has(userId)) {
      this.queue.set(userId, [])
    }

    this.queue.get(userId)!.push(notification)

    // Process if batch size reached
    if (this.queue.get(userId)!.length >= this.BATCH_SIZE) {
      await this.processBatch(userId)
    } else {
      // Schedule batch processing
      this.scheduleBatchProcessing()
    }
  }

  private static scheduleBatchProcessing() {
    if (this.batchTimeout) return

    this.batchTimeout = setTimeout(async () => {
      await this.processAllBatches()
      this.batchTimeout = null
    }, this.BATCH_DELAY)
  }

  private static async processAllBatches() {
    const batches = Array.from(this.queue.entries())
    this.queue.clear()

    await Promise.all(
      batches.map(([userId, notifications]) =>
        this.processBatch(userId, notifications)
      )
    )
  }

  private static async processBatch(userId: string, notifications?: any[]) {
    const batch = notifications || this.queue.get(userId) || []
    if (batch.length === 0) return

    // Deduplicate similar notifications
    const uniqueNotifications = this.deduplicateNotifications(batch)

    // Bulk insert
    await prisma.notification.createMany({
      data: uniqueNotifications,
      skipDuplicates: true,
    })

    // Clear from queue
    this.queue.delete(userId)
  }

  private static deduplicateNotifications(notifications: any[]) {
    const seen = new Set<string>()
    return notifications.filter((notification) => {
      const key = `${notification.userId}-${notification.type}-${notification.postId}-${notification.actorId}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }
}