import {AppHeader, PageShell, ProductForm, ProductFormMode} from '@/components';

export default function AddPage() {
    return (
        <PageShell>
            <AppHeader title={'Новый товар'} backHref={'/'} />
            <ProductForm mode={ProductFormMode.create} />
        </PageShell>
    );
}
