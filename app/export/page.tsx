import {AppHeader, PageShell} from '@/components';
import ExportView from './export-view';

export default function ExportPage() {
    return (
        <PageShell>
            <AppHeader title={'Экспорт'} backHref={'/'} />
            <ExportView />
        </PageShell>
    );
}
