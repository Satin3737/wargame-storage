import type {ButtonHTMLAttributes, ReactNode} from 'react';

export const IconBtnSize = {
    sm: 'sm',
    md: 'md'
} as const;

export type IIconBtnSize = (typeof IconBtnSize)[keyof typeof IconBtnSize];

export interface IIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: IIconBtnSize;
    children: ReactNode;
}
