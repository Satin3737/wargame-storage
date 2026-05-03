import {ICategory} from '@/constants';

export const StorageKeys = {
    lastCategory: 'lastCategory'
} as const;

export type IStorageKeys = (typeof StorageKeys)[keyof typeof StorageKeys];

export interface IStorageData {
    [StorageKeys.lastCategory]: ICategory | null;
}

export type IGetStorageData<K extends IStorageKeys> = K extends keyof IStorageData ? IStorageData[K] : null;
