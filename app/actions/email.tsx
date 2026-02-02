'use server'

import { prisma } from '@/lib/db'
import { Resend } from 'resend'
import { renderToBuffer } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/pdf/invoice-pdf'
import React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

interface Attachment {
    filename: string
    content: Buffer
}

/**
 * Generic function to send email via Resend or Mock
 */
export async function sendEmail({
    to,
    subject,
    text,
    html,
    attachments = []
}: {
    to: string,
    subject: string,
    text?: string,
    html?: string,
    attachments?: Attachment[]
}) {
    // Check for API Key
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing')
        return { success: false, error: 'Server configuration error: Missing Email API Key' }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Nuna Gom <noreply@nunagom.com>',
            to: [to],
            subject: subject,
            text: text,
            html: html || `<p>${text?.replace(/\n/g, '<br>')}</p>`,
            attachments
        })

        if (error) {
            console.error('Resend error:', error)
            return { success: false, error: error.message }
        }
        return { success: true }
    } catch (error) {
        console.error('Failed to send email:', error)
        return { success: false, error: 'Failed to send email' }
    }
}

export async function sendOrderEmail(
    orderId: string,
    subject: string,
    message: string,
    attachInvoice: boolean
) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } }
        })

        if (!order) {
            return { success: false, error: 'Order not found' }
        }

        const attachments: Attachment[] = []

        if (attachInvoice) {
            try {
                // Generate PDF Buffer
                const pdfBuffer = await renderToBuffer(<InvoicePDF order={order} />)
                attachments.push({
                    filename: `Invoice-${order.id}.pdf`,
                    content: pdfBuffer
                })
            } catch (pdfError) {
                console.error("Failed to generate PDF:", pdfError)
            }
        }

        return await sendEmail({
            to: order.customerEmail || 'delivered@resend.dev',
            subject,
            html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
            attachments
        })
    } catch (error) {
        console.error('Failed to send order email:', error)
        return { success: false, error: 'Failed to send order email' }
    }
}
