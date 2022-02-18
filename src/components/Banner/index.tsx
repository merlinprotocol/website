import { useEffect, useState } from 'react';
import { utils } from 'ethers';
import hashrateABI from '@/abis/project.json';
import { HASHRATE_CONTRACT_ADDRESS } from '@/variables';
import { useContract } from '@/hooks/useContract';
import classnames from 'classnames';
import styles from './index.less';

export default () => {
  const hashrateContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);

  const [hashrate, setHashrate] = useState<any>({
    supply: undefined,
    price: undefined,
    sold: undefined,
  });

  useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    if (!hashrateContract) return;

    try {
      const supply = await hashrateContract.getSupply();
      const price = await hashrateContract.getPrice();
      const sold = await hashrateContract.getSold();

      console.log('supply:', supply.toNumber());
      console.log('price:', utils.formatEther(price));
      console.log('sold:', sold.toNumber());

      setHashrate({
        supply: supply.toNumber(),
        price: utils.formatEther(price),
        sold: sold.toNumber(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topContent}>
        <span className={styles.imageBox}>
          <img src="https://idolaunchpad.org/images/IDO.png" alt="" />
        </span>

        <span className={styles.contentBox}>
          <span className={styles.wrapTitle}>
            <span className={styles.title}>IDO Tokens Ethereum Blockchain</span>
            <span className={styles.symbolTag}>TBA</span>
          </span>
          <span className={styles.infoRow}>
            <span>
              <span>ETH</span>
              <span>Pool Ends In(ended)</span>
            </span>

            <span className={styles.swapdeal}>
              <span>Swap Deal</span>
              <span className={styles.symbol}>TBA</span>
            </span>
          </span>
        </span>
      </div>

      <div className={styles.descContent}>
        <span>Native IDO tokens of the IDO Launchpad platform</span>
      </div>

      <div className={styles.infoContent}>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>算力总供应量</span>
          <span className={styles.infotItemValue}>{hashrate.supply} TH/s</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>售价</span>
          <span className={styles.infotItemValue}>{hashrate.price} USDT</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>售价单位</span>
          <span className={styles.infotItemValue}>USDT</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>待售</span>
          <span className={styles.infotItemValue}>{hashrate.supply - hashrate.sold} TH/s</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>已售</span>
          <span className={styles.infotItemValue}>{hashrate.sold} TH/s</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>募集进度</span>
          <span className={styles.infotItemValue}>
            {hashrate.sold * hashrate.price} / {hashrate.supply * hashrate.price} USDT
          </span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>首付款</span>
          <span className={styles.infotItemValue}>2,350,000</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>首付款比例</span>
          <span className={styles.infotItemValue}>45%</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>观察期持续时间</span>
          <span className={styles.infotItemValue}>4周</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>交付起始时间</span>
          <span className={styles.infotItemValue}>2022.03.15</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>交付结束时间</span>
          <span className={styles.infotItemValue}>2023.03.14</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>交付间隔</span>
          <span className={styles.infotItemValue}>7天</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>保证金账户额度</span>
          <span className={styles.infotItemValue}>1,000,000 USDT</span>
        </div>
        <div className={classnames(styles.infoItem, styles.center)}>
          <span className={styles.infotItemLabel}>套保账户额度</span>
          <span className={styles.infotItemValue}>1,000,000 USDT</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infotItemLabel}>交付总次数</span>
          <span className={styles.infotItemValue}>48次</span>
        </div>
      </div>

      <div className={styles.processContent}>
        <div className={styles.labels}>
          <span>Process</span>
          <span>Current Pool</span>
        </div>

        <div className={styles.processBar}>{/* process */}</div>

        <div className={styles.labels}>
          <span>0%</span>
          <span>0 IDO</span>
        </div>
      </div>

      <div className={styles.formContent}>
        <input type="text" placeholder="ETH Amount to Invest" />
        <button>Invest Now</button>
      </div>
    </div>
  );
};
