import BarcodeLookupService from './barcode-lookup-service';
import {GoUpcProvider} from './providers/go-upc-provider';
import {UpcDatabaseProvider} from './providers/upcdatabase-provider';
import {UpcItemDbProvider} from './providers/upcitemdb-provider';

const goUpcKey = process.env.NEXT_PUBLIC_GO_UPC_API_KEY;
const upcDatabaseKey = process.env.NEXT_PUBLIC_UPCDATABASE_API_KEY;

if (!goUpcKey) throw new Error('NEXT_PUBLIC_GO_UPC_API_KEY is not set');
if (!upcDatabaseKey) throw new Error('NEXT_PUBLIC_UPCDATABASE_API_KEY is not set');

const barcodeLookupService = new BarcodeLookupService([
    new UpcItemDbProvider(),
    new GoUpcProvider(goUpcKey),
    new UpcDatabaseProvider(upcDatabaseKey)
]);

export default barcodeLookupService;
export type {IUpcLookupResult} from './types';
