import {CaretDownIcon} from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';
import type {FC} from 'react';
import type {ISelectProps} from './types';
import styles from './select.module.scss';

const Select: FC<ISelectProps> = ({label, options, invalid, error, placeholder, className, id, ...rest}) => (
    <div className={clsx(styles.wrap, className)}>
        {!!label && (
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
        )}
        <div className={clsx(styles.field, (invalid || error) && styles.invalid)}>
            <select {...rest} id={id} className={styles.select}>
                {!!placeholder && (
                    <option value={''} disabled>
                        {placeholder}
                    </option>
                )}
                {options.map(o => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <CaretDownIcon className={styles.chevron} size={16} aria-hidden={'true'} weight={'bold'} />
        </div>
        {!!error && <div className={styles.error}>{error}</div>}
    </div>
);

export default Select;
