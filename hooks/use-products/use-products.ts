'use client';

import {useLiveQuery} from 'dexie-react-hooks';
import {type IProduct, db} from '@/db';
import {compareProducts} from '@/helpers';
import type {IProductsFilter} from './types';

const useProducts = (filter: IProductsFilter): IProduct[] | undefined =>
    useLiveQuery(async () => {
        const all = await db.products.toArray();
        const search = filter.search.trim().toLowerCase();

        const filtered = all.filter(p => {
            if (filter.category && p.category !== filter.category) return false;
            if (filter.onlyOutOfStock && p.qty !== 0) return false;
            return !(
                search &&
                !p.name.toLowerCase().includes(search) &&
                !p.id.toLowerCase().includes(search) &&
                !p.barcode?.toLowerCase().includes(search)
            );
        });

        filtered.sort((a, b) => compareProducts(a, b, filter.sortKey, filter.sortDir));

        return filtered;
    }, [filter.category, filter.onlyOutOfStock, filter.search, filter.sortKey, filter.sortDir]);

export default useProducts;
