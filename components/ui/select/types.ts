import type {SelectHTMLAttributes} from 'react';

export interface ISelectOption {
    value: string;
    label: string;
}

export interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: ISelectOption[];
    invalid?: boolean;
    error?: string;
    placeholder?: string;
}
