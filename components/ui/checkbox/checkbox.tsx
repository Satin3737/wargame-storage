import clsx from 'clsx';
import type {FC} from 'react';
import type {ICheckboxProps} from './types';
import styles from './checkbox.module.scss';

const Checkbox: FC<ICheckboxProps> = ({label, className, ...rest}) => (
    <label className={clsx(styles.wrap, className)}>
        <input {...rest} type={'checkbox'} className={styles.input} />
        <span className={styles.box} aria-hidden={'true'} />
        {!!label && <span className={styles.label}>{label}</span>}
    </label>
);

export default Checkbox;
