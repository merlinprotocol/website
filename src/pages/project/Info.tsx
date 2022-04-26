import { useEffect } from 'react';
import { useLocation } from 'umi';
import classnames from 'classnames';
import styles from './Info.less';
import BuyModal from '@/components/BuyModal2';

import { useBasicInfo, useMetadata } from '@/hooks/useSDK';

export default () => {
  const {
    query: { addr, network },
  }: any = useLocation();

  console.log('network', network);
  const metadata = useMetadata(network || 'hardhat', addr);
  const basicInfo = useBasicInfo(network || 'hardhat', addr);

  return (
    <div className={styles.info}>
      <div className={styles.content}>
        {/* top */}
        <div className={styles.top}>
          <div className={styles.left}>
            <span className={styles.wrapImg}>
              <img src={metadata?.logo} alt="" />
            </span>
            <span className={styles.wrapText}>
              <span>{metadata?.name}</span>
              {/* <span>ETH Pool Ends In(ended)</span> */}
            </span>
          </div>

          {/* <div className={styles.right}>
          <RightOutlined />
          More
        </div> */}
        </div>

        {/* Message && Buy */}
        <div className={styles.messageAndBuy}>
          <span className={styles.text}>Project: {addr}</span>

          {/* Buy */}
          <BuyModal
            projectInfo={{
              network: network || 'hardhat',
              projectAddr: addr,
            }}
            project={basicInfo}
            wrapBtnClassName={styles.wrapBtn}
          >
            <div className={styles.buy}>
              <span className={styles.buyBtn}>购买</span>
            </div>
          </BuyModal>
        </div>

        {/* Supply && Time */}
        <div className={styles.supplyAndTime}>
          <span className={styles.totalSupply}>
            <span className={styles.label}>Total hashpower supply</span>
            <span className={styles.value}>{basicInfo.supply}TH/s</span>
          </span>

          <span className={styles.deliveryTimes}>
            <span className={styles.label}>Delivery times</span>
            <span className={styles.value}>{basicInfo.deliveryTimes}Times</span>
          </span>

          <span className={styles.deliveryTime}>
            <span className={styles.label}>Delivery time</span>
            <span className={styles.value}>
              {basicInfo.deliveryStart?.format('YYYY/MM/DD')}-{basicInfo.deliveryEnd?.format('YYYY/MM/DD')}
            </span>
          </span>
        </div>

        {/* Some Amount */}
        <div className={styles.someAmount}>
          <span className={styles.item} style={{ marginRight: '170px' }}>
            <span className={styles.label}>Initial payment</span>
            <span className={styles.value}>{basicInfo.initialPayment} USDT</span>
          </span>
          <span className={styles.item} style={{ marginRight: '150px' }}>
            <span className={styles.label}>Option Account balance</span>
            <span className={styles.value}>- USDT</span>
          </span>
          <span className={styles.item}>
            <span className={styles.label}>Deposit account balance</span>
            <span className={styles.value}>{basicInfo.depositAccountBalance} USDT</span>
          </span>
        </div>

        {/* Stage bar */}
        <div className={styles.stageBar}>
          <span className={classnames(styles.item, styles.collection)}>
            <span className={styles.text}>Collection period</span>
          </span>
          <span className={classnames(styles.item, styles.overation)}>
            <span className={styles.text}>Overvation period</span>
          </span>
          <span className={classnames(styles.item, styles.operating)}>
            <span className={styles.text}>Operating period</span>
          </span>
        </div>
      </div>
    </div>
  );
};
