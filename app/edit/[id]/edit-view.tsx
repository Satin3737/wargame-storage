'use client';

import type {FC} from 'react';
import {useProduct} from '@/hooks';
import {ProductForm, ProductFormMode, Spinner} from '@/components';
import styles from './edit-view.module.scss';

interface IEditViewProps {
    id: string;
}

const EditView: FC<IEditViewProps> = ({id}) => {
    const product = useProduct(id);

    if (product === undefined) {
        return (
            <div className={styles.spinner}>
                <Spinner size={28} />
            </div>
        );
    }

    if (product === null) {
        return <p className={styles.notFound}>{'Товар не найден'}</p>;
    }

    return <ProductForm mode={ProductFormMode.edit} initial={product} />;
};

export default EditView;
