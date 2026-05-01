import {db} from './database';
import type {IProduct, IProductDraft} from './types';

class ProductsService {
    public async create(draft: IProductDraft): Promise<IProduct> {
        const now = Date.now();

        const product: IProduct = {
            ...draft,
            id: this.generateId(),
            createdAt: now,
            updatedAt: now
        };

        await db.products.add(product);
        return product;
    }

    public async update(id: string, patch: Partial<IProductDraft>): Promise<void> {
        await db.products.update(id, {...patch, updatedAt: Date.now()});
    }

    public async incrementQty(id: string, delta: number): Promise<IProduct | undefined> {
        return db.transaction('rw', db.products, async () => {
            const existing = await db.products.get(id);
            if (!existing) return undefined;

            const next: IProduct = {
                ...existing,
                qty: Math.max(0, existing.qty + delta),
                updatedAt: Date.now()
            };

            await db.products.put(next);
            return next;
        });
    }

    public async mergeWithExisting(
        id: string,
        addQty: number,
        patch: Partial<IProductDraft>
    ): Promise<IProduct | undefined> {
        return db.transaction('rw', db.products, async () => {
            const existing = await db.products.get(id);
            if (!existing) return undefined;

            const next: IProduct = {
                ...existing,
                ...patch,
                qty: Math.max(0, existing.qty + addQty),
                updatedAt: Date.now()
            };

            await db.products.put(next);
            return next;
        });
    }

    public async remove(id: string): Promise<void> {
        await db.products.delete(id);
    }

    public async clear(): Promise<void> {
        await db.products.clear();
    }

    private generateId(): string {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }

        return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }
}

const productsService = new ProductsService();
export default productsService;
