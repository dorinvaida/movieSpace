import WishlistDropdown from './WishlistDropdown';
import styles from '../Home.module.scss';

interface PageHeaderProps {
  title?: string;
}

const PageHeader = ({ title = 'Movie space' }: PageHeaderProps) => (
  <header className={styles.header}>
    <h1 className={styles.title}>{title}</h1>
    <WishlistDropdown />
  </header>
);

export default PageHeader;
