import {use} from 'react';
import {AppHeader, PageShell} from '@/components';
import EditView from './edit-view';

interface IEditPageProps {
    params: Promise<{id: string}>;
}

export default function EditPage({params}: IEditPageProps) {
    const {id} = use(params);
    return (
        <PageShell>
            <AppHeader title={'Редактирование'} backHref={'/'} />
            <EditView id={id} />
        </PageShell>
    );
}
