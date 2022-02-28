import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { utils } from 'ethers';
import { useConfig, useEthers } from '@usedapp/core';
import dayjs from 'dayjs';
import hashrateABI from '@/abis/project.json';
import { useContract } from '@/hooks/useContract';
import { getProviderOrSigner } from '@/hooks/useContract';
import classnames from 'classnames';
import styles from './index.less';

const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;

enum Stage {
  None,
  Raise, // starttime + 1week, 过了这个时间才可以结算
  Internship, // starttime + 4week 观察期，之后可以拿首付款
  Delivery, // 可以拿首付款
  Final, // 52 之后结束
}
const provider = getProviderOrSigner();

export default () => {
  const config = useConfig();
  const { library } = useEthers();

  const hashrateContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);
  const [blockTimestamp, setBlockTimestamp] = useState(0);

  const [hashrate, setHashrate] = useState<any>({
    supply: undefined,
    price: undefined,
    sold: undefined,
    startTime: undefined,
    jfStart: undefined,
  });

  useEffect(() => {
    setup();
  }, []);

  useEffect(() => {
    getCurrentBlockTime(provider);
  }, [provider]);

  useEffect(() => {
    getCurrentBlockTime(library);
  }, [library]);

  const setup = async () => {
    if (!hashrateContract) return;

    try {
      const supply = await hashrateContract.getSupply();
      const price = await hashrateContract.getPrice();
      const sold = await hashrateContract.getSold();

      const startTime = await hashrateContract.startTime();
      const raiseDuration = await hashrateContract.collectionPeriodDuration();
      const internshipDuration = await hashrateContract.observationPeriodDuration();
      const contractDuraction = await hashrateContract.contractDuraction();
      // const firstFundRatio = await hashrateContract.firstFundRatio();
      const currentStage = await hashrateContract.currentStage();

      const jfStart = startTime.add(raiseDuration).toNumber() * 1000;
      const jfEnd = startTime.add(contractDuraction).toNumber() * 1000;

      // console.log('firstFundRatio: ', firstFundRatio.div('100').toNumber());
      console.log('raiseDuration: ', raiseDuration.toNumber());
      console.log('startTime: ', startTime.toNumber());

      console.log('supply:', supply.toNumber());
      console.log('price:', utils.formatEther(price));
      console.log('sold:', sold.toNumber());
      console.log('startTime:', startTime.toNumber());
      // console.log('currentStage:', currentStage);

      setHashrate({
        supply: supply.toNumber(),
        price: utils.formatEther(price),
        sold: sold.toNumber(),
        startTime: startTime.toNumber(),
        jfStart,
        jfEnd,
        raiseDuration: raiseDuration.toNumber(),
        // firstFundRatio: firstFundRatio.div('100').toNumber(),
        internshipDuration: internshipDuration.toNumber(),
        currentStage,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentBlockTime = async (library: any) => {
    try {
      const blockNumber = await library?.send('eth_blockNumber', []);
      const block = await library?.send('eth_getBlockByNumber', [blockNumber, false]);
      const time = parseInt(block.timestamp);

      console.log('current block: ', block);
      console.log('timestamp: ', new Date(time * 1000));
      console.log('blockNumber: ', parseInt(blockNumber));

      setBlockTimestamp(time * 1000);
    } catch (error) {}
  };

  return (
    <div className={styles.container}>
      <div className={styles.topContent}>
        <span className={styles.imageBox}>
          <img src="https://idolaunchpad.org/images/IDO.png" alt="" />
        </span>

        <span className={styles.contentBox}>
          <span className={styles.wrapTitle}>
            <span className={styles.title}>IDO Tokens Ethereum Blockchain</span>
            {/* <span className={styles.symbolTag}>TBA</span> */}
          </span>
          <span className={styles.infoRow}>
            <span>
              <span>ETH</span>
              <span>Pool Ends In(ended)</span>
            </span>

            <span className={styles.swapdeal}>
              {/* <span>Swap Deal</span> */}
              {/* <span className={styles.symbol}>TBA</span> */}
            </span>
          </span>
        </span>
      </div>

      <div className={styles.descContent}>
        <span>Native IDO tokens of the IDO Launchpad platform</span>
      </div>

      <div className={styles.infoContent}>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Total hashpower supply</span>
          <span className={styles.infotItemValue}>{hashrate.supply} TH/s</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>Price</span>
          <span className={styles.infotItemValue}>{hashrate.price} USDT</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Unit</span>
          <span className={styles.infotItemValue}>USDT</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Hashpower for sale</span>
          <span className={styles.infotItemValue}>{hashrate.supply - hashrate.sold} TH/s</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>Hashpower sold</span>
          <span className={styles.infotItemValue}>{hashrate.sold} TH/s</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Funding process</span>
          <span className={styles.infotItemValue}>
            {hashrate.sold * hashrate.price} / {hashrate.supply * hashrate.price} USDT
          </span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Initial payment</span>
          <span className={styles.infotItemValue}>2,350,000</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>Initial payment ratio</span>
          {hashrate.firstFundRatio && <span className={styles.infotItemValue}>{hashrate.firstFundRatio}%</span>}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Observation period</span>
          <span className={styles.infotItemValue}>{hashrate.internshipDuration / 3600 / 24 / 7} Week</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Delivery start time</span>
          {hashrate.jfStart && <span className={styles.infotItemValue}>{dayjs(hashrate.jfStart).format('YYYY.MM.DD')}</span>}
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>Delivery end time</span>
          <span className={styles.infotItemValue}>{dayjs(hashrate.jfEnd).format('YYYY.MM.DD')}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Deilvery cycle</span>
          <span className={styles.infotItemValue}>{hashrate.raiseDuration / 3600 / 24} Day</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Deposit account balance</span>
          <span className={styles.infotItemValue}>1,000,000 USDT</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>Option account balance</span>
          <span className={styles.infotItemValue}>1,000,000 USDT</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Delivery times</span>
          <span className={styles.infotItemValue}>48 Times</span>
        </div>
      </div>

      <div className={styles.processContent}>
        <div className={styles.labels}>
          <span>Process: {hashrate.currentStage}</span>
          <span>Current Pool</span>
        </div>

        <div className={styles.processBar}>{/* process */}</div>

        <div className={styles.labels}>
          <span>0%</span>
          <span>0 IDO</span>
        </div>
      </div>

      {/* <div className={styles.formContent}>
        <input type="text" placeholder="ETH Amount to Invest" />
        <button>Invest Now</button>
      </div> */}

      <div
        style={{
          marginTop: '24px',
          color: 'rgb(149, 151, 193)',
        }}
      >
        {!!blockTimestamp && <span>Current Block Timestamp: {dayjs(blockTimestamp).format('YYYY.MM.DD HH:mm:ss')}</span>}
      </div>
    </div>
  );
};
