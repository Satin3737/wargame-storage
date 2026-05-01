'use client';

import {useLiveQuery} from 'dexie-react-hooks';
import {IProduct, db} from '@/db';

const useProduct = (id: string | null | undefined): IProduct | undefined | null =>
    useLiveQuery(async () => {
        if (!id) return null;
        return (await db.products.get(id)) ?? null;
    }, [id]);

export default useProduct;
