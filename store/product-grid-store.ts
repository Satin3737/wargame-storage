import {type IProductsFilter, type IProductsFilterKeys, SortDir, SortKey} from '@/hooks';
import {createStore, partializeExclude} from './create-store';

interface IState {
    filter: IProductsFilter;
    page: number;
    scrollY: number;
}

interface IStore extends IState {
    updateFilter: <K extends IProductsFilterKeys>(key: K, value: IProductsFilter[K]) => void;
    setPage: (page: number) => void;
    setScrollY: (y: number) => void;
}

const initialFilter = (): IProductsFilter => ({
    search: '',
    category: null,
    onlyOutOfStock: false,
    isPriceReduction: false,
    isUsed: false,
    sortKey: SortKey.createdAt,
    sortDir: SortDir.desc
});

const useProductGridStore = createStore<IStore>({
    store: set => ({
        filter: initialFilter(),
        page: 1,
        scrollY: 0,
        updateFilter: (key, value) =>
            set(state => {
                state.filter[key] = value;
                state.page = 1;
            }),
        setPage: page => set({page}),
        setScrollY: y => set({scrollY: y})
    }),
    partialize: state => partializeExclude(state, ['scrollY']),
    name: 'productGridStore'
});

export default useProductGridStore;
