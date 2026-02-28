"use client"
import { useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export function useTrackActivity() {
    const { data: session } = useSession();

    const trackAction = async (productId: string, action: 'VIEW' | 'ADD_TO_CART' | 'PURCHASE') => {
        if (!session) return; // Only track logged-in users for personalized results

        try {
            await axios.post('/api/activity', { productId, action });
        } catch (error) {
            // Silently fail to not interrupt user experience
            console.error("Tracking failed:", error);
        }
    };

    return { trackAction };
}
