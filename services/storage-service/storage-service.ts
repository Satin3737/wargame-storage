import {IGetStorageData, IStorageKeys} from './types';

class StorageService {
    private readonly storage: Storage = global?.localStorage;

    public get<K extends IStorageKeys>(key: K): IGetStorageData<K> | null {
        const res = this.storage?.getItem(key);
        if (!res) return null;
        return JSON.parse(res);
    }

    public set<K extends IStorageKeys>(key: K, value: IGetStorageData<K>): void {
        if (value !== null && value !== undefined) this.storage?.setItem(key, JSON.stringify(value));
    }

    public delete(key: IStorageKeys): void {
        this.storage?.removeItem(key);
    }

    public clear(): void {
        this.storage?.clear();
    }
}

const storageService = new StorageService();
export default storageService;
