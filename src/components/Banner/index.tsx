import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { utils } from 'ethers';
import { useEthers } from '@usedapp/core';
import BuyModal from '../BuyModal';
import moment from 'moment';
import useProject from '@/hooks/useProject';
import dayjs from 'dayjs';
import classnames from 'classnames';
import styles from './index.less';

export default () => {
  const { library, account } = useEthers();
  const { project, init } = useProject();
  const [process, setProcess] = useState(0);
  const [duration, setDuration] = useState<any>(null);
  const [blockTimestamp, setBlockTimestamp] = useState(0);

  // 倒计时
  useEffect(() => {
    if (!project?.raiseEnd) return;
    const timer = setInterval(() => {
      const ms = moment().diff(project.raiseEnd);
      setDuration(moment.duration(ms * -1));
    }, 1000);
    return () => clearInterval(timer);
  }, [project?.raiseEnd]);

  useEffect(() => {
    getCurrentBlockTime(library);
  }, [library]);

  useEffect(() => {
    if (project?.sold) {
      setProcess(project.sold.toNumber() / project.supply.toNumber());
    }
  }, [project?.sold]);

  const getCurrentBlockTime = async (library: any) => {
    try {
      const blockNumber = await library?.send('eth_blockNumber', []);
      const block = await library?.send('eth_getBlockByNumber', [blockNumber, false]);
      const time = parseInt(block.timestamp);

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
          <span className={styles.infotItemValue}>{project?.supply.toNumber()} TH/s</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>Price</span>
          <span className={styles.infotItemValue}>{utils.formatEther(project?.price.toString() || '0')} USDT</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Miner period</span>
          <span className={styles.infotItemValue}>{project?.contractDuraction.div(3600).div(24).toNumber()} Days</span>
        </div>

        {duration && (
          <div className={styles.wrapDuration}>
            <span>{duration.days()} days</span>
            <span>{duration.hours()} hours</span>
            <span>{duration.minutes()} minutes</span>
            <span>{duration.seconds()} seconds</span>
            {/* <span>{duration.milliseconds()} ms</span> */}
          </div>
        )}
      </div>

      <div className={styles.processContent}>
        <div className={styles.labels}>
          <span>Sold process</span>
          {/* <span>Current Pool</span> */}
        </div>

        <div
          style={{
            background: `linear-gradient(to right, var(--secondary-color) 0%, var(--secondary-color) ${process * 100}%, #fff  ${process * 100}%)`,
          }}
          className={styles.processBar}
        ></div>

        <div className={styles.labels}>
          <span>{process * 100}%</span>
        </div>
      </div>

      <BuyModal project={project} onOk={init}>
        <Button type="primary" block size="large" style={{ marginTop: '24px' }} disabled={!account}>
          Get Hashrate
        </Button>
      </BuyModal>

      {account && <p>current block timestamp: {dayjs(blockTimestamp).format('YYYY-MM-DD HH:mm:ss')}</p>}
    </div>
  );
};
