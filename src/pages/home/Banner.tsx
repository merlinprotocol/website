import sologn from '@/assets/sologn.png';
import styles from './banner.less';

export default () => {
  return (
    <div className={styles.banner}>
      <img src={sologn} alt="sologn" className={styles.sologn} />
      <p className={styles.text}>
        Merlin Protocol is a Defi infrastructure protocol for mining hash power and its derivatives. This protocol digitizes real-world cryptocurrency hash
        power assets and introduces them into the Defi ecosystem through a hash power oracle and a decentralized settlement system.
      </p>
    </div>
  );
};