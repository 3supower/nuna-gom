import { ProductForm } from '@/components/admin/product-form'
import { getDictionary } from '@/lib/i18n'

export default async function NewProductPage() {
    const dict = await getDictionary()
    return <ProductForm dict={dict} />
}
