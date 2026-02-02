import { prisma } from '@/lib/db'
import { getDictionary } from '@/lib/i18n'
import { SummaryCards } from '@/components/admin/summary-cards'
import { DashboardCharts } from '@/components/admin/dashboard-charts'
import { OrderStatusChart } from '@/components/admin/order-status-chart'
import { RecentOrders } from '@/components/admin/recent-orders'
import { TopProducts } from '@/components/admin/top-products'

export default async function AdminDashboardPage() {
    const dict = await getDictionary()

    // 1. Order Status Counts
    const statusCounts = await prisma.order.groupBy({
        by: ['status'],
        _count: {
            status: true
        }
    })
    const statusData = statusCounts.map(item => {
        const statusKey = item.status.toLowerCase()
        const statusLabel = (dict.admin.order_list.status as any)[statusKey] || item.status
        return {
            name: statusLabel,
            value: item._count.status
        }
    })

    // 2. Revenue Trend (Last 30 Days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const revenueOrders = await prisma.order.findMany({
        where: {
            createdAt: { gte: thirtyDaysAgo },
            status: { not: 'CANCELLED' } // Exclude cancelled orders
        },
        select: {
            createdAt: true,
            totalAmount: true
        }
    })

    const revenueMap = new Map<string, number>()
    // Initialize last 30 days with 0
    for (let i = 0; i < 30; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        // Format as MM/DD
        const key = `${d.getMonth() + 1}/${d.getDate()}`
        revenueMap.set(key, 0)
    }

    revenueOrders.forEach(order => {
        const d = new Date(order.createdAt)
        const key = `${d.getMonth() + 1}/${d.getDate()}`
        if (revenueMap.has(key)) {
            revenueMap.set(key, (revenueMap.get(key) || 0) + order.totalAmount)
        }
    })

    // Convert map to array and reverse to show chronological order
    const revenueData = Array.from(revenueMap.entries())
        .map(([name, total]) => ({ name, total }))
        .reverse()


    // 3. Recent Orders
    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            customerName: true,
            customerEmail: true,
            totalAmount: true,
            status: true
        }
    })


    // 4. Top Selling Products
    const topItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true
        },
        orderBy: {
            _sum: {
                quantity: 'desc'
            }
        },
        take: 5
    })

    const topProductIds = topItems.map(item => item.productId)
    const products = await prisma.product.findMany({
        where: { id: { in: topProductIds } },
        select: { id: true, title: true, price: true, images: true }
    })

    const topProducts = topItems.map(item => {
        const product = products.find(p => p.id === item.productId)
        return {
            id: item.productId,
            title: product?.title || 'Unknown Product',
            price: product?.price || 0,
            image: product?.images[0] || null,
            soldCount: item._sum.quantity || 0
        }
    })

    // 5. Summary Counts
    const productCount = await prisma.product.count()
    const orderCount = await prisma.order.count()
    const inquiryCount = await prisma.inquiry.count()

    const todayStr = new Date().toISOString().split('T')[0]
    const todayVisit = await prisma.dailyVisit.findUnique({ where: { date: todayStr } })
    const totalVisitsToday = todayVisit?.count || 0

    // 6. Daily Visits (Last 30 Days)
    const visits = await prisma.dailyVisit.findMany({
        where: { date: { gte: thirtyDaysAgo.toISOString().split('T')[0] } },
        orderBy: { date: 'asc' }
    })
    const visitData = visits.map(v => ({
        date: v.date.substring(5), // MM-DD
        count: v.count
    }))

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">{dict.admin.dashboard}</h1>

            {/* Row 1: Summary Cards */}
            <SummaryCards
                summary={{
                    totalProducts: productCount,
                    totalOrders: orderCount,
                    totalInquiries: inquiryCount,
                    totalVisitsToday
                }}
                dict={dict}
            />

            {/* Row 2: Charts (Revenue & Visits) */}
            <DashboardCharts
                revenueData={revenueData}
                visitData={visitData}
                dict={dict}
            />

            {/* Row 3: Status, Top Products, Recent Orders */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <OrderStatusChart statusData={statusData} dict={dict} />
                <TopProducts products={topProducts} dict={dict} />
                <RecentOrders orders={recentOrders} dict={dict} />
            </div>
        </div>
    )
}
