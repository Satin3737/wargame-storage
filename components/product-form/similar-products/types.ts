import type {IProduct} from '@/db';

export interface ISimilarProductsProps {
    name: string;
    barcode: string | null;
    excludeId: string | null;
    onPick: (product: IProduct) => void;
}

export interface ISimilarItemProps {
    product: IProduct;
    onPick: (product: IProduct) => void;
}
