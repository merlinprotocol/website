import { useEffect, useState, useRef } from 'react';
import { Menu, Dropdown } from 'antd';
import { Link } from 'umi';
import { useMouseWheel } from 'react-use';
import { NavLink } from 'umi';
import { useEthers } from '@usedapp/core';
import { shortAddress } from '@/utils';

import classnames from 'classnames';
import styles from './NavMenus.less';

const menu = (
  <Menu style={{ width: '144px' }}>
    <Menu.Item>
      <Link to="/mybuyhistory">我申购的项目</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/calendar">我创建的项目</Link>
    </Menu.Item>
  </Menu>
);

export default () => {
  const { account, activateBrowserWallet } = useEthers();

  return (
    <div className={classnames(styles.header)}>
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
