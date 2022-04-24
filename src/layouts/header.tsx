import { useEffect, useState, useRef } from 'react';
import { useMouseWheel } from 'react-use';
import { Menu, Dropdown } from 'antd';
import { NavLink, Link } from 'umi';
import { useEthers } from '@usedapp/core';
import { shortAddress } from '@/utils';

import classnames from 'classnames';
import styles from './header.less';

export default () => {
  const { account, activateBrowserWallet } = useEthers();

  const mouseWheel = useMouseWheel();
  const [hidden, setHidden] = useState(false);

  const deltaY = useRef(0);
  const [ontop, setOntop] = useState(true);

  useEffect(() => {
    if (mouseWheel > deltaY.current) {
      if (!hidden) {
        setHidden(true);
      }
    } else {
      if (hidden) {
        setHidden(false);
      }
    }

    if (window.scrollY === 0) {
      !ontop && setOntop(true);
    } else {
      ontop && setOntop(false);
    }

    deltaY.current = mouseWheel;
  }, [mouseWheel]);

  const menu = (
    <Menu style={{ width: '144px' }}>
      <Menu.Item>
        <Link to="/launchpad">我申购的项目</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/calendar">我创建的项目</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      className={classnames(styles.header, {
        [styles.hidden]: hidden,
        [styles.ontop]: ontop,
      })}
    >
      <NavLink to="/" className={styles.logoLink}>
        Merlin Protocol
      </NavLink>

      <div className={styles.menus}>
        <NavLink to="/" className={classnames(styles.menu, styles.menuHome)} exact activeClassName={styles.active}>
          Home
        </NavLink>
        <NavLink to="/launchpad" className={classnames(styles.menu, styles.menuDapp)} exact activeClassName={styles.active}>
          DAPP
        </NavLink>
        <a href="https://eason-3.gitbook.io/mercury/protocol/merlin-overview" target="_blank" className={classnames(styles.menu, styles.menuDocs)}>
          DOCS
        </a>
      </div>

      <div className={styles.account}>
        {account ? (
          <Dropdown overlay={menu} placement="bottomCenter">
            <span>{shortAddress(account)}</span>
          </Dropdown>
        ) : (
          <a onClick={activateBrowserWallet}>Connect</a>
        )}
      </div>
    </div>
  );
};
