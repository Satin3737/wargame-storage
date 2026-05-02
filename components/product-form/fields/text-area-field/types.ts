import type {TextareaHTMLAttributes} from 'react';

export interface ITextAreaFieldProps extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'onChange' | 'onBlur'
> {
    label?: string;
    hint?: string;
}
