'use client';

import {useLiveQuery} from 'dexie-react-hooks';
import {type IProduct, db} from '@/db';

const useSimilarProducts = (name: string, barcode: string | null, excludeId?: string | null): IProduct[] =>
    useLiveQuery(
        async () => {
            const trimmedName = name.trim().toLowerCase();
            const trimmedBarcode = barcode?.trim() ?? '';
            if (trimmedName.length < 2 && !trimmedBarcode) return [];

            const all = await db.products.toArray();

            return all
                .filter(p => {
                    if (p.id === excludeId) return false;
                    if (trimmedName.length >= 2 && p.name.toLowerCase().includes(trimmedName)) return true;
                    return !!(trimmedBarcode && p.barcode?.trim()?.includes(trimmedBarcode));
                })
                .slice(0, 5);
        },
        [name, barcode, excludeId],
        []
    ) ?? [];

export default useSimilarProducts;
