import Header from '@/layouts/header';
import Footer from '@/layouts/footer';
import Info from './Info';
import Chart from './Chart';
import History from './History';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.launchpad}>
      <Header></Header>
      <Info></Info>
      <Chart></Chart>
      <History></History>
      <Footer></Footer>
    </div>
  );
};
