import Banner from './Banner';
import Application from './Application';
import Product from './Product';
import Yield from './Yield';
import Technical from './Technical';
import Team from './Team';
import Cooperation from './Cooperation';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.home}>
      <Banner></Banner>
      <Application></Application>
      <Product></Product>
      <Yield></Yield>
      <Technical></Technical>
      <Team></Team>
      <Cooperation></Cooperation>
    </div>
  );
};
