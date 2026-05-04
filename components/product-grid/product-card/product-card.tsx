'use client';

import {MinusIcon, PencilSimpleIcon, PlusIcon, StarFourIcon} from '@phosphor-icons/react';
import clsx from 'clsx';
import Link from 'next/link';
import {FC, useRef, useState} from 'react';
import {productsService} from '@/db';
import {CategoryLabel} from '@/constants';
import {hapticsService, toastService} from '@/services';
import {useObjectUrl} from '@/hooks';
import {IconButton, Tag, TagTypes} from '@/components';
import type {IProductCardProps} from './types';
import styles from './product-card.module.scss';

const initialAdjustment = {isPlus: false, isDown: false};

const ProductCard: FC<IProductCardProps> = ({product, onPhotoClick}) => {
    const {id, name, barcode, qty, category, photoBlob, isPriceReduction, isUsed} = product;
    const thumb = useObjectUrl(photoBlob);
    const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
    const [adjustment, setAdjustment] = useState<{isPlus: boolean; isDown: boolean}>(initialAdjustment);
    const adjustmentTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearAdjustmentTimeout = () => {
        if (!adjustmentTimeout.current) return;
        clearTimeout(adjustmentTimeout.current);
        adjustmentTimeout.current = null;
    };

    const adjust = async (delta: number) => {
        try {
            hapticsService.tap();
            clearAdjustmentTimeout();
            setIsAdjusting(true);
            setAdjustment({isPlus: delta > 0, isDown: delta < 0});

            adjustmentTimeout.current = setTimeout(() => {
                clearAdjustmentTimeout();
                setAdjustment(initialAdjustment);
            }, 500);

            await productsService.incrementQty(product.id, delta);
            setIsAdjusting(false);
        } catch {
            setIsAdjusting(false);
            setAdjustment(initialAdjustment);
            clearAdjustmentTimeout();
            toastService.error('Не удалось обновить');
        }
    };

    return (
        <article className={styles.card} style={{viewTransitionName: `product-${id}`}}>
            <div
                className={clsx(styles.outline, {
                    [styles.toPlus]: adjustment.isPlus,
                    [styles.toMinus]: adjustment.isDown
                })}
            >
                <StarFourIcon size={24} weight={'fill'} className={styles.plusIcon} />
                <StarFourIcon size={24} weight={'fill'} className={styles.minusIcon} />
            </div>
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
                    <Tag label={CategoryLabel[category]} type={TagTypes.category} />
                    {isPriceReduction && <Tag label={'Уценка'} type={TagTypes.priceReduction} />}
                    {isUsed && <Tag label={'Б/у'} type={TagTypes.used} />}
                </div>
                {!!barcode && <div className={styles.barcode}>{barcode}</div>}
            </div>
            <div className={styles.qtyBlock}>
                <IconButton onClick={() => adjust(-1)} disabled={isAdjusting || qty === 0} aria-label={'decrement'}>
                    <MinusIcon size={16} />
                </IconButton>
                <span className={styles.qty}>{qty}</span>
                <IconButton onClick={() => adjust(1)} disabled={isAdjusting} aria-label={'increment'}>
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
