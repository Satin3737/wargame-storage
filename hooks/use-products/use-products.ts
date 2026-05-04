'use client';

import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '@/db';
import {compareProducts} from '@/helpers';
import {IProductsGridData, IUseProductsParams} from './types';

const useProducts = ({filter, page, pageSize = 50}: IUseProductsParams): IProductsGridData | undefined => {
    return useLiveQuery<IProductsGridData>(async () => {
        const {search, category, sortKey, sortDir, onlyOutOfStock} = filter;
        const all = await db.products.toArray();
        const searchTrimmed = search.trim().toLowerCase();

        const allProducts = all.filter(p => {
            if (category && p.category !== category) return false;
            if (onlyOutOfStock && p.qty !== 0) return false;
            return !(
                searchTrimmed &&
                !p.name.toLowerCase().includes(searchTrimmed) &&
                !p.id.toLowerCase().includes(searchTrimmed) &&
                !p.barcode?.toLowerCase().includes(searchTrimmed)
            );
        });

        allProducts.sort((a, b) => compareProducts(a, b, sortKey, sortDir));

        const totalPages = allProducts ? Math.ceil(allProducts.length / pageSize) : 0;
        const products = allProducts ? allProducts.slice((page - 1) * pageSize, page * pageSize) : [];

        return {products, totalPages};
    }, [filter, page, pageSize]);
};

export default useProducts;
