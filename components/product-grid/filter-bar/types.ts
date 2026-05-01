import type {ICategory} from '@/constants';
import type {ISortDir, ISortKey} from '@/hooks';

export interface IFilterBarProps {
    search: string;
    category: ICategory | null;
    onlyOutOfStock: boolean;
    sortKey: ISortKey;
    sortDir: ISortDir;
    onSearch: (value: string) => void;
    onCategory: (value: ICategory | null) => void;
    onOutOfStock: (value: boolean) => void;
    onSortKey: (value: ISortKey) => void;
    onSortDir: (value: ISortDir) => void;
}
