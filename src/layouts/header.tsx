import { NavLink } from 'umi';

import classnames from 'classnames';
import styles from './header.less';

export default () => {
  return (
    <div className={styles.header}>
      <NavLink to="/" className={styles.logoLink}>
        Merlin Protocal
      </NavLink>

      <div className={styles.menus}>
        <NavLink to="/" className={classnames(styles.menu, styles.menuHome)} exact activeClassName={styles.active}>
          Home
        </NavLink>
        <NavLink to="/launchpad" className={classnames(styles.menu, styles.menuDapp)} exact activeClassName={styles.active}>
          DAPP
        </NavLink>
        <NavLink to="/docs" className={classnames(styles.menu, styles.menuDocs)} exact activeClassName={styles.active}>
          DOCS
        </NavLink>
      </div>

      <div className={styles.account}>0x123...1234</div>
    </div>
  );
};
