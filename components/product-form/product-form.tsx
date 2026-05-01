'use client';

import {BarcodeIcon, FloppyDiskIcon, TrashIcon, XIcon} from '@phosphor-icons/react/dist/ssr';
import {useRouter} from 'next/navigation';
import {type FC, useState} from 'react';
import {z} from 'zod';
import {type IProduct, productsService} from '@/db';
import {Category} from '@/constants';
import {type IProductFormValues, productFormSchema} from '@/schemas';
import {hapticsService, toastService, upcLookupService} from '@/services';
import {BtnSize, BtnVariant, Button, IconButton, Spinner} from '@/components';
import {BarcodeScanner} from './barcode-scanner';
import {useAppForm} from './form-hook';
import {SimilarProducts} from './similar-products';
import {type IProductFormProps, ProductFormMode} from './types';
import styles from './product-form.module.scss';

const buildDefault = (initial: IProduct | undefined): IProductFormValues => ({
    name: initial?.name ?? '',
    qty: initial?.qty ?? 1,
    category: initial?.category ?? Category.boardGames,
    photoBlob: initial?.photoBlob ?? null,
    barcode: initial?.barcode ?? null
});

const ProductForm: FC<IProductFormProps> = ({mode, initial}) => {
    const router = useRouter();
    const [scannerOpen, setScannerOpen] = useState(false);
    const [linkedExistingId, setLinkedExistingId] = useState<string | null>(initial?.id ?? null);
    const [lookupBusy, setLookupBusy] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [barcodeInput, setBarcodeInput] = useState(initial?.barcode ?? '');

    const form = useAppForm({
        defaultValues: buildDefault(initial),
        validators: {
            onChange: productFormSchema,
            onSubmit: productFormSchema
        },
        onSubmit: async ({value}) => {
            try {
                if (mode === ProductFormMode.edit && initial) {
                    await productsService.update(initial.id, {
                        name: value.name.trim(),
                        qty: value.qty,
                        category: value.category,
                        photoBlob: value.photoBlob,
                        barcode: value.barcode?.trim() || null
                    });

                    hapticsService.success();
                    toastService.success('Сохранено');
                    router.push('/');
                    return;
                }

                if (linkedExistingId) {
                    const merged = await productsService.mergeWithExisting(linkedExistingId, value.qty, {
                        name: value.name.trim(),
                        category: value.category,
                        photoBlob: value.photoBlob,
                        barcode: value.barcode?.trim() || null
                    });

                    if (merged) {
                        hapticsService.success();
                        toastService.success(`+${value.qty} → ${merged.name}`);
                        router.push('/');
                        return;
                    }
                }

                await productsService.create({
                    name: value.name.trim(),
                    qty: value.qty,
                    category: value.category,
                    photoBlob: value.photoBlob,
                    barcode: value.barcode?.trim() || null
                });

                hapticsService.success();
                toastService.success('Товар добавлен');
                router.push('/');
            } catch {
                hapticsService.error();
                toastService.error('Не удалось сохранить');
            }
        }
    });

    const runLookup = async (code: string) => {
        const trimmed = code.trim();
        if (!trimmed) return;

        form.setFieldValue('barcode', trimmed);
        setBarcodeInput(trimmed);
        setLookupBusy(true);

        try {
            const result = await upcLookupService.lookup(trimmed);
            switch (result.kind) {
                case 'found':
                    form.setFieldValue('name', result.name);
                    toastService.info(`Найдено: ${result.name}`);
                    break;
                case 'rate-limited':
                    toastService.error('Лимит сервиса исчерпан. Попробуйте позже');
                    break;
                case 'not-found':
                    toastService.info('По штрихкоду ничего не найдено');
                    break;
                case 'error':
                    toastService.error('Не удалось выполнить поиск');
                    break;
            }
        } finally {
            setLookupBusy(false);
        }
    };

    const handlePickExisting = (existing: IProduct) => {
        setLinkedExistingId(existing.id);

        form.setFieldValue('name', existing.name);
        form.setFieldValue('category', existing.category);
        form.setFieldValue('photoBlob', existing.photoBlob);

        if (existing.barcode) {
            form.setFieldValue('barcode', existing.barcode);
            setBarcodeInput(existing.barcode);
        }

        toastService.info('Будет добавлено к существующему');
        hapticsService.tap();
    };

    const handleDelete = async () => {
        if (!initial) return;
        if (!confirm(`Удалить «${initial.name}»?`)) return;
        setDeleting(true);

        try {
            await productsService.remove(initial.id);
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
        <form
            className={styles.form}
            onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
            }}
        >
            {mode === ProductFormMode.create && (
                <div className={styles.barcodeBlock}>
                    <span className={styles.label}>{'Штрихкод'}</span>
                    <div className={styles.barcodeRow}>
                        <input
                            className={styles.barcodeInput}
                            value={barcodeInput}
                            onChange={e => setBarcodeInput(e.target.value)}
                            placeholder={'EAN / UPC...'}
                            inputMode={'numeric'}
                        />
                        <Button
                            variant={BtnVariant.ghost}
                            onClick={() => runLookup(barcodeInput)}
                            disabled={lookupBusy || !barcodeInput.trim()}
                        >
                            {lookupBusy && <Spinner size={20} />}
                            {'Поиск'}
                        </Button>
                        <IconButton onClick={() => setScannerOpen(true)} aria-label={'scan'}>
                            <BarcodeIcon size={20} />
                        </IconButton>
                    </div>
                </div>
            )}

            <form.AppField name={'name'} validators={{onChange: z.string().trim().min(2, 'Минимум 2 символа')}}>
                {field => <field.TextField label={'Название'} placeholder={'Например, Catan'} />}
            </form.AppField>

            <form.Subscribe selector={state => state.values.name}>
                {nameValue => (
                    <SimilarProducts query={nameValue} excludeId={initial?.id ?? null} onPick={handlePickExisting} />
                )}
            </form.Subscribe>

            <div className={styles.row}>
                <form.AppField name={'qty'}>
                    {field => <field.NumberField label={'Количество'} min={0} />}
                </form.AppField>
                <form.AppField name={'category'}>{field => <field.CategoryField />}</form.AppField>
            </div>

            <form.AppField name={'photoBlob'}>{field => <field.PhotoField />}</form.AppField>

            <div className={styles.actions}>
                <Button variant={BtnVariant.ghost} size={BtnSize.lg} onClick={() => router.back()}>
                    <XIcon size={20} />
                    {'Отмена'}
                </Button>
                <form.AppForm>
                    <form.SubmitButton>
                        <FloppyDiskIcon size={20} />
                        {linkedExistingId && mode === ProductFormMode.create ? 'Добавить к существующему' : 'Сохранить'}
                    </form.SubmitButton>
                </form.AppForm>
            </div>

            {mode === ProductFormMode.edit && (
                <Button
                    variant={BtnVariant.danger}
                    size={BtnSize.lg}
                    fullWidth
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    <TrashIcon size={20} />
                    {'Удалить товар'}
                </Button>
            )}

            <BarcodeScanner
                open={scannerOpen}
                onClose={() => setScannerOpen(false)}
                onDetected={code => {
                    setScannerOpen(false);
                    void runLookup(code);
                }}
            />
        </form>
    );
};

export default ProductForm;
