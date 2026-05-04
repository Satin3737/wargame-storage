import {ClassValue} from 'clsx';

export interface IPaginationProps {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
    className?: ClassValue;
}
