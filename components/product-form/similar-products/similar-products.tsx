'use client';

import type {FC} from 'react';
import {CategoryLabel} from '@/constants';
import {useObjectUrl, useSimilarProducts} from '@/hooks';
import type {ISimilarItemProps, ISimilarProductsProps} from './types';
import styles from './similar-products.module.scss';

const SimilarItem: FC<ISimilarItemProps> = ({product, onPick}) => {
    const url = useObjectUrl(product.photoBlob);

    return (
        <li>
            <button type={'button'} className={styles.item} onClick={() => onPick(product)}>
                <span className={styles.thumb}>{!!url && <img src={url} alt={''} />}</span>
                <span className={styles.info}>
                    <span className={styles.name}>{product.name}</span>
                    <span className={styles.meta}>
                        {CategoryLabel[product.category]}
                        {' • '}
                        {product.qty}
                        {' шт.'}
                    </span>
                </span>
            </button>
        </li>
    );
};

const SimilarProducts: FC<ISimilarProductsProps> = ({name, barcode, excludeId, onPick}) => {
    const products = useSimilarProducts(name, barcode, excludeId);
    if (!products.length) return null;

    return (
        <div className={styles.wrap}>
            <div className={styles.label}>{'Похожие товары в базе'}</div>
            <ul className={styles.list}>
                {products.map(p => (
                    <SimilarItem key={p.id} product={p} onPick={onPick} />
                ))}
            </ul>
        </div>
    );
};

export default SimilarProducts;
