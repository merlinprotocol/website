import application from '@/assets/application.png';
import styles from './Application.less';

export default () => {
  return (
    <div className={styles.application}>
      <div className={styles.content}>
        <img src={application} className={styles.applicationTitle} />
        <p className={styles.text}>
          Hash power holders(listed companies usually) standardize and tokenize their hash power and put it on-chain. Users buy these hash power and mint NFT
          representing the hash power, holding the earning rights of mining. Hash power holders can get up to 50% of the (depending on the asset quality and
          risk indicator) to expand the mining field or buy more mining machines. The rest capital will be released depending on the performance.
        </p>
      </div>
    </div>
  );
};
