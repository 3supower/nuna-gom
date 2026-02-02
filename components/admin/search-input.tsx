'use client'

import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export function SearchInput({ placeholder }: { placeholder: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className="relative max-w-sm">
            <Input
                placeholder={placeholder}
                defaultValue={searchParams.get('q')?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
            />
        </div>
    )
}
