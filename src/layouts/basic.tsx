import React, { useEffect, useState } from 'react';
import { NavLink } from 'umi';
import { Layout, Button } from 'antd';
import { useEthers } from '@usedapp/core';
import { utils } from 'ethers';
import { ChainId, Hardhat, Mainnet, Ropsten, BSCTestnet, DAppProvider, Config } from '@usedapp/core';
import { shortAddress } from '@/utils';
import styles from './basic.less';
import { PAYMENT_TOKEN_CONTRACT_ADDRESS, HASHRATE_CONTRACT_ADDRESS } from '@/variables';
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
  const [tokenBalance, setTokenBalance] = useState<string>();

  const paymentTokenContract = useContract(PAYMENT_TOKEN_CONTRACT_ADDRESS, erc20ABI);

  useEffect(() => {
    if (!account || !paymentTokenContract) return;

    (async () => {
      const balance = await paymentTokenContract.balanceOf(account);

      setTokenBalance(utils.formatEther(balance));
    })();
  }, [account, paymentTokenContract]);

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <NavLink to="/">
          <span className={styles.logo}>Launchpad</span>
        </NavLink>

        <span className={styles.menus}>
          <NavLink to="/projects" activeClassName={styles.active}>
            Projects
          </NavLink>
          <NavLink to={`/bind/${HASHRATE_CONTRACT_ADDRESS}`} activeClassName={styles.active}>
            Bind
          </NavLink>
          <NavLink to="/settler" activeClassName={styles.active}>
            Settler
          </NavLink>
          <NavLink to={`/history/${HASHRATE_CONTRACT_ADDRESS}`} activeClassName={styles.active}>
            History
          </NavLink>
        </span>

        {account ? (
          <span className={styles.wrapAccount}>
            <span>chainId: {chainId}</span>
            <span>Account: {shortAddress(account)}</span>
            <span>Token Balance: {tokenBalance}</span>
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
      <div className={styles.footer}>v1.0.0</div>
    </Layout>
  );
};

export default (props: React.PropsWithChildren<{}>) => (
  <DAppProvider config={config}>
    <BasicLayout>{props.children}</BasicLayout>
  </DAppProvider>
);
