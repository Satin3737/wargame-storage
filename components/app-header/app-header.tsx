import {ArrowLeftIcon} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import type {FC} from 'react';
import {IconButton} from '@/components';
import type {IAppHeaderProps} from './types';
import styles from './app-header.module.scss';

const AppHeader: FC<IAppHeaderProps> = ({title, backHref, rightSlot}) => (
    <header className={styles.header}>
        <div className={styles.left}>
            {backHref ? (
                <Link href={backHref} aria-label={'back'}>
                    <IconButton aria-label={'back'}>
                        <ArrowLeftIcon size={20} />
                    </IconButton>
                </Link>
            ) : null}
            <h1 className={styles.title}>{title}</h1>
        </div>
        {rightSlot ? <div className={styles.right}>{rightSlot}</div> : null}
    </header>
);

export default AppHeader;
