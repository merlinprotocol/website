import Header from '@/layouts/header';
import Footer from '@/layouts/footer';
import Banner from './Banner';
import Application from './Application';
import Product from './Product';
import Yield from './Yield';
import Technical from './Technical';
import Team from './Team';
import Cooperation from './Cooperation';
import Roadmap from './Roadmap';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.home}>
      <div className={styles.wrapBanner}>
        <Header></Header>
        <Banner></Banner>
      </div>

      <div className={styles.bg1}>
        <Application></Application>
        <Product></Product>
        <Yield></Yield>
        <Technical></Technical>
        <Roadmap></Roadmap>
      </div>

      <div className={styles.bg2}>
        <Team></Team>
        {/* <Cooperation></Cooperation> */}
        <Footer></Footer>
      </div>
    </div>
  );
};
