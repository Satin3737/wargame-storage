import axios from 'axios';
import {upcResponseSchema} from '@/schemas';
import type {IUpcLookupResult} from './types';

class UpcLookupService {
    private readonly endpoint = 'https://api.upcitemdb.com/prod/trial/lookup';

    public async lookup(barcode: string): Promise<IUpcLookupResult> {
        const trimmed = barcode.trim();
        if (!trimmed) return {kind: 'not-found'};

        try {
            const {data} = await axios.get(this.endpoint, {
                params: {upc: trimmed},
                timeout: 8000
            });

            const parsed = upcResponseSchema.safeParse(data);
            if (!parsed.success) return {kind: 'error'};

            const title = parsed.data.items?.[0]?.title?.trim();
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

const upcLookupService = new UpcLookupService();
export default upcLookupService;
