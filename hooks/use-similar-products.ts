'use client';

import {useLiveQuery} from 'dexie-react-hooks';
import {IProduct, db} from '@/db';

const useSimilarProducts = (query: string, excludeId?: string | null): IProduct[] =>
    useLiveQuery(
        async () => {
            const trimmed = query.trim().toLowerCase();
            if (trimmed.length < 2) return [];
            const all = await db.products.toArray();
            return all.filter(p => p.id !== excludeId && p.name.toLowerCase().includes(trimmed)).slice(0, 5);
        },
        [query, excludeId],
        []
    ) ?? [];

export default useSimilarProducts;
