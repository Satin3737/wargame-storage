import type {FC} from 'react';
import {BtnSize, Button, Spinner} from '@/components';
import {useFormContext} from '../../form-context';
import type {ISubmitButtonProps} from './types';

const SubmitButton: FC<ISubmitButtonProps> = ({children}) => {
    const form = useFormContext();

    return (
        <form.Subscribe selector={state => ({canSubmit: state.canSubmit, isSubmitting: state.isSubmitting})}>
            {({canSubmit, isSubmitting}) => (
                <Button type={'submit'} size={BtnSize.lg} fullWidth disabled={!canSubmit || isSubmitting}>
                    {isSubmitting && <Spinner size={20} inverted={true} />}
                    {children}
                </Button>
            )}
        </form.Subscribe>
    );
};

export default SubmitButton;
