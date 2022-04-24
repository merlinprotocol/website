import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { Hardhat, Mainnet, Ropsten, BSCTestnet, DAppProvider, Config, useEthers } from '@usedapp/core';
import styles from './basic.less';

const config: Config = {
  multicallAddresses: {
    [Hardhat.chainId]: '0x0f5d1ef48f12b6f691401bfe88c2037c690a6afe',
  },
};

const customizeRenderEmpty = () => (
  //这里面就是我们自己定义的空状态
  <div style={{ textAlign: 'center', color: '#999' }}>
    <p>No Data</p>
  </div>
);

const BasicLayout: React.FC = ({ children }) => {
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
