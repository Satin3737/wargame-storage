'use client';

import {TrashIcon} from '@phosphor-icons/react';
import {useRouter} from 'next/navigation';
import {use, useState} from 'react';
import {productsService} from '@/db';
import {hapticsService, toastService} from '@/services';
import {useProduct} from '@/hooks';
import {AppHeader, ConfirmModal, IconButton, PageShell, ProductForm, ProductFormMode, Spinner} from '@/components';
import styles from './edit.module.scss';

interface IEditPageProps {
    params: Promise<{id: string}>;
}

export default function EditPage({params}: IEditPageProps) {
    const {id} = use(params);
    const router = useRouter();
    const product = useProduct(id);
    const [deleting, setDeleting] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);

        try {
            await productsService.remove(id);
            hapticsService.success();
            toastService.success('Удалено');
            router.push('/');
        } catch {
            setDeleting(false);
            hapticsService.error();
            toastService.error('Не удалось удалить');
        }
    };

    return (
        <PageShell>
            <AppHeader
                title={'Редактирование'}
                backHref={'/'}
                rightSlot={
                    <IconButton
                        onClick={() => setConfirmDeleteOpen(true)}
                        disabled={deleting}
                        className={styles.delete}
                    >
                        {deleting ? <Spinner size={20} /> : <TrashIcon size={20} />}
                    </IconButton>
                }
            />

            {product === undefined && (
                <div className={styles.spinner}>
                    <Spinner size={32} />
                </div>
            )}

            {product === null && <p className={styles.notFound}>{'Товар не найден'}</p>}

            {!!product && (
                <>
                    <ProductForm mode={ProductFormMode.edit} initial={product} />

                    <ConfirmModal
                        open={confirmDeleteOpen}
                        message={`Удалить «${product.name}»?`}
                        onConfirm={() => {
                            setConfirmDeleteOpen(false);
                            void handleDelete();
                        }}
                        onCancel={() => setConfirmDeleteOpen(false)}
                    />
                </>
            )}
        </PageShell>
    );
}
