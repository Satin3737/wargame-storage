import {CaretDoubleLeftIcon, CaretDoubleRightIcon, CaretLeftIcon, CaretRightIcon} from '@phosphor-icons/react/ssr';
import clsx from 'clsx';
import type {FC} from 'react';
import {IconButton} from '@/components';
import type {IPaginationProps} from './types';
import styles from './pagination.module.scss';

const Pagination: FC<IPaginationProps> = ({page, totalPages, setPage, className}) => {
    if (totalPages <= 1) return null;

    return (
        <div className={clsx(styles.wrap, className)}>
            <IconButton disabled={page === 1} onClick={() => setPage(1)} aria-label={'First page'}>
                <CaretDoubleLeftIcon />
            </IconButton>
            <IconButton disabled={page === 1} onClick={() => setPage(page - 1)} aria-label={'Previous page'}>
                <CaretLeftIcon />
            </IconButton>
            <span className={styles.pageLabel}>{page}</span>
            <IconButton disabled={page === totalPages} onClick={() => setPage(page + 1)} aria-label={'Next page'}>
                <CaretRightIcon />
            </IconButton>
            <IconButton disabled={page === totalPages} onClick={() => setPage(totalPages)} aria-label={'Last page'}>
                <CaretDoubleRightIcon />
            </IconButton>
        </div>
    );
};

export default Pagination;
