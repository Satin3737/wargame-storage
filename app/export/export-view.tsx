'use client';

import {DownloadSimpleIcon, FileXlsIcon, TrashIcon} from '@phosphor-icons/react/ssr';
import {useRouter} from 'next/navigation';
import {type FC, useState} from 'react';
import {productsService} from '@/db';
import {exportService, hapticsService, toastService} from '@/services';
import {useAllProducts} from '@/hooks';
import {BtnSize, BtnVariant, Button, ConfirmModal, Spinner} from '@/components';
import styles from './export-view.module.scss';

const ExportView: FC = () => {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [confirmClearOpen, setConfirmClearOpen] = useState(false);
    const products = useAllProducts();
    const totalQty = products?.reduce((s, p) => s + p.qty, 0) ?? 0;

    const handleExport = async (includePhotos: boolean) => {
        if (!products?.length) {
            toastService.info('Список пуст');
            return;
        }

        setBusy(true);

        try {
            await exportService.exportXlsx(products, includePhotos);
            hapticsService.success();
            toastService.success('Файл готов');
        } catch {
            hapticsService.error();
            toastService.error('Не удалось экспортировать');
        } finally {
            setBusy(false);
        }
    };

    const handleClear = async () => {
        setClearing(true);

        try {
            await productsService.clear();
            hapticsService.success();
            toastService.success('Очищено');
            router.push('/');
        } catch {
            hapticsService.error();
            toastService.error('Не удалось очистить');
        } finally {
            setClearing(false);
        }
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.stats}>
                <div className={styles.stat}>
                    <div className={styles.statNum}>{products?.length ?? 0}</div>
                    <div className={styles.statLabel}>{'Позиций'}</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statNum}>{totalQty}</div>
                    <div className={styles.statLabel}>{'Всего шт.'}</div>
                </div>
            </div>
            <Button
                variant={BtnVariant.primary}
                size={BtnSize.lg}
                fullWidth
                onClick={() => void handleExport(true)}
                disabled={busy || !products?.length}
                suppressHydrationWarning
            >
                {busy ? <Spinner size={20} inverted={true} /> : <FileXlsIcon size={20} />}
                {'Скачать'}
                <DownloadSimpleIcon size={20} />
            </Button>
            <Button
                variant={BtnVariant.primary}
                size={BtnSize.lg}
                fullWidth
                onClick={() => void handleExport(false)}
                disabled={busy || !products?.length}
                suppressHydrationWarning
            >
                {busy ? <Spinner size={20} inverted={true} /> : <FileXlsIcon size={20} />}
                {'Скачать (без фото)'}
                <DownloadSimpleIcon size={20} />
            </Button>
            <Button
                variant={BtnVariant.danger}
                size={BtnSize.lg}
                fullWidth
                onClick={() => setConfirmClearOpen(true)}
                disabled={clearing || !products?.length}
                suppressHydrationWarning
            >
                <TrashIcon size={20} />
                {'Очистить весь склад'}
            </Button>
            <ConfirmModal
                open={confirmClearOpen}
                message={'Удалить все товары без возможности восстановления?'}
                confirmLabel={'Очистить'}
                onConfirm={() => {
                    setConfirmClearOpen(false);
                    void handleClear();
                }}
                onCancel={() => setConfirmClearOpen(false)}
            />
        </div>
    );
};

export default ExportView;
