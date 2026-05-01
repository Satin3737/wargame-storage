import type {FC} from 'react';
import type {IPageShellProps} from './types';
import styles from './page-shell.module.scss';

const PageShell: FC<IPageShellProps> = ({children}) => (
    <main className={styles.shell}>
        <div className={styles.container}>{children}</div>
    </main>
);

export default PageShell;
