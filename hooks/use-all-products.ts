'use client';

import {useLiveQuery} from 'dexie-react-hooks';
import {type IProduct, db} from '@/db';

const useAllProducts = (): IProduct[] | undefined => useLiveQuery(() => db.products.toArray(), []);

export default useAllProducts;
