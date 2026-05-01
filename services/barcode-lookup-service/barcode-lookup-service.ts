import type {IBarcodeLookupProvider, IUpcLookupResult} from './types';

class BarcodeLookupService {
    private readonly providers: IBarcodeLookupProvider[];

    constructor(providers: IBarcodeLookupProvider[]) {
        this.providers = providers;
    }

    public async lookup(barcode: string): Promise<IUpcLookupResult> {
        const trimmed = barcode.trim();
        if (!trimmed) return {kind: 'not-found'};

        let rateLimited = false;

        for (const provider of this.providers) {
            const result = await provider.lookup(trimmed);
            if (result.kind === 'found') return result;
            if (result.kind === 'rate-limited') rateLimited = true;
        }

        return rateLimited ? {kind: 'rate-limited'} : {kind: 'not-found'};
    }
}

export default BarcodeLookupService;
