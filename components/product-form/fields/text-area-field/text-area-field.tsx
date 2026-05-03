import type {FC} from 'react';
import {TextArea} from '@/components';
import {useFieldContext} from '../../form-context';
import type {ITextAreaFieldProps} from './types';

const TextAreaField: FC<ITextAreaFieldProps> = ({label, hint, ...rest}) => {
    const field = useFieldContext<string>();
    const error = field.state.meta.errors?.[0];
    const errorText = typeof error === 'string' ? error : (error as {message?: string} | undefined)?.message;

    return (
        <TextArea
            {...rest}
            id={field.name}
            label={label}
            hint={hint}
            value={field.state.value ?? ''}
            onChange={e => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            onDelete={() => field.handleChange('')}
            error={errorText}
        />
    );
};

export default TextAreaField;
