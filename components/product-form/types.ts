import type {IProduct} from '@/db';

export const ProductFormMode = {
    create: 'create',
    edit: 'edit'
} as const;

export type IProductFormMode = (typeof ProductFormMode)[keyof typeof ProductFormMode];

export interface IProductFormProps {
    mode: IProductFormMode;
    initial?: IProduct;
}
