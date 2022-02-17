import React, { useEffect, useState } from 'react';
import { NavLink } from 'umi';
import { Layout, Button } from 'antd';
import { useEthers } from '@usedapp/core';
import { utils } from 'ethers';
import { ChainId, Hardhat, Mainnet, Ropsten, BSCTestnet, DAppProvider, Config } from '@usedapp/core';
import { shortAddress } from '@/utils';
import styles from './basic.less';
import { erc20ContractAddress } from '@/variables';
import erc20ABI from '@/abis/erc20.json';
import { useContract } from '@/hooks/useContract';

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
  multicallAddresses: {
    [ChainId.Mainnet]: '0x0f5d1ef48f12b6f691401bfe88c2037c690a6afe',
    [ChainId.BSCTestnet]: '0x0f5d1ef48f12b6f691401bfe88c2037c690a6afe',
    [ChainId.Hardhat]: '0x0f5d1ef48f12b6f691401bfe88c2037c690a6afe',
    [ChainId.Localhost]: '0x0f5d1ef48f12b6f691401bfe88c2037c690a6afe',
  },
};

const BasicLayout: React.FC = ({ children }) => {
  const { activateBrowserWallet, account, chainId } = useEthers();
  const [tokenBalance, setTokenBalance] = useState<number>();

  const erc20Contract = useContract(erc20ContractAddress, erc20ABI);

  useEffect(() => {
    if (!account || !erc20Contract) return;

    (async () => {
      const balance = await erc20Contract.balanceOf(account);
      setTokenBalance(balance.toNumber());
    })();
  }, [account, erc20Contract]);

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <NavLink to="/">
          <span className={styles.logo}>Launchpad</span>
        </NavLink>

        <span className={styles.menus}>
          <NavLink to="/projects">Projects</NavLink>
        </span>

        {account ? (
          <span className={styles.wrapAccount}>
            <span>chainId: {chainId}</span>
            <span>Account: {shortAddress(account)}</span>
            <span>Token Balance: {utils.formatUnits(String(tokenBalance || '0'), 8)}</span>
          </span>
        ) : (
          <span className={styles.wrapAccount}>
            <Button
              type="link"
              className={styles.connectBtn}
              onClick={() => {
                console.log('activateBrowserWallet');
                activateBrowserWallet();
              }}
            >
              Connect Wallet
            </Button>
          </span>
        )}
      </Header>

      <Content className={styles.content}>{children}</Content>
      <div className={styles.footer}>v1.0.01</div>
    </Layout>
  );
};

export default (props: React.PropsWithChildren<{}>) => (
  <DAppProvider config={config}>
    <BasicLayout>{props.children}</BasicLayout>
  </DAppProvider>
);
