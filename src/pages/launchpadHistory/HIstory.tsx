import { useRef, useEffect, useState } from 'react';
import Web3 from 'web3';
import { Button } from 'antd';
import { useEthers } from '@usedapp/core';

import classnames from 'classnames';
import styles from './History.less';

const Item = ({ data }: { data: any }) => {
  return (
    <div className={styles.Item}>
      <span>{data.index + 1}</span>
      <span>{data.time}</span>
      <span>
        交付:
        <span
          className={classnames({
            [styles.nice]: data.settled > data.minSettle,
            [styles.ok]: data.settled === data.minSettle,
            [styles.warn]: data.settled < data.minSettle,
          })}
        >
          {data.wbtcDelivered / 1e8}WBTC
        </span>
        <span>/{data.wbtcMinted / 1e8}WBTC</span>
      </span>
      <span>
        收益: {data.wbtcBalance / 1e8 || data.wbtcClaimed / 1e8}WBTC、 {data.usdtBalance / 1e6 || data.usdtCompensation / 1e6 + 'USDT'}
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
          Claim
        </Button>
      </span>
    </div>
  );
};

export default () => {
  const sdk = useRef<any>(null);
  const { account } = useEthers();
  const [inverstments, setInverstments] = useState<any[]>([]);

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
    sdk.current = new SDK(
      Web3.givenProvider,
      process.env.HASHRATE_CONTRACT_ADDRESS,
      process.env.SETTLE_TOKEN_CONTRACT_ADDRESS,
      process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS,
    );
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
