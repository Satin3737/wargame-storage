import type {InputHTMLAttributes} from 'react';

export interface ITextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    invalid?: boolean;
    label?: string;
    hint?: string;
    error?: string;
    onDelete?: () => void;
}
