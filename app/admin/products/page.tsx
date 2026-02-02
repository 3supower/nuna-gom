import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteProduct } from '@/app/actions/product'
import { getDictionary } from '@/lib/i18n'

export default async function ProductsPage() {
    const dict = await getDictionary()
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{dict.admin.product_list.title}</h1>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" /> {dict.admin.product_list.add_new}
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{dict.admin.product_list.th_image}</TableHead>
                            <TableHead>{dict.admin.product_list.th_name}</TableHead>
                            <TableHead>{dict.admin.product_list.th_price}</TableHead>
                            <TableHead>{dict.admin.product_list.th_stock}</TableHead>
                            <TableHead className="w-[100px]">{dict.admin.product_list.th_actions}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    {product.images[0] && (
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="h-10 w-10 rounded-md object-cover bg-muted"
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{product.title}</TableCell>
                                <TableCell>{product.price.toLocaleString()} {dict.product.price_unit}</TableCell>
                                <TableCell>
                                    {product.madeToOrder ? (
                                        <span className="text-amber-600 text-xs font-medium">{dict.admin.product_list.made_to_order}</span>
                                    ) : (
                                        <span>{product.stock} {dict.admin.product_list.in_stock}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>{dict.admin.product_list.th_actions}</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <Pencil className="mr-2 h-4 w-4" /> {dict.admin.product_list.edit}
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                <form action={deleteProduct.bind(null, product.id)} className="w-full flex items-center">
                                                    <button type="submit" className="flex items-center w-full">
                                                        <Trash className="mr-2 h-4 w-4" /> {dict.admin.product_list.delete}
                                                    </button>
                                                </form>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    {dict.admin.product_list.empty}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
