import application from '@/assets/application.png';
import styles from './Application.less';

export default () => {
  return (
    <div className={styles.application}>
      <div className={styles.content}>
        <img src={application} className={styles.applicationTitle} />
        <p className={styles.text}>
          A hash power issuer (a crypto currency mining company of scale) standardizes and tokenizes their hash power into NFTs Users hold the hash power NFT
          and receive the designated mining income. The issuer can receive up to 50% of the estimated NFT contract value upfront (depending on their issuer
          quality rating and risk score). The issuer may use the proceeds to expand their existing mining operation. The remaining proceeds will be released
          depending on the performance over the life of the NFT contract
        </p>
      </div>
    </div>
  );
};
