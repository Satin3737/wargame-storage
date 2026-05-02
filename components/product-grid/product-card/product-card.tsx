'use client';

import {MinusIcon, PencilSimpleIcon, PlusIcon} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import type {FC} from 'react';
import {productsService} from '@/db';
import {CategoryLabel} from '@/constants';
import {hapticsService, toastService} from '@/services';
import {useObjectUrl} from '@/hooks';
import {IconBtnSize, IconButton} from '@/components';
import type {IProductCardProps} from './types';
import styles from './product-card.module.scss';

const ProductCard: FC<IProductCardProps> = ({product, onPhotoClick}) => {
    const {id, name, barcode, qty, category, photoBlob} = product;
    const thumb = useObjectUrl(photoBlob);

    const adjust = async (delta: number) => {
        try {
            await productsService.incrementQty(product.id, delta);
            hapticsService.tap();
        } catch {
            toastService.error('Не удалось обновить');
        }
    };

    return (
        <article className={styles.card} style={{viewTransitionName: `product-${id}`}}>
            <button
                type={'button'}
                className={styles.photoBtn}
                onClick={() => onPhotoClick(product)}
                aria-label={'open photo'}
            >
                {thumb ? (
                    <img className={styles.photo} src={thumb} alt={`Товар ${name}`} />
                ) : (
                    <span className={styles.photoPlaceholder}>{'—'}</span>
                )}
            </button>
            <div className={styles.info}>
                <div className={styles.name}>{name}</div>
                <div className={styles.meta}>
                    <span className={styles.category}>{CategoryLabel[category]}</span>
                </div>
                {!!barcode && <div className={styles.barcode}>{barcode}</div>}
            </div>
            <div className={styles.qtyBlock}>
                <IconButton size={IconBtnSize.sm} onClick={() => adjust(-1)} aria-label={'decrement'}>
                    <MinusIcon size={16} />
                </IconButton>
                <span className={styles.qty}>{qty}</span>
                <IconButton size={IconBtnSize.sm} onClick={() => adjust(1)} aria-label={'increment'}>
                    <PlusIcon size={16} />
                </IconButton>
            </div>
            <Link href={`/edit/${id}`} className={styles.editLink} aria-label={'edit'}>
                <PencilSimpleIcon size={16} />
            </Link>
        </article>
    );
};

export default ProductCard;
