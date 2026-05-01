import clsx from 'clsx';
import type {FC} from 'react';
import {BtnSize, BtnVariant, type IButtonProps} from './types';
import styles from './button.module.scss';

const Button: FC<IButtonProps> = ({
    variant = BtnVariant.primary,
    size = BtnSize.md,
    fullWidth,
    className,
    children,
    type = 'button',
    ...rest
}) => (
    <button
        {...rest}
        type={type}
        className={clsx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)}
    >
        {children}
    </button>
);

export default Button;
