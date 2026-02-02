import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TopProduct {
    id: string
    title: string
    price: number
    image: string | null
    soldCount: number
}

interface TopProductsProps {
    products: TopProduct[]
    dict: any
}

export function TopProducts({ products, dict }: TopProductsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{dict.admin.dashboard_top_products || "Top Selling Products"}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {products.map(product => (
                        <div key={product.id} className="flex items-center">
                            <span className="w-8 text-center text-muted-foreground text-sm font-bold mr-2">
                                #{product.soldCount}
                            </span>
                            <Avatar className="h-9 w-9 rounded-sm">
                                <AvatarImage src={product.image || undefined} alt={product.title} />
                                <AvatarFallback>{product.title.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{product.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {product.price.toLocaleString()} KRW
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
