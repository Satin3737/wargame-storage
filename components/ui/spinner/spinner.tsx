import clsx from 'clsx';
import type {FC} from 'react';
import type {ISpinnerProps} from './types';
import styles from './spinner.module.scss';

const Spinner: FC<ISpinnerProps> = ({size = 20, className}) => (
    <span
        className={clsx(styles.spinner, className)}
        style={{width: `${size}px`, height: `${size}px`}}
        aria-label={'loading'}
        role={'status'}
    />
);

export default Spinner;
