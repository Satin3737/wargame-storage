import type {ButtonHTMLAttributes, ReactNode} from 'react';

export const BtnVariant = {
    primary: 'primary',
    ghost: 'ghost',
    danger: 'danger'
} as const;

export type IBtnVariant = (typeof BtnVariant)[keyof typeof BtnVariant];

export const BtnSize = {
    md: 'md',
    lg: 'lg'
} as const;

export type IBtnSize = (typeof BtnSize)[keyof typeof BtnSize];

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: IBtnVariant;
    size?: IBtnSize;
    fullWidth?: boolean;
    children?: ReactNode;
}
