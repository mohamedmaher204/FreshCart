"use client"
import React, { useEffect } from 'react'
import { useTrackActivity } from '@/app/_hooks/useTrackActivity'

export default function TrackProductView({ productId }: { productId: string }) {
    const { trackAction } = useTrackActivity();

    useEffect(() => {
        // Track the view action when the product page is loaded
        if (productId) {
            trackAction(productId, 'VIEW');
        }
    }, [productId]);

    return null; // This is a logic-only component
}
