'use client';

import type {FC} from 'react';
import {useObjectUrl} from '@/hooks';
import {Modal, ModalVariant} from '@/components';
import type {IPhotoModalProps} from './types';
import styles from './photo-modal.module.scss';

const PhotoModal: FC<IPhotoModalProps> = ({blob, open, onClose}) => {
    const url = useObjectUrl(blob);

    return (
        <Modal open={open && !!url} onClose={onClose} variant={ModalVariant.center} contentClassName={styles.content}>
            {!!url && <img className={styles.image} src={url} alt={''} onClick={onClose} />}
        </Modal>
    );
};

export default PhotoModal;
