import {DownloadSimpleIcon, PlusIcon} from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import {AppHeader, BtnSize, BtnVariant, Button, PageShell, ProductGrid} from '@/components';
import styles from './page.module.scss';

export default function HomePage() {
    return (
        <PageShell>
            <AppHeader title={'Склад'} />
            <div className={styles.actions}>
                <Link href={'/add'} className={styles.action}>
                    <Button variant={BtnVariant.primary} size={BtnSize.lg} fullWidth>
                        <PlusIcon size={20} />
                        {'Добавить'}
                    </Button>
                </Link>
                <Link href={'/export'} className={styles.action}>
                    <Button variant={BtnVariant.ghost} size={BtnSize.lg} fullWidth>
                        <DownloadSimpleIcon size={20} />
                        {'Экспорт'}
                    </Button>
                </Link>
            </div>
            <ProductGrid />
        </PageShell>
    );
}
