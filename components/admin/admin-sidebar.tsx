'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    MessageSquare,
    LogOut
} from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'

interface AdminSidebarProps {
    dict: any
    locale: string
}

export function AdminSidebar({ dict, locale }: AdminSidebarProps) {
    const pathname = usePathname()

    const sidebarItems = [
        { href: '/admin', label: dict.admin.dashboard, icon: LayoutDashboard },
        { href: '/admin/products', label: dict.admin.products, icon: Package },
        { href: '/admin/orders', label: dict.admin.orders, icon: ShoppingCart },
        { href: '/admin/inquiries', label: dict.admin.inquiries, icon: MessageSquare },
    ]

    return (
        <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r bg-background flex flex-col">
            <div className="flex h-16 items-center px-6 justify-between border-b">
                <Link href="/admin" className="font-bold text-lg text-primary">
                    Nuna Gom Admin
                </Link>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                                isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t space-y-4">
                <div className="flex items-center justify-between px-2">
                    <span className="text-xs text-muted-foreground">Language</span>
                    <LanguageSwitcher currentLocale={locale} />
                </div>
                <form action={logoutAction}>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-red-500">
                        <LogOut className="h-4 w-4" />
                        {dict.admin.logout}
                    </Button>
                </form>
            </div>
        </aside>
    )
}
