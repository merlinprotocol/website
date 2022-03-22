import { RightOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import styles from './Info.less';

export default () => {
  return (
    <div className={styles.info}>
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
        <span className={styles.text}>Native IDO tokens of the IDO Launchpad platform Project:0x1234567890abcdef</span>
        <span className={styles.buyBtn}>购买</span>
      </div>

      {/* Supply && Time */}
      <div className={styles.supplyAndTime}>
        <span className={styles.totalSupply}>
          <span className={styles.label}>Total hashpower supply</span>
          <span className={styles.value}>100TH/s</span>
        </span>

        <span className={styles.deliveryTimes}>
          <span className={styles.label}>Delivery times</span>
          <span className={styles.value}>48Times</span>
        </span>

        <span className={styles.deliveryTime}>
          <span className={styles.label}>Delivery time</span>
          <span className={styles.value}>2022/03/07-2023/03/06</span>
        </span>
      </div>

      {/* Some Amount */}
      <div className={styles.someAmount}>
        <span className={styles.item} style={{ marginRight: '170px' }}>
          <span className={styles.label}>Initial payment</span>
          <span className={styles.value}>2,350,000 USDT</span>
        </span>
        <span className={styles.item} style={{ marginRight: '150px' }}>
          <span className={styles.label}>Option Account balance</span>
          <span className={styles.value}>100,000,000 USDT</span>
        </span>
        <span className={styles.item}>
          <span className={styles.label}>Deposit account balance</span>
          <span className={styles.value}>1,000,000 USDT</span>
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
  );
};
