import yieldText from '@/assets/yield.png';
import classnames from 'classnames';
import styles from './Yield.less';

export default () => {
  return (
    <div className={styles.yield}>
      <img src={yieldText} alt="yield features" className={styles.yieldText} />
      <div className={styles.subText}>Users will get amazing yield from product</div>

      <div className={styles.blocks}>
        <div className={classnames(styles.block, styles.blockIssue)}>Issuers will get a more than 70% yield</div>
        <div className={classnames(styles.block, styles.blockYield)}>Product buyers will a get more than 30% yield</div>
        <div className={classnames(styles.block, styles.blockAMM)}>Secondary AMM and derivatives market makers can get an extra 20% yield</div>
      </div>
    </div>
  );
};
