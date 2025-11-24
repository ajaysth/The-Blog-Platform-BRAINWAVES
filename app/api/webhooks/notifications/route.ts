export async function POST(req: Request) {
  const signature = req.headers.get("x-webhook-signature")
  
  // Verify webhook signature
  if (!verifyWebhookSignature(signature)) {
    return new Response("Invalid signature", { status: 401 })
  }

  const data = await req.json()

  // Process notification
  await OptimizedNotificationService.create(data)

  return Response.json({ success: true })
}
