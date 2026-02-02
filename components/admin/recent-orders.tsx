import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentOrder {
    id: string
    customerName: string
    customerEmail: string | null
    totalAmount: number
}

interface RecentOrdersProps {
    orders: RecentOrder[]
    dict: any
}

export function RecentOrders({ orders, dict }: RecentOrdersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{dict.admin.dashboard_recent_orders || "Recent Orders"}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {orders.map(order => (
                        <div key={order.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{order.customerName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{order.customerName}</p>
                                <p className="text-sm text-muted-foreground">
                                    {order.customerEmail || "No email"}
                                </p>
                            </div>
                            <div className="ml-auto font-medium">
                                +{order.totalAmount.toLocaleString()} KRW
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
