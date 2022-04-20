import React, { useEffect, useState, useRef, useContext } from 'react';
import { NavLink } from 'umi';
import { Layout, Button, ConfigProvider } from 'antd';
import { useEthers } from '@usedapp/core';
import { utils } from 'ethers';
import { ChainId, Hardhat, Mainnet, Ropsten, BSCTestnet, DAppProvider, Config } from '@usedapp/core';
import { shortAddress } from '@/utils';
import styles from './basic.less';
import erc20ABI from '@/abis/erc20.json';
import { useContract } from '@/hooks/useContract';
import AddNetwork from '@/components/AddNetwork';
// import Header from './header';

const { Content } = Layout;
const PAYMENT_TOKEN_CONTRACT_ADDRESS = process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS as string;
const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;

const config: Config = {
  // readOnlyChainId: BSCTestnet.chainId,
  // readOnlyUrls: {
  //   [BSCTestnet.chainId]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  // },
  // readOnlyChainId: Hardhat.chainId,
  // readOnlyUrls: {
  //   [Ropsten.chainId]: 'http://localhost:8545',
  // },
  // networks: [Hardhat, Mainnet, Ropsten, BSCTestnet],
  // autoConnect: true,
  multicallAddresses: {
    [ChainId.Mainnet]: '0x0f5d1ef48f12b6f691401bfe88c2037c690a6afe',
    [ChainId.BSCTestnet]: '0x0f5d1ef48f12b6f691401bfe88c2037c690a6afe',
    [ChainId.Hardhat]: '0x0f5d1ef48f12b6f691401bfe88c2037c690a6afe',
    [ChainId.Localhost]: '0x0f5d1ef48f12b6f691401bfe88c2037c690a6afe',
    [ChainId.Rinkeby]: '0x0f5d1ef48f12b6f691401bfe88c2037c690a6afe',
  },
};

const customizeRenderEmpty = () => (
  //这里面就是我们自己定义的空状态
  <div style={{ textAlign: 'center', color: '#999' }}>
    <p>No Data</p>
  </div>
);

const BasicLayout: React.FC = ({ children }) => {
  const { account } = useEthers();
  const [tokenBalance, setTokenBalance] = useState<string>();
  const paymentTokenContract = useContract(PAYMENT_TOKEN_CONTRACT_ADDRESS, erc20ABI);

  useEffect(() => {
    if (!account || !paymentTokenContract) return;

    (async () => {
      const balance = await paymentTokenContract.balanceOf(account);

      setTokenBalance(utils.formatEther(balance));
    })();
  }, [account, paymentTokenContract]);

  useEffect(() => {
    console.log('0.1.2');
  }, []);
  return (
    <div className={styles.layout}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default (props: React.PropsWithChildren<{}>) => (
  <DAppProvider config={config}>
    <ConfigProvider renderEmpty={customizeRenderEmpty}>
      <BasicLayout>{props.children}</BasicLayout>
    </ConfigProvider>
  </DAppProvider>
);
