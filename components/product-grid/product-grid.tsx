'use client';

import {type FC, useState} from 'react';
import type {IProduct} from '@/db';
import {type IProductsFilter, type IProductsFilterKeys, SortDir, SortKey, useProducts} from '@/hooks';
import {Spinner} from '@/components';
import {FilterBar} from './filter-bar';
import {Pagination} from './pagination';
import {PhotoModal} from './photo-modal';
import {ProductCard} from './product-card';
import styles from './product-grid.module.scss';

const initialFilter: IProductsFilter = {
    search: '',
    category: null,
    onlyOutOfStock: false,
    sortKey: SortKey.createdAt,
    sortDir: SortDir.desc
};

const ProductGrid: FC = () => {
    const [page, setPage] = useState<number>(1);
    const [filter, setFilter] = useState<IProductsFilter>(initialFilter);
    const [openPhoto, setOpenPhoto] = useState<IProduct | null>(null);
    const {products = [], totalPages = 1} = useProducts({page, filter}) ?? {};

    const updateFilters = <T,>(value: T, key: IProductsFilterKeys) => {
        setFilter(prev => ({...prev, [key]: value}));
        setPage(1);
    };

    return (
        <div className={styles.wrap}>
            <FilterBar
                {...filter}
                onSearch={v => updateFilters(v, 'search')}
                onCategory={v => updateFilters(v, 'category')}
                onOutOfStock={v => updateFilters(v, 'onlyOutOfStock')}
                onSortKey={v => updateFilters(v, 'sortKey')}
                onSortDir={v => updateFilters(v, 'sortDir')}
            />
            {!products ? (
                <div className={styles.empty}>
                    <Spinner size={28} />
                </div>
            ) : !products.length ? (
                <div className={styles.empty}>
                    <div className={styles.emptyTitle}>{'Список пуст'}</div>
                    <div className={styles.emptyText}>{'Добавьте первый товар через кнопку «Добавить»'}</div>
                </div>
            ) : (
                <div className={styles.list}>
                    {products.map(p => (
                        <ProductCard key={p.id} product={p} onPhotoClick={setOpenPhoto} />
                    ))}
                    <Pagination page={page} totalPages={totalPages} setPage={setPage} className={styles.pagination} />
                </div>
            )}
            <PhotoModal blob={openPhoto?.photoBlob ?? null} open={!!openPhoto} onClose={() => setOpenPhoto(null)} />
        </div>
    );
};

export default ProductGrid;
