'use client';

import {type FC, useState} from 'react';
import type {IProduct} from '@/db';
import {type IProductsFilter, SortDir, SortKey, useProducts} from '@/hooks';
import {Spinner} from '@/components';
import {FilterBar} from './filter-bar';
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
    const [filter, setFilter] = useState<IProductsFilter>(initialFilter);
    const [openPhoto, setOpenPhoto] = useState<IProduct | null>(null);
    const products = useProducts(filter);

    return (
        <div className={styles.wrap}>
            <FilterBar
                {...filter}
                onSearch={v => setFilter(prev => ({...prev, search: v}))}
                onCategory={v => setFilter(prev => ({...prev, category: v}))}
                onOutOfStock={v => setFilter(prev => ({...prev, onlyOutOfStock: v}))}
                onSortKey={v => setFilter(prev => ({...prev, sortKey: v}))}
                onSortDir={v => setFilter(prev => ({...prev, sortDir: v}))}
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
                </div>
            )}
            <PhotoModal blob={openPhoto?.photoBlob ?? null} open={!!openPhoto} onClose={() => setOpenPhoto(null)} />
        </div>
    );
};

export default ProductGrid;
