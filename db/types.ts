import type {ICategory} from '@/constants';

export interface IProduct {
    id: string;
    name: string;
    qty: number;
    category: ICategory;
    photoBlob: Blob | null;
    barcode: string | null;
    isPriceReduction: boolean;
    isUsed: boolean;
    createdAt: number;
    updatedAt: number;
}

export type IProductDraft = Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>;
