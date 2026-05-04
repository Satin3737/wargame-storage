import type {InputHTMLAttributes} from 'react';

export interface ICheckboxFieldProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'onChange' | 'onBlur'
> {
    label?: string;
}
