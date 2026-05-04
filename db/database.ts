import Dexie, {type Table} from 'dexie';
import type {IProduct} from './types';

export class WargameDb extends Dexie {
    public readonly products: Table<IProduct, string>;

    public constructor() {
        super('wargame-storage');
        this.migrateDatabase();
        this.products = this.table('products');
    }

    private migrateDatabase(): void {
        this.version(1).stores({products: 'id, barcode, name, category, qty, updatedAt'});

        this.version(2)
            .stores({products: 'id, barcode, name, category, qty, isPriceReduction, isUsed, updatedAt'})
            .upgrade(tx => {
                return tx
                    .table('products')
                    .toCollection()
                    .modify((product: IProduct) => {
                        product.isPriceReduction = false;
                        product.isUsed = false;
                    });
            });
    }
}

export const db = new WargameDb();
