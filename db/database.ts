import Dexie, {type Table} from 'dexie';
import {imageOptimizer} from '@/services';
import type {IProduct} from './types';

export class WargameDb extends Dexie {
    public readonly products: Table<IProduct, string>;

    private readonly initialTables: Record<string, string> = {
        products: 'id, barcode, name, category, qty, updatedAt'
    };

    private pendingPhotoOptimizationIds: string[] = [];

    public constructor() {
        super('wargame-storage');
        this.migrateDatabase();
        this.products = this.table('products');
        this.on('ready', () => this.optimizePendingPhotos());
    }

    private migrateDatabase(): void {
        this.version(1).stores(this.initialTables);

        this.version(4)
            .stores(this.initialTables)
            .upgrade(async tx => {
                this.pendingPhotoOptimizationIds = await tx
                    .table('products')
                    .filter((p: IProduct) => !!p.photoBlob)
                    .primaryKeys();
            });
    }

    private async optimizePendingPhotos(): Promise<void> {
        const ids = this.pendingPhotoOptimizationIds;
        if (!ids.length) return;
        this.pendingPhotoOptimizationIds = [];

        for (const id of ids) {
            console.log(`Optimizing photo for product ${id}...`);
            const product = await this.products.get(id);
            if (!product?.photoBlob) continue;
            console.log(`current size: ${(product.photoBlob.size / 1024 / 1024).toFixed(2)} MB`);
            const optimized = await imageOptimizer.optimize(product.photoBlob);
            await this.products.update(id, {photoBlob: optimized});
            !!optimized && console.log(`optimized size: ${(optimized?.size / 1024 / 1024).toFixed(2)} MB`);
        }
    }
}

export const db = new WargameDb();
