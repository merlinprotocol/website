import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'umi';
import Web3 from 'web3';
import { Button } from 'antd';
import { useEthers } from '@usedapp/core';

import classnames from 'classnames';
import styles from './History.less';

import config from '@/config';

const networks: any = config.networks;

const Item = ({ data }: { data: any }) => {
  const renderUSDTCompensation = () => {
    if (data.usdtBalance === 0) return null;

    return ` ${data.usdtBalance / 1e6}USDT`;
  };
  return (
    <div className={styles.Item}>
      <span>{data.index + 1}</span>
      <span>{data.time}</span>
      <span>
        Delivery:
        <span
          className={classnames({
            [styles.nice]: data.settled > data.minSettle,
            [styles.ok]: data.settled === data.minSettle,
            [styles.warn]: data.settled < data.minSettle,
          })}
        >
          {data.wbtcDelivered / 1e8}WBTC
        </span>
        <span>/{data.wbtcMinted}WBTC</span>
      </span>
      <span>
        Balance:{data.wbtcBalance / 1e8}WBTC{renderUSDTCompensation()}
      </span>
      <span
        className={classnames(styles.wrapBtn, {
          [styles.disabled]: data.wbtcClaimed,
        })}
      >
        <Button
          type="link"
          disabled={data.wbtcClaimed}
          onClick={async () => {
            await data.claim();
            await data.update();
          }}
        >
          {data.wbtcClaimed ? 'Claimed' : 'Claim'}
        </Button>
      </span>
    </div>
  );
};

export default () => {
  const sdk = useRef<any>(null);
  const { account } = useEthers();
  const [inverstments, setInverstments] = useState<any[]>([]);

  const {
    query: { addr, network },
  }: any = useLocation();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (account && sdk.current) {
      queryInverstments();
    }
  }, [sdk.current, account]);

  const init = async () => {
    const SDK = require('@/sdk');

    const { provider, wbtc, usdt, vending } = networks[network || 'hardhat'] || {};
    sdk.current = new SDK(provider, addr, wbtc, usdt, vending);
  };

  const queryInverstments = async () => {
    const _inverstments = await sdk.current!.inverstments(account);
    console.log('_inverstments:', _inverstments);
    setInverstments(_inverstments);
  };
  return (
    <div className={styles.history}>
      {inverstments.map((item: any) => (
        <Item key={item.index} data={item}></Item>
      ))}
    </div>
  );
};
