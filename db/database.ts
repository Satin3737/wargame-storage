import Dexie, {type Table} from 'dexie';
import type {IProduct} from './types';

export class WargameDb extends Dexie {
    public readonly products: Table<IProduct, string>;

    private readonly initialTables: Record<string, string> = {
        products: 'id, barcode, name, category, qty, updatedAt'
    };

    public constructor() {
        super('wargame-storage');
        this.migrateDatabase();
        this.products = this.table('products');
    }

    private migrateDatabase(): void {
        this.version(1).stores(this.initialTables);
    }
}

export const db = new WargameDb();
