import type {IProduct} from '@/db';
import {type ISortDir, type ISortKey, SortDir} from '@/hooks';

export const compareProducts = (a: IProduct, b: IProduct, key: ISortKey, dir: ISortDir): number => {
    const sign = dir === SortDir.asc ? 1 : -1;
    if (key === 'qty') return (a.qty - b.qty) * sign;
    if (key === 'createdAt') return (a.createdAt - b.createdAt) * sign;
    const av = a[key];
    const bv = b[key];
    return av.localeCompare(bv, 'ru') * sign;
};
