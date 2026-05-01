import type {InputHTMLAttributes, ReactNode} from 'react';

export interface ITextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur'> {
    label?: string;
    hint?: string;
    rightSlot?: ReactNode;
}
