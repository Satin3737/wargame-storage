'use client';

import {DownloadSimpleIcon, FileXlsIcon, TrashIcon} from '@phosphor-icons/react/dist/ssr';
import {useLiveQuery} from 'dexie-react-hooks';
import {type FC, useState} from 'react';
import {db} from '@/db';
import {exportService, hapticsService, toastService} from '@/services';
import {BtnSize, BtnVariant, Button, Spinner} from '@/components';
import styles from './export-view.module.scss';

const ExportView: FC = () => {
    const [busy, setBusy] = useState(false);
    const [clearing, setClearing] = useState(false);
    const products = useLiveQuery(() => db.products.toArray(), []);
    const totalQty = products?.reduce((s, p) => s + p.qty, 0) ?? 0;

    const handleExport = async () => {
        if (!products?.length) {
            toastService.info('Список пуст');
            return;
        }

        setBusy(true);

        try {
            await exportService.exportXlsx(products);
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
        if (!confirm('Удалить все товары без возможности восстановления?')) return;

        setClearing(true);

        try {
            await db.products.clear();
            hapticsService.success();
            toastService.success('Очищено');
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
                onClick={handleExport}
                disabled={busy || !products?.length}
            >
                {busy ? <Spinner size={20} /> : <FileXlsIcon size={20} />}
                {'Скачать XLSX'}
                <DownloadSimpleIcon size={20} />
            </Button>
            <Button
                variant={BtnVariant.danger}
                size={BtnSize.lg}
                fullWidth
                onClick={handleClear}
                disabled={clearing || !products?.length}
            >
                <TrashIcon size={20} />
                {'Очистить весь склад'}
            </Button>
        </div>
    );
};

export default ExportView;
