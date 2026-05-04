import clsx from 'clsx';
import type {FC} from 'react';
import type {ITagProps} from './types';
import styles from './tag.module.scss';

const Tag: FC<ITagProps> = ({label, type, className}) => (
    <div className={clsx(styles.tag, styles[type], className)}>{label}</div>
);

export default Tag;
