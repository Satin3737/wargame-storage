import {type StateCreator, create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';

interface IStore<T> {
    store: StateCreator<T, [['zustand/persist', unknown], ['zustand/devtools', never], ['zustand/immer', never]]>;
    name: string;
    partialize?: (state: T) => object;
}

export const createStore = <T>({store, name, partialize}: IStore<T>) =>
    create<T>()(persist(devtools(immer(store), {name, store: name}), {name, ...(!!partialize && {partialize})}));

export const partializeExclude = <T>(state: T, excludeArr: string[]) => {
    return Object.fromEntries(Object.entries(state || {}).filter(([key]) => !excludeArr.includes(key)));
};

export const partializeInclude = <T>(state: T, includeArr: string[]) => {
    return includeArr?.reduce((acc, key) => ({...acc, [key]: state?.[key as keyof T] ?? ''}), {});
};
