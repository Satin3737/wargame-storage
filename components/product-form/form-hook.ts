'use client';

import {createFormHook} from '@tanstack/react-form';
import {CategoryField} from './fields/category-field';
import {CheckboxField} from './fields/checkbox-field';
import {NumberField} from './fields/number-field';
import {PhotoField} from './fields/photo-field';
import {SubmitButton} from './fields/submit-button';
import {TextAreaField} from './fields/text-area-field';
import {TextField} from './fields/text-field';
import {fieldContext, formContext} from './form-context';

export const {useAppForm} = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        TextAreaField,
        NumberField,
        CategoryField,
        PhotoField,
        CheckboxField
    },
    formComponents: {
        SubmitButton
    }
});
