import type {IBarcodeLookupProvider, IUpcLookupResult} from './types';

class BarcodeLookupService {
    private readonly providers: IBarcodeLookupProvider[];

    constructor(providers: IBarcodeLookupProvider[]) {
        this.providers = providers;
    }

    public async lookup(barcode: string): Promise<IUpcLookupResult> {
        const trimmed = barcode.trim();
        if (!trimmed) return {kind: 'not-found'};

        for (const provider of this.providers) {
            const result = await provider.lookup(trimmed);
            if (result.kind === 'found') return result;
        }

        return {kind: 'not-found'};
    }
}

export default BarcodeLookupService;
