import Header from '@/layouts/header';
import Footer from '@/layouts/footer';
import Banner from './Banner';
import List from './List';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.launchpadList}>
      <Header></Header>
      <Banner></Banner>
      <List></List>
      <Footer></Footer>
    </div>
  );
};
