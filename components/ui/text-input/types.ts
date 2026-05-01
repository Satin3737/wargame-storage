import type {InputHTMLAttributes, ReactNode} from 'react';

export interface ITextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    invalid?: boolean;
    label?: string;
    hint?: string;
    error?: string;
    rightSlot?: ReactNode;
}
