import type {ReactNode} from 'react';

export const ModalVariant = {
    sheet: 'sheet',
    center: 'center'
} as const;

export type IModalVariant = (typeof ModalVariant)[keyof typeof ModalVariant];

export interface IModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    variant?: IModalVariant;
    contentClassName?: string;
}
