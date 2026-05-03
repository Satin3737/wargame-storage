import type {TextareaHTMLAttributes} from 'react';

export interface ITextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    invalid?: boolean;
    label?: string;
    hint?: string;
    error?: string;
    onDelete?: () => void;
}
