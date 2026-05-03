'use client';

import {CameraIcon, ImageIcon, TrashIcon} from '@phosphor-icons/react/dist/ssr';
import {type FC, useRef} from 'react';
import {imageOptimizer} from '@/services';
import {useObjectUrl} from '@/hooks';
import {BtnVariant, Button, IconButton} from '@/components';
import {useFieldContext} from '../../form-context';
import type {IPhotoFieldProps} from './types';
import styles from './photo-field.module.scss';

const PhotoField: FC<IPhotoFieldProps> = ({label = 'Фото'}) => {
    const field = useFieldContext<Blob | null>();
    const blob = field.state.value;
    const cameraRef = useRef<HTMLInputElement>(null);
    const galleryRef = useRef<HTMLInputElement>(null);
    const previewUrl = useObjectUrl(blob);

    const handleFile = async (file: File | undefined) => {
        if (!file) return;
        const optimizedFile = await imageOptimizer.optimize(file);
        field.handleChange(optimizedFile);
    };

    return (
        <div className={styles.wrap}>
            <span className={styles.label}>{label}</span>
            <div className={styles.row}>
                <div className={styles.preview}>
                    {previewUrl ? (
                        <img className={styles.previewImg} src={previewUrl} alt={'preview'} />
                    ) : (
                        <span className={styles.placeholder}>{'Нет фото'}</span>
                    )}
                    {!!blob && (
                        <IconButton onClick={() => field.handleChange(null)} className={styles.deleteBtn}>
                            <TrashIcon size={20} />
                        </IconButton>
                    )}
                </div>
                <div className={styles.actions}>
                    <Button variant={BtnVariant.ghost} fullWidth onClick={() => cameraRef.current?.click()}>
                        <CameraIcon size={20} />
                        {'Камера'}
                    </Button>
                    <Button variant={BtnVariant.ghost} fullWidth onClick={() => galleryRef.current?.click()}>
                        <ImageIcon size={20} />
                        {'Галерея'}
                    </Button>
                </div>
            </div>
            <input
                ref={cameraRef}
                type={'file'}
                accept={'image/*'}
                capture={'environment'}
                hidden
                onChange={e => handleFile(e.target.files?.[0])}
            />
            <input
                ref={galleryRef}
                type={'file'}
                accept={'image/*'}
                hidden
                onChange={e => handleFile(e.target.files?.[0])}
            />
        </div>
    );
};

export default PhotoField;
