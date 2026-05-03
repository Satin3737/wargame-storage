import type {InputHTMLAttributes} from 'react';

export interface ITextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur'> {
    label?: string;
    hint?: string;
}
