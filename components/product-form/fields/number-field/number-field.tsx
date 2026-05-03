import type {FC} from 'react';
import {TextInput} from '@/components';
import {useFieldContext} from '../../form-context';
import type {INumberFieldProps} from './types';

const NumberField: FC<INumberFieldProps> = ({label, hint, placeholder, min = 0, max}) => {
    const field = useFieldContext<number>();
    const error = field.state.meta.errors?.[0];
    const errorText = typeof error === 'string' ? error : (error as {message?: string} | undefined)?.message;

    return (
        <TextInput
            id={field.name}
            label={label}
            hint={hint}
            placeholder={placeholder}
            type={'number'}
            inputMode={'numeric'}
            min={min}
            max={max}
            value={Number.isFinite(field.state.value) ? field.state.value : ''}
            onChange={e => {
                const value = e.target.value;
                const next = !value ? value : Number(value);
                field.handleChange((Number.isFinite(next) ? next : '') as number);
            }}
            onBlur={field.handleBlur}
            error={errorText}
        />
    );
};

export default NumberField;
