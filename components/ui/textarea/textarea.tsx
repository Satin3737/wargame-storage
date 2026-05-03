'use client';

import {XIcon} from '@phosphor-icons/react';
import clsx from 'clsx';
import {type FC, useEffect, useRef} from 'react';
import {IconBtnSize, IconButton} from '@/components';
import type {ITextAreaProps} from './types';
import styles from './textarea.module.scss';

const TextArea: FC<ITextAreaProps> = ({
    invalid,
    label,
    hint,
    error,
    className,
    id,
    value,
    onInput,
    onDelete,
    ...rest
}) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    const resizeArea = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        resizeArea(el);
    }, [value]);

    return (
        <div className={clsx(styles.wrap, className)}>
            {!!label && (
                <label className={styles.label} htmlFor={id}>
                    {label}
                </label>
            )}
            <div className={clsx(styles.field, (invalid || error) && styles.invalid)}>
                <textarea
                    {...rest}
                    ref={ref}
                    id={id}
                    value={value}
                    className={styles.textarea}
                    rows={1}
                    onInput={e => {
                        resizeArea(e.currentTarget);
                        onInput?.(e);
                    }}
                />
                {!!value && !!onDelete && (
                    <IconButton size={IconBtnSize.sm} onClick={onDelete} className={styles.delete}>
                        <XIcon />
                    </IconButton>
                )}
            </div>
            {error ? (
                <div className={styles.error}>{error}</div>
            ) : hint ? (
                <div className={styles.hint}>{hint}</div>
            ) : null}
        </div>
    );
};

export default TextArea;
