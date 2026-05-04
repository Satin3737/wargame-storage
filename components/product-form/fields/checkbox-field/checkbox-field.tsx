import type {FC} from 'react';
import {Checkbox} from '@/components';
import {useFieldContext} from '../../form-context';
import type {ICheckboxFieldProps} from './types';

const CheckboxField: FC<ICheckboxFieldProps> = props => {
    const field = useFieldContext<boolean>();

    return (
        <Checkbox
            {...props}
            checked={field.state.value ?? false}
            onChange={e => field.handleChange(e.target.checked)}
            onBlur={field.handleBlur}
        />
    );
};

export default CheckboxField;
