'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/app/actions/email'

interface ReplyOptions {
    sendEmail?: boolean
    emailSubject?: string
    emailContent?: string
    emailAddress?: string
}

export async function replyToInquiry(id: string, answer: string, options?: ReplyOptions) {
    try {
        // 1. Update DB first
        const inquiry = await prisma.inquiry.update({
            where: { id },
            data: {
                answer,
                isReplied: true,
                repliedAt: new Date(),
            },
        })

        // 2. Send Email if requested
        if (options?.sendEmail) {
            const recipient = options.emailAddress || inquiry.contact

            // Simple email validation check
            if (!recipient.includes('@')) {
                return { success: true, emailSent: false, error: 'Invalid email address' }
            }

            const subject = options.emailSubject || `[Nuna Gom] Reply to your inquiry`
            // Use provided email content or falling back to db answer
            const htmlContent = (options.emailContent || answer).replace(/\n/g, '<br>')

            const emailResult = await sendEmail({
                to: recipient,
                subject: subject,
                html: htmlContent
            })

            if (!emailResult.success) {
                return { success: true, emailSent: false, error: emailResult.error }
            }
            return { success: true, emailSent: true }
        }

        revalidatePath('/admin/inquiries')
        return { success: true }
    } catch (error) {
        console.error('Failed to reply to inquiry:', error)
        return { success: false, error: 'Failed to save reply' }
    }
}
