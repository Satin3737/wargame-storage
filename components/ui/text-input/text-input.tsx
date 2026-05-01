import clsx from 'clsx';
import type {FC} from 'react';
import type {ITextInputProps} from './types';
import styles from './text-input.module.scss';

const TextInput: FC<ITextInputProps> = ({invalid, label, hint, error, rightSlot, className, id, ...rest}) => (
    <div className={clsx(styles.wrap, className)}>
        {!!label && (
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
        )}
        <div className={clsx(styles.field, (invalid || error) && styles.invalid)}>
            <input {...rest} id={id} className={styles.input} />
            {!!rightSlot && <div className={styles.right}>{rightSlot}</div>}
        </div>
        {error ? <div className={styles.error}>{error}</div> : hint ? <div className={styles.hint}>{hint}</div> : null}
    </div>
);

export default TextInput;
