'use client';

import clsx from 'clsx';
import {type FC, useEffect} from 'react';
import {type IModalProps, ModalVariant} from './types';
import styles from './modal.module.scss';

const Modal: FC<IModalProps> = ({open, onClose, children, title, variant = ModalVariant.sheet, contentClassName}) => {
    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKey);

        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = original;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className={clsx(styles.overlay, styles[variant])} onClick={onClose} role={'dialog'} aria-modal={'true'}>
            <div className={clsx(styles.content, contentClassName)} onClick={e => e.stopPropagation()}>
                {!!title && <div className={styles.title}>{title}</div>}
                {children}
            </div>
        </div>
    );
};

export default Modal;
