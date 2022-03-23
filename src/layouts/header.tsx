import { Link } from 'umi';
import classnames from 'classnames';
import styles from './header.less';

export default () => {
  return (
    <div className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        Merlin Protocal
      </Link>

      <div className={styles.menus}>
        <Link to="/" className={classnames(styles.menu, styles.menuHome)}>
          HOME
        </Link>
        <Link to="/launchpad" className={classnames(styles.menu, styles.menuDapp)}>
          DAPP
        </Link>
        <Link to="/" className={classnames(styles.menu, styles.menuDocs)}>
          DOCS
        </Link>
      </div>

      <div className={styles.account}>0x123...1234</div>
    </div>
  );
};
