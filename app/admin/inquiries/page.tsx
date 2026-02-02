import { prisma } from '@/lib/db'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { getDictionary } from '@/lib/i18n'
import { InquiryRow } from '@/components/admin/inquiry-row'

export default async function InquiriesPage() {
    const dict = await getDictionary()
    const inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-serif text-primary">{dict.admin.inquiry_list.title}</h1>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{dict.admin.inquiry_list.th_date}</TableHead>
                            <TableHead>{dict.admin.inquiry_list.th_customer}</TableHead>
                            <TableHead>{dict.admin.inquiry_list.th_contact}</TableHead>
                            <TableHead>{dict.admin.inquiry_list.th_message}</TableHead>
                            <TableHead>{dict.admin.order_list.th_status}</TableHead>
                            <TableHead className="w-[100px]">{dict.admin.order_list.th_actions}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inquiries.map((inquiry) => (
                            <InquiryRow key={inquiry.id} inquiry={inquiry} dict={dict} />
                        ))}
                        {inquiries.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    {dict.admin.inquiry_list.empty}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
