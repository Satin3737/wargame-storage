import type {FC} from 'react';
import {CategoryLabel, CategoryValues, type ICategory} from '@/constants';
import {Select} from '@/components';
import {useFieldContext} from '../../form-context';
import type {ICategoryFieldProps} from './types';

const options = CategoryValues.map(value => ({value, label: CategoryLabel[value]}));

const CategoryField: FC<ICategoryFieldProps> = ({label = 'Категория'}) => {
    const field = useFieldContext<ICategory>();
    const error = field.state.meta.errors?.[0];
    const errorText = typeof error === 'string' ? error : (error as {message?: string} | undefined)?.message;

    return (
        <Select
            id={field.name}
            label={label}
            options={options}
            value={field.state.value}
            onChange={e => field.handleChange(e.target.value as ICategory)}
            onBlur={field.handleBlur}
            error={errorText}
        />
    );
};

export default CategoryField;
