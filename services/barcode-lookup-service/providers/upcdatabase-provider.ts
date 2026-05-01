import axios from 'axios';
import {upcDatabaseResponseSchema} from '@/schemas';
import type {IBarcodeLookupProvider, IUpcLookupResult} from '../types';

export class UpcDatabaseProvider implements IBarcodeLookupProvider {
    private readonly endpoint = 'https://api.upcdatabase.org/product';
    private readonly apiKey: string;

    public constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public async lookup(barcode: string): Promise<IUpcLookupResult> {
        try {
            const {data} = await axios.get(`${this.endpoint}/${barcode}`, {
                params: {apikey: this.apiKey},
                timeout: 8000
            });

            const parsed = upcDatabaseResponseSchema.safeParse(data);
            if (!parsed.success) return {kind: 'error'};

            const title = parsed.data.title?.trim();
            if (!title) return {kind: 'not-found'};

            return {kind: 'found', name: title};
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 429) {
                return {kind: 'rate-limited'};
            }
            return {kind: 'error'};
        }
    }
}
