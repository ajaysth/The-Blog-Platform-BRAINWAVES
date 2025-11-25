// actions/comment.action.ts
"use server"

import prisma from "@/lib/prisma"
import { NotificationHelpers } from "@/lib/services/notification.service"
import { revalidatePath } from "next/cache"