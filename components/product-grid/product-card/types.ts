import type {IProduct} from '@/db';

export interface IProductCardProps {
    product: IProduct;
    onPhotoClick: (product: IProduct) => void;
}
