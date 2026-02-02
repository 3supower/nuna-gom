'use server'

import { prisma } from '@/lib/db'

export async function trackVisit() {
    try {
        const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

        await prisma.dailyVisit.upsert({
            where: { date: today },
            update: { count: { increment: 1 } },
            create: { date: today, count: 1 }
        })
        return { success: true }
    } catch (error) {
        console.error("Failed to track visit:", error)
        return { success: false }
    }
}
