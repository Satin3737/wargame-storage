import {ClassValue} from 'clsx';

export const TagTypes = {
    category: 'category',
    priceReduction: 'priceReduction',
    used: 'used'
} as const;

export type ITagTypes = (typeof TagTypes)[keyof typeof TagTypes];

export interface ITagProps {
    label: string;
    type: ITagTypes;
    className?: ClassValue;
}
