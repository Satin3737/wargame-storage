import type {ReactNode} from 'react';

export interface IAppHeaderProps {
    title: string;
    backHref?: string;
    rightSlot?: ReactNode;
}
