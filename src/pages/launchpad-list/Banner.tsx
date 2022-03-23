import { RightOutlined } from '@ant-design/icons';
import styles from './Banner.less';

export default () => {
  return (
    <div className={styles.banner}>
      {/* top */}
      <div className={styles.top}>
        <div className={styles.left}>
          <span className={styles.wrapImg}>
            <img src="" alt="" />
          </span>
          <span className={styles.wrapText}>
            <span>BTC Mining Project 2022</span>
            <span>ETH Pool Ends In(ended)</span>
          </span>
        </div>

        <div className={styles.right}>
          <RightOutlined />
          More
        </div>
      </div>

      {/* Message && Buy */}
      <div className={styles.messageAndBuy}>
        <span className={styles.text}>Native IDO tokens of the IDO Launchpad platform</span>
      </div>

      {/* Data */}
      <div className={styles.data}>
        <span className={styles.item}>
          <span className={styles.label}>售价</span>
          <span className={styles.value}>100 USDT</span>
        </span>
        <span className={styles.item}>
          <span className={styles.label}>算力总供应</span>
          <span className={styles.value}>300,000 TH/s</span>
        </span>
        <span className={styles.item}>
          <span className={styles.label}>挖矿周期</span>
          <span className={styles.value}>1 Week</span>
        </span>
        <span className={styles.item}>
          <span className={styles.label}>Time left</span>
          <span className={styles.value}>2天0时0分26秒</span>
        </span>
      </div>

      {/* Process */}
      <div className={styles.process}>
        <div className={styles.label}>Process</div>
        <div
          className={styles.processBar}
          style={{
            background: `linear-gradient(to right, #c75793 0, #c75793 ${30}%, #333 ${30}%)`,
          }}
        >
          <span className={styles.value}>30%</span>
        </div>
      </div>

      {/* Buy */}
      <div className={styles.buy}>
        <span className={styles.button}>获取算力</span>
      </div>
    </div>
  );
};
