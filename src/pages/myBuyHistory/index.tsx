import { history } from 'umi';
import Header from '@/layouts/header';
import Foooter from '@/layouts/footer';
import itemLogo from '@/assets/item-logo.png';
import { shortAddress } from '@/utils';
import { useBasicInfo, useMetadata } from '@/hooks/useSDK';
import styles from './index.less';

const projectAddr = process.env.HASHRATE_CONTRACT_ADDRESS as string;

export default () => {
  return (
    <div className={styles.myBuyHistory}>
      <Header></Header>
      <div className={styles.content}>
        <div
          className={styles.myBuyItem}
          onClick={() => {
            history.push(`/launchpad/${31337}/${projectAddr}`);
          }}
        >
          <img src={itemLogo} alt="logo" />

          <div className={styles.info}>
            <span>Binded Project:{shortAddress(projectAddr)}</span>
            <span>Punk#001</span>
            <span>Created by 0x123...1234</span>
            <span>Penguin Punks are 500 collectable penguins on the Ethereum Blockchain!</span>
          </div>

          <a type="button" className={styles.claimBtn}>
            Claim
          </a>
        </div>
      </div>
      <Foooter></Foooter>
    </div>
  );
};
