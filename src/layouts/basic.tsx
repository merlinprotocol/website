import { NavLink } from 'umi';
import { Layout, Button } from 'antd';
import { useEthers, useEtherBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import { Hardhat, Mainnet, Ropsten, BSCTestnet, DAppProvider, Config } from '@usedapp/core';
import { shortAddress } from '@/utils';
import styles from './basic.less';
import React from 'react';

const { Header, Footer, Content } = Layout;

const config: Config = {
  // readOnlyChainId: BSCTestnet.chainId,
  // readOnlyUrls: {
  //   [BSCTestnet.chainId]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  // },
  // readOnlyChainId: Hardhat.chainId,
  // readOnlyUrls: {
  //   [Ropsten.chainId]: 'http://localhost:8545',
  // },
  networks: [Hardhat, Mainnet, Ropsten, BSCTestnet],
  autoConnect: true,
};

const BasicLayout: React.FC = ({ children }) => {
  const { activateBrowserWallet, account, chainId } = useEthers();
  const etherBalance = useEtherBalance(account);

  return (
    <Layout>
      <Header className={styles.header}>
        <NavLink to="/">
          <span className={styles.logo}>LOGO</span>
        </NavLink>

        <span className={styles.menus}>
          <NavLink to="/projects">项目</NavLink>
        </span>

        {account ? (
          <span className={styles.wrapAccount}>
            <span>chainId: {chainId}</span>
            <span>Account: {shortAddress(account)}</span>
            <span>Balance: {formatEther(etherBalance || '0')}</span>
          </span>
        ) : (
          <Button
            type="link"
            className={styles.connectBtn}
            onClick={() => {
              console.log('activateBrowserWallet');
              activateBrowserWallet();
            }}
          >
            关联钱包
          </Button>
        )}
      </Header>

      <Content className={styles.content}>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default (props: React.PropsWithChildren<{}>) => (
  <DAppProvider config={config}>
    <BasicLayout>{props.children}</BasicLayout>
  </DAppProvider>
);
