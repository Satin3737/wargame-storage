'use client';

import {XIcon} from '@phosphor-icons/react';
import clsx from 'clsx';
import type {FC} from 'react';
import {IconButton} from '../icon-button';
import type {ITextInputProps} from './types';
import styles from './text-input.module.scss';

const TextInput: FC<ITextInputProps> = ({invalid, label, hint, error, className, id, value, onDelete, ...rest}) => {
    return (
        <div className={clsx(styles.wrap, className)}>
            {!!label && (
                <label className={styles.label} htmlFor={id}>
                    {label}
                </label>
            )}
            <div className={clsx(styles.field, (invalid || error) && styles.invalid)}>
                <input {...rest} value={value} id={id} className={styles.input} />
                {!!value && !!onDelete && (
                    <IconButton onClick={onDelete} className={styles.delete}>
                        <XIcon />
                    </IconButton>
                )}
            </div>
            {error ? <div className={styles.error}>{error}</div> : !!hint && <div className={styles.hint}>{hint}</div>}
        </div>
    );
};

export default TextInput;
