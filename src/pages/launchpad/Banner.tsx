import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Link } from 'umi';
import { RightOutlined } from '@ant-design/icons';
import BuyModal from '@/components/BuyModal2';
import styles from './Banner.less';
import moment from 'moment';
import { useBasicInfo, useMetadata } from '@/hooks/useSDK';
import config from '@/config';

const networks: any = config.networks;

const SECONDS_PER_WEEK = 7 * 24 * 3600;
const project = process.env.HASHRATE_CONTRACT_ADDRESS as string;

export default () => {
  const metadata = useMetadata('hardhat', project);
  const basicInfo = useBasicInfo('hardhat', project);

  const [raising, setRaising] = useState(false); // 募集中
  const [timeLeft, setTimeLeft] = useState<moment.Duration>(); // 募集期剩余时间
  const [soldPercent, setSoldPercent] = useState(0);

  // init raising
  // timerLeft
  useEffect(() => {
    let timer: any = null;

    if (basicInfo && moment().isAfter(basicInfo?.raiseStart) && moment().isBefore(basicInfo?.raiseEnd)) {
      setRaising(true);

      timer = setInterval(() => {
        const duration = moment.duration(basicInfo.raiseEnd.diff(moment()));

        setTimeLeft(duration);
      }, 50);
    }

    return () => {
      timer && clearInterval(timer);
    };
  }, [basicInfo]);

  // calc process
  useEffect(() => {
    if (basicInfo) {
      console.log(basicInfo);
      setSoldPercent(Math.floor((basicInfo.sold / basicInfo.supply) * 1e4) / 1e4);
    }
  }, [basicInfo]);

  return (
    <div className={styles.banner}>
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

          <div className={styles.right}>
            <Link to={`/launchpad/project?addr=${project}`} style={{ color: '#fff' }}>
              <RightOutlined />
              More
            </Link>
          </div>
        </div>

        {/* Message && Buy */}
        <div className={styles.messageAndBuy}>
          <span className={styles.text}>{metadata?.description}</span>
        </div>

        {/* Data */}
        <div className={styles.data}>
          <span className={styles.item}>
            <span className={styles.label}>售价</span>
            <span className={styles.value}>{basicInfo?.price || '-'} USDT</span>
          </span>
          <span className={styles.item}>
            <span className={styles.label}>算力总供应</span>
            <span className={styles.value}>{basicInfo?.supply} TH/s</span>
          </span>
          <span className={styles.item}>
            <span className={styles.label}>挖矿周期</span>
            <span className={styles.value}>{basicInfo?.contractDuraction / SECONDS_PER_WEEK} Week</span>
          </span>
          <span className={styles.item}>
            <span className={styles.label}>Time left</span>
            <span className={styles.value}>
              {raising ? (
                <span>
                  {timeLeft?.get('days')}天{timeLeft?.get('hours')}时{timeLeft?.get('minutes')}分{timeLeft?.get('seconds')}秒
                </span>
              ) : (
                '非募集期'
              )}
            </span>
          </span>
        </div>

        {/* Process */}
        <div className={styles.process}>
          <div className={styles.label}>Process</div>
          <div
            className={styles.processBar}
            style={{
              background: `linear-gradient(to right, #c75793 0, #c75793 ${soldPercent * 100}%, #333 ${soldPercent * 100}%)`,
            }}
          >
            <span className={styles.value}>{soldPercent * 100}%</span>
          </div>
        </div>

        {/* Buy */}

        <BuyModal
          project={basicInfo}
          projectInfo={{
            network: 'hardhat',
            projectAddr: process.env.HASHRATE_CONTRACT_ADDRESS as string,
          }}
        >
          <div className={styles.buy}>
            {/* {basicInfo?.currentStage === 'Collection' && <span className={styles.button}>获取算力</span>} */}
            <Button
              size="large"
              className={styles.button}
              disabled={basicInfo?.currentStage !== 'CollectionPeriod' || Number(basicInfo?.sold) === Number(basicInfo?.supply)}
            >
              获取算力
            </Button>
          </div>
        </BuyModal>
      </div>
    </div>
  );
};
