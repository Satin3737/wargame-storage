import type {IProduct} from '@/db';

export interface ISimilarProductsProps {
    query: string;
    excludeId: string | null;
    onPick: (product: IProduct) => void;
}

export interface ISimilarItemProps {
    product: IProduct;
    onPick: (product: IProduct) => void;
}
