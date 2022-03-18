import cooperation from '@/assets/cooperation.png';
import logo1 from '@/assets/coo-logo1.png';
import logo2 from '@/assets/coo-logo2.png';
import logo3 from '@/assets/coo-logo3.png';
import logo4 from '@/assets/coo-logo4.png';
import logo5 from '@/assets/coo-logo5.svg';
import logo6 from '@/assets/coo-logo6.png';
import logo7 from '@/assets/coo-logo7.png';
import logo8 from '@/assets/coo-logo8.svg';
import logo9 from '@/assets/coo-logo9.svg';
import styles from './Cooperation.less';

export default () => {
  return (
    <div className={styles.cooperation}>
      <img src={cooperation} alt="" className={styles.cooperationTitle} />

      <div className={styles.content}>
        <div className={styles.wrapLogo}>
          <img src={logo1} />
        </div>
        <div className={styles.wrapLogo}>
          <img src={logo2} />
        </div>
        <div className={styles.wrapLogo}>
          <img src={logo3} />
        </div>
        <div className={styles.wrapLogo}>
          <img src={logo4} />
        </div>
        <div className={styles.wrapLogo}>
          <img src={logo5} />
        </div>
        <div className={styles.wrapLogo}>
          <img src={logo6} />
        </div>
        <div className={styles.wrapLogo}>
          <img src={logo7} />
        </div>
        <div className={styles.wrapLogo}>
          <img src={logo8} />
        </div>
        <div className={styles.wrapLogo}>
          <img src={logo9} />
        </div>
      </div>
    </div>
  );
};
