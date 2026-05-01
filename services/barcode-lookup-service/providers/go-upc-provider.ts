import axios from 'axios';
import {goUpcResponseSchema} from '@/schemas';
import type {IBarcodeLookupProvider, IUpcLookupResult} from '../types';

export class GoUpcProvider implements IBarcodeLookupProvider {
    private readonly endpoint = 'https://go-upc.com/api/v1/code';
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public async lookup(barcode: string): Promise<IUpcLookupResult> {
        try {
            const {data} = await axios.get(`${this.endpoint}/${barcode}`, {
                headers: {Authorization: `Bearer ${this.apiKey}`},
                timeout: 8000
            });

            const parsed = goUpcResponseSchema.safeParse(data);
            if (!parsed.success) return {kind: 'error'};

            const name = parsed.data.code?.name?.trim();
            if (!name) return {kind: 'not-found'};

            return {kind: 'found', name};
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 429) {
                return {kind: 'rate-limited'};
            }
            return {kind: 'error'};
        }
    }
}
