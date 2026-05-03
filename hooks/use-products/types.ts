import type {ICategory} from '@/constants';

export const SortKey = {
    id: 'id',
    name: 'name',
    category: 'category',
    qty: 'qty',
    createdAt: 'createdAt'
} as const;

export type ISortKey = (typeof SortKey)[keyof typeof SortKey];

export const SortDir = {
    asc: 'asc',
    desc: 'desc'
} as const;

export type ISortDir = (typeof SortDir)[keyof typeof SortDir];

export interface IProductsFilter {
    category: ICategory | null;
    onlyOutOfStock: boolean;
    search: string;
    sortKey: ISortKey;
    sortDir: ISortDir;
}
