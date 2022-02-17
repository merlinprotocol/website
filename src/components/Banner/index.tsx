import classnames from 'classnames';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.container}>
      <div className={styles.topContent}>
        <span className={styles.imageBox}>
          <img src="https://idolaunchpad.org/images/IDO.png" alt="" />
        </span>

        <span className={styles.contentBox}>
          <span className={styles.wrapTitle}>
            <span className={styles.title}>IDO Tokens Ethereum Blockchain</span>
            <span className={styles.symbolTag}>TBA</span>
          </span>
          <span className={styles.infoRow}>
            <span>
              <span>ETH</span>
              <span>Pool Ends In(ended)</span>
            </span>

            <span className={styles.swapdeal}>
              <span>Swap Deal</span>
              <span className={styles.symbol}>TBA</span>
            </span>
          </span>
        </span>
      </div>

      <div className={styles.descContent}>
        <span>Native IDO tokens of the IDO Launchpad platform</span>
      </div>

      <div className={styles.infoContent}>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>IDO Price</span>
          <span className={styles.infotItemValue}>TBA</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>Pool Discount</span>
          <span className={styles.infotItemValue}>TBA</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Pool Cap</span>
          <span className={styles.infotItemValue}>TBA</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Price Discovery</span>
          <span className={styles.infotItemValue}>pending</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>Auction Bidders</span>
          <span className={styles.infotItemValue}>0</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Access</span>
          <span className={styles.infotItemValue}>Public</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>ETH Pool</span>
          <span className={styles.infotItemValue}>0 ETH</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>Discount Factor</span>
          <span className={styles.infotItemValue}>TBA</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>Auction Phase Time</span>
          <span className={styles.infotItemValue}>TBA</span>
        </div>
      </div>

      <div className={styles.processContent}>
        <div className={styles.labels}>
          <span>Process</span>
          <span>Current Pool</span>
        </div>

        <div className={styles.processBar}>{/* process */}</div>

        <div className={styles.labels}>
          <span>0%</span>
          <span>0 IDO</span>
        </div>
      </div>

      <div className={styles.formContent}>
        <input type="text" placeholder="ETH Amount to Invest" />
        <button>Invest Now</button>
      </div>
    </div>
  );
};
