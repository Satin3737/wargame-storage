'use client';

import {type FC, useEffect, useState} from 'react';
import type {IProduct} from '@/db';
import {useProducts} from '@/hooks';
import {Spinner} from '@/components';
import {useProductGridStore} from '@/store';
import {FilterBar} from './filter-bar';
import {Pagination} from './pagination';
import {PhotoModal} from './photo-modal';
import {ProductCard} from './product-card';
import styles from './product-grid.module.scss';

const ProductGrid: FC = () => {
    const {filter, page, updateFilter, setPage} = useProductGridStore();
    const [openPhoto, setOpenPhoto] = useState<IProduct | null>(null);
    const {products = [], totalPages = 1} = useProducts({page, filter}) ?? {};

    useEffect(() => {
        const {scrollY, setScrollY} = useProductGridStore.getState();
        if (scrollY > 0) {
            window.scrollTo({top: scrollY, behavior: 'instant'});
            setScrollY(0);
        }
    }, []);

    return (
        <div className={styles.wrap}>
            <FilterBar
                {...filter}
                onSearch={v => updateFilter('search', v)}
                onCategory={v => updateFilter('category', v)}
                onOutOfStock={v => updateFilter('onlyOutOfStock', v)}
                onIsPriceReduction={v => updateFilter('isPriceReduction', v)}
                onIsUsed={v => updateFilter('isUsed', v)}
                onSortKey={v => updateFilter('sortKey', v)}
                onSortDir={v => updateFilter('sortDir', v)}
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
