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
          <div className={classnames(styles.feature, styles.featureLtv)}>Providing higher leverage to issuers by collateralizing future mining earnings</div>
          <div className={classnames(styles.feature, styles.featureCost)}>No additional capital expenses,No need to pay interest to the purchaser</div>
          <div className={classnames(styles.feature, styles.featureLock)}>Lock in mining income immediately and reduce market risk (BTC volatility)</div>
          <div className={classnames(styles.feature, styles.featurePlatform)}>
            Increasing volume and demand for cryptocurrency mining by creating a standardized NFT that allows for easier access to crypto mining
          </div>
          <div className={classnames(styles.feature, styles.featureMarket)} style={{ width: '460px' }}>
            The secondary market and derivatives market provided by the Merlin Platform increases liquidity and allows for Automated Market Making (AMM), which
            allows users to transact their assets without any intermediary facilitating the exchange
          </div>
        </div>
      </div>
    </div>
  );
};
