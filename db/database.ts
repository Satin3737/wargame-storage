import Dexie, {type Table} from 'dexie';
import type {IProduct} from './types';

export class WargameDb extends Dexie {
    public readonly products: Table<IProduct, string>;

    public constructor() {
        super('wargame-storage');

        this.version(1).stores({
            products: 'id, name, category, qty, updatedAt'
        });

        this.products = this.table('products');
    }
}

export const db = new WargameDb();
