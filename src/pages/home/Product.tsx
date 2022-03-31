import logo from '@/assets/logo-2.png';
import product from '@/assets/product.png';
import classnames from 'classnames';
import styles from './Product.less';

export default () => {
  return (
    <div className={styles.product}>
      <div className={styles.content}>
        <img src={logo} alt="logo" className={styles.logo} />
        <img src={product} alt="product" className={styles.productText} />

        <div className={styles.features}>
          <div className={classnames(styles.feature, styles.featureLtv)}>
            Higher LTV ratio, Merlin can provide an imperial LTV ratio of 50-75%, much higher than common loan
          </div>
          <div className={classnames(styles.feature, styles.featureCost)}>NO extra capital cost, no need to pay interest</div>
          <div className={classnames(styles.feature, styles.featureLock)}>Lock mining income early, avoid BTC volatility</div>
          <div className={classnames(styles.feature, styles.featurePlatform)}>
            Standardized issuing platform can alleviate discount by heterogeneity and more convenience for additional issuing
          </div>
          <div className={classnames(styles.feature, styles.featureMarket)}>
            The secondary market provided by the platform will increase liquidity premium, and chances for AMM, derivatives market.
          </div>
        </div>
      </div>
    </div>
  );
};
