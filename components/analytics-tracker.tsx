'use client'

import { useEffect, useRef } from 'react'
import { trackVisit } from '@/app/actions/analytics'

export function AnalyticsTracker() {
    const executedRef = useRef(false)

    useEffect(() => {
        if (executedRef.current) return
        executedRef.current = true
        trackVisit()
    }, [])

    return null
}
