'use client';

import clsx from 'clsx';
import {type FC, useEffect, useRef} from 'react';
import {type IModalProps, ModalVariant} from './types';
import styles from './modal.module.scss';

const TITLE_ID = 'modal-title';

const Modal: FC<IModalProps> = ({open, onClose, children, title, variant = ModalVariant.sheet, contentClassName}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!open) return;

        previousFocusRef.current = document.activeElement as HTMLElement;
        contentRef.current?.focus();

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKey);

        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = original;
            previousFocusRef.current?.focus();
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className={clsx(styles.overlay, styles[variant])}
            onClick={onClose}
            role={'dialog'}
            aria-modal={'true'}
            aria-labelledby={title ? TITLE_ID : undefined}
        >
            <div
                ref={contentRef}
                className={clsx(styles.content, contentClassName)}
                onClick={e => e.stopPropagation()}
                tabIndex={-1}
            >
                {!!title && (
                    <div id={TITLE_ID} className={styles.title}>
                        {title}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;
