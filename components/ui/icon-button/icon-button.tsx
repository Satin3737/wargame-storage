import clsx from 'clsx';
import type {FC} from 'react';
import {type IIconButtonProps, IconBtnSize} from './types';
import styles from './icon-button.module.scss';

const IconButton: FC<IIconButtonProps> = ({size = IconBtnSize.md, className, children, type = 'button', ...rest}) => (
    <button {...rest} type={type} className={clsx(styles.iconButton, styles[size], className)}>
        {children}
    </button>
);

export default IconButton;
