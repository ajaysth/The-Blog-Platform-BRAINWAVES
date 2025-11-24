
import prisma from "@/lib/prisma";



export async function monitorNotifications() {
  // Check notification queue size
  const queueSize = await redis.llen("notification:queue")
  
  if (queueSize > 10000) {
    console.warn("Notification queue is growing too large:", queueSize)
    // Trigger alert
  }

  // Check database performance
  const slowQueries = await prisma.$queryRaw`
    SELECT query, mean_exec_time 
    FROM pg_stat_statements 
    WHERE query LIKE '%notifications%' 
    AND mean_exec_time > 100
    ORDER BY mean_exec_time DESC 
    LIMIT 10
  `

  console.log("Slow notification queries:", slowQueries)
}
