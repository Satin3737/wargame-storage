'use client';

import {createFormHook} from '@tanstack/react-form';
import {CategoryField} from './fields/category-field';
import {NumberField} from './fields/number-field';
import {PhotoField} from './fields/photo-field';
import {SubmitButton} from './fields/submit-button';
import {TextField} from './fields/text-field';
import {fieldContext, formContext} from './form-context';

export const {useAppForm} = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        NumberField,
        CategoryField,
        PhotoField
    },
    formComponents: {
        SubmitButton
    }
});
