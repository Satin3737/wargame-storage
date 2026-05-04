'use client';

import type {FC} from 'react';
import {CategoryLabel, CategoryValues, type ICategory} from '@/constants';
import {type ISortDir, type ISortKey, SortDir, SortKey} from '@/hooks';
import {Checkbox, Select, TextInput} from '@/components';
import type {IFilterBarProps} from './types';
import styles from './filter-bar.module.scss';

const sortOptions: Array<{value: ISortKey; label: string}> = [
    {value: SortKey.createdAt, label: 'Дате'},
    {value: SortKey.name, label: 'Названию'},
    {value: SortKey.category, label: 'Категории'},
    {value: SortKey.qty, label: 'Количеству'},
    {value: SortKey.id, label: 'ID'}
];

const dirOptions: Array<{value: ISortDir; label: string}> = [
    {value: SortDir.asc, label: '↑'},
    {value: SortDir.desc, label: '↓'}
];

const FilterBar: FC<IFilterBarProps> = ({
    search,
    category,
    onlyOutOfStock,
    isPriceReduction,
    isUsed,
    sortKey,
    sortDir,
    onSearch,
    onCategory,
    onOutOfStock,
    onIsPriceReduction,
    onIsUsed,
    onSortKey,
    onSortDir
}) => (
    <div className={styles.bar}>
        <TextInput
            placeholder={'Поиск по названию или штрихкоду...'}
            value={search}
            onChange={e => onSearch(e.target.value)}
            className={styles.search}
        />
        <div className={styles.row}>
            <Select
                className={styles.category}
                value={category ?? ''}
                onChange={e => onCategory((e.target.value || null) as ICategory | null)}
                options={[
                    {value: '', label: 'Все категории'},
                    ...CategoryValues.map(v => ({value: v, label: CategoryLabel[v]}))
                ]}
            />
            <Select
                className={styles.sortKey}
                value={sortKey}
                onChange={e => onSortKey(e.target.value as ISortKey)}
                options={sortOptions}
            />
            <Select
                className={styles.sortDir}
                value={sortDir}
                onChange={e => onSortDir(e.target.value as ISortDir)}
                options={dirOptions}
            />
        </div>
        <div className={styles.checkboxes}>
            <Checkbox label={'Нет в наличии'} checked={onlyOutOfStock} onChange={e => onOutOfStock(e.target.checked)} />
            <Checkbox
                label={'Уценка'}
                checked={isPriceReduction}
                onChange={e => onIsPriceReduction(e.target.checked)}
            />
            <Checkbox label={'Б/у'} checked={isUsed} onChange={e => onIsUsed(e.target.checked)} />
        </div>
    </div>
);

export default FilterBar;
