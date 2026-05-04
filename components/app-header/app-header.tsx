import {ArrowLeftIcon} from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import type {FC} from 'react';
import {IconButton} from '@/components';
import type {IAppHeaderProps} from './types';
import styles from './app-header.module.scss';

const AppHeader: FC<IAppHeaderProps> = ({title, backHref, rightSlot}) => (
    <header className={styles.header}>
        <div className={styles.left}>
            {!!backHref && (
                <Link href={backHref} aria-label={'back'}>
                    <IconButton>
                        <ArrowLeftIcon size={20} />
                    </IconButton>
                </Link>
            )}
            <h1 className={styles.title}>{title}</h1>
        </div>
        {!!rightSlot && <div className={styles.right}>{rightSlot}</div>}
    </header>
);

export default AppHeader;
