import sologn from '@/assets/sologn.png';
import sologn2 from '@/assets/sologn-2.png';
import styles from './banner.less';

export default () => {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <img src={sologn} alt="sologn" className={styles.sologn} />
        <img src={sologn2} alt="sologn" className={styles.sologn2} />

        <p className={styles.text}>
          Merlin Protocol is a Defi infrastructure protocol for mining hash power and its derivatives. This protocol digitizes real-world cryptocurrency hash
          power assets and introduces them into the Defi ecosystem through a hash power oracle and a decentralized settlement system.
        </p>
      </div>
    </div>
  );
};
