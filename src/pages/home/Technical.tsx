import technical from '@/assets/technical.png';
import classnames from 'classnames';
import styles from './Technical.less';

export default () => {
  return (
    <div className={styles.technical}>
      <img src={technical} alt="Technical" className={styles.technicalTitle} />

      <div className={styles.content}>
        <div className={styles.title}>Standardization of hash power</div>
        <div className={styles.colorBlock} style={{ padding: '48px 40px' }}>
          Each NFT collections represents the n/T hash power corresponding to a certain periods. The investor enjoy the mining income right of the corresponding
          hash power during the period without concern about any other factors such as operation problem, utilities expense, the type of mining machine etc.
        </div>

        <div className={styles.title}>Mining binding protocol</div>
        <div className={styles.borderBlock}>
          The Merlin Protocol empowers the NFT by decentralizing the mining operations while also binding mining income to each tokenid. The Merlin Protocol
          will then settle Bitcoin mining income to the wallet address of each NFT holder. A unique property of the Merlin Protocol is that it enables the hash
          NFT to bind to other NFT projects, and adding Bitcoin mining value to other NFT projects.
        </div>

        <div className={styles.title}>Multichain Supporting</div>
        <div className={classnames(styles.colorBlock, styles.colorBlock2)}>
          The Merlin Protocol was designed to effortlessly support multichain. The DApp applications will first be deployed on the Ethereum network, with
          additional support for BSC, Avalanche, Solana, Mati – which will improve the liquidity of the Merlin NFT.
        </div>
      </div>
    </div>
  );
};
