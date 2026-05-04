import {CaretDoubleLeftIcon, CaretDoubleRightIcon, CaretLeftIcon, CaretRightIcon} from '@phosphor-icons/react/ssr';
import clsx from 'clsx';
import type {ChangeEvent, FC} from 'react';
import {IconButton, TextInput} from '@/components';
import type {IPaginationProps} from './types';
import styles from './pagination.module.scss';

const Pagination: FC<IPaginationProps> = ({page, totalPages, setPage, className}) => {
    if (totalPages <= 1) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let newPage = Number(e.target.value) || 1;
        if (newPage < 1) newPage = 1;
        if (newPage > totalPages) newPage = totalPages;
        setPage(newPage);
    };

    return (
        <div className={clsx(styles.wrap, className)}>
            <IconButton disabled={page === 1} onClick={() => setPage(1)} aria-label={'First page'}>
                <CaretDoubleLeftIcon />
            </IconButton>
            <IconButton disabled={page === 1} onClick={() => setPage(page - 1)} aria-label={'Previous page'}>
                <CaretLeftIcon />
            </IconButton>
            <TextInput value={page} onChange={handleChange} className={styles.pageInput} />
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
