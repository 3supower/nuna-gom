import { getDictionary, getLocale } from '@/lib/i18n'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const dict = await getDictionary()
    const locale = await getLocale()

    return (
        <div className="flex min-h-screen bg-muted/20">
            <AdminSidebar dict={dict} locale={locale} />

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
