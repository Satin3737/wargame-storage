'use client';

import {BarcodeIcon, FileSearchIcon, FloppyDiskIcon, TrashIcon, XIcon} from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';
import {useRouter} from 'next/navigation';
import {type FC, useState} from 'react';
import {type IProduct, productsService} from '@/db';
import {Category} from '@/constants';
import {type IProductFormValues, productFormSchema} from '@/schemas';
import {hapticsService, toastService} from '@/services';
import {BtnSize, BtnVariant, Button, ConfirmModal, IconButton} from '@/components';
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
    const [linkedName, setLinkedName] = useState<string | null>(initial?.name ?? null);
    const [linkedBarcode, setLinkedBarcode] = useState<string | null>(initial?.barcode ?? null);
    const [deleting, setDeleting] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const isCreate = mode === ProductFormMode.create;

    const form = useAppForm({
        defaultValues: buildDefault(initial),
        validators: {onSubmit: productFormSchema},
        onSubmit: async ({value}) => {
            try {
                if (!isCreate && initial) {
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

    const handlePickExisting = (existing: IProduct) => {
        setLinkedExistingId(existing.id);
        setLinkedName(existing.name);
        setLinkedBarcode(existing.barcode);

        form.setFieldValue('name', existing.name);
        form.setFieldValue('category', existing.category);
        form.setFieldValue('photoBlob', existing.photoBlob);
        form.setFieldValue('barcode', existing.barcode);

        toastService.info('Будет добавлено к существующему');
        hapticsService.tap();
    };

    const handleDelete = async () => {
        if (!initial) return;
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

    const handleWebSearch = (barcode: string | null) => {
        if (!barcode) return;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(barcode.trim())}`, '_blank');
    };

    const dropLinked = () => {
        setLinkedExistingId(null);
        setLinkedName(null);
        setLinkedBarcode(null);
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
            <div className={styles.barcodeBlock}>
                <span className={styles.label}>{'Штрихкод'}</span>
                <div className={clsx(styles.barcodeRow, {[styles.withButtons]: isCreate})}>
                    <form.AppField
                        name={'barcode'}
                        validators={{onChange: productFormSchema.shape.barcode}}
                        listeners={{
                            onChange: ({value}) => {
                                if (linkedExistingId && value?.trim() !== linkedBarcode?.trim()) {
                                    dropLinked();
                                }
                            }
                        }}
                    >
                        {field => <field.TextField placeholder={'EAN / UPC...'} inputMode={'numeric'} />}
                    </form.AppField>
                    {isCreate && (
                        <>
                            <form.Subscribe selector={state => state.values.barcode}>
                                {barcode => (
                                    <IconButton
                                        disabled={!barcode}
                                        onClick={() => handleWebSearch(barcode)}
                                        aria-label={'web search'}
                                    >
                                        <FileSearchIcon size={20} />
                                    </IconButton>
                                )}
                            </form.Subscribe>
                            <IconButton onClick={() => setScannerOpen(true)} aria-label={'scan'}>
                                <BarcodeIcon size={20} />
                            </IconButton>
                        </>
                    )}
                </div>
            </div>

            <form.AppField
                name={'name'}
                validators={{onChange: productFormSchema.shape.name}}
                listeners={{
                    onChange: ({value}) => {
                        if (linkedExistingId && value?.trim() !== linkedName?.trim()) {
                            dropLinked();
                        }
                    }
                }}
            >
                {field => <field.TextAreaField label={'Название'} placeholder={'Например, Catan'} />}
            </form.AppField>

            {isCreate && (
                <form.Subscribe selector={state => ({name: state.values.name, barcode: state.values.barcode})}>
                    {({name, barcode}) => (
                        <SimilarProducts
                            name={name}
                            barcode={barcode}
                            excludeId={initial?.id ?? null}
                            onPick={handlePickExisting}
                        />
                    )}
                </form.Subscribe>
            )}

            {!!linkedExistingId && isCreate && (
                <div className={styles.linked}>
                    <span className={styles.linkedLabel}>
                        {'Будет добавлено к: '}
                        {linkedName}
                    </span>
                    <Button
                        variant={BtnVariant.ghost}
                        onClick={() => {
                            setLinkedExistingId(null);
                            setLinkedName(null);
                        }}
                    >
                        {'Отвязать'}
                    </Button>
                </div>
            )}

            <div className={styles.row}>
                <form.AppField name={'qty'} validators={{onChange: productFormSchema.shape.qty}}>
                    {field => <field.NumberField label={'Количество'} min={0} />}
                </form.AppField>
                <form.AppField name={'category'}>{field => <field.CategoryField />}</form.AppField>
            </div>

            <form.AppField name={'photoBlob'} validators={{onChange: productFormSchema.shape.photoBlob}}>
                {field => <field.PhotoField />}
            </form.AppField>

            <div className={styles.actions}>
                <Button variant={BtnVariant.ghost} size={BtnSize.lg} onClick={() => router.back()}>
                    <XIcon size={20} />
                    {'Отмена'}
                </Button>
                <form.AppForm>
                    <form.SubmitButton>
                        <FloppyDiskIcon size={20} />
                        {'Сохранить'}
                    </form.SubmitButton>
                </form.AppForm>
            </div>

            {!isCreate && (
                <Button
                    variant={BtnVariant.danger}
                    size={BtnSize.lg}
                    fullWidth
                    onClick={() => setConfirmDeleteOpen(true)}
                    disabled={deleting}
                >
                    <TrashIcon size={20} />
                    {'Удалить товар'}
                </Button>
            )}

            <ConfirmModal
                open={confirmDeleteOpen}
                message={`Удалить «${initial?.name}»?`}
                onConfirm={() => {
                    setConfirmDeleteOpen(false);
                    void handleDelete();
                }}
                onCancel={() => setConfirmDeleteOpen(false)}
            />

            <BarcodeScanner
                open={scannerOpen}
                onClose={() => setScannerOpen(false)}
                onDetected={code => {
                    setScannerOpen(false);
                    const trimmed = code.trim();
                    if (!trimmed) return;
                    form.setFieldValue('barcode', trimmed);
                }}
            />
        </form>
    );
};

export default ProductForm;
