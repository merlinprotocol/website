import { Link } from 'umi';
import Header from '@/layouts/header';
import img404 from '@/assets/404text.png';
import styles from './index.less';

export default () => {
  return (
    <div>
      <Header></Header>
      <div className={styles.content}>
        <img src={img404} alt="404" className={styles.image} />

        <span className={styles.title}>This page is lost.</span>
        <span className={styles.text}>Oops, you've lost in space</span>
        <span className={styles.message}>We Can't find the page that you're looking for...</span>

        <Link to="/" className={styles.button}>
          Navigate back home
        </Link>
      </div>
    </div>
  );
};
