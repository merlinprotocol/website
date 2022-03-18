import technical from '@/assets/technical.png';
import styles from './Technical.less';

export default () => {
  return (
    <div className={styles.technical}>
      <img src={technical} alt="Technical" className={styles.technicalTitle} />

      <div className={styles.content}>
        <div className={styles.title}>Standardization of computing power</div>
        <div className={styles.colorBlock}>
          The transaction on the chain is standardized computing power, each token represents the same share of computing power, no matter what kind of mining
          machine, electricity fee and management level, as long as the same computing power is provided, then it is the same token, which can be traded at an
          equivalent value . The contract will keep part of the token consideration, which will be paid in installments along with the performance of the
          computing power as a performance guarantee, which does not affect the payment of the entire consideration.
        </div>

        <div className={styles.title}>Mining binding protocol</div>
        <div className={styles.borderBlock}>
          Mining binding protocol provides decentralized financial value empowerment to NFT Project. The project can bind the mining revenue to any NFT in
          project wallets through purchasing the Bitcoin computing power NFT on Mercury Protocol. The protocol will settle Bitcoin mining revenue to the wallet
          address of each NFT holder to obtain additional support from the Mining earnings to increase the offering value of the NFT project.
        </div>

        <div className={styles.title}>Multichain Supporting</div>
        <div className={styles.colorBlock}>
          Mercury Protocol was designed for supporting multi-chain. The DApp applications will first be deployed on the Ethereum network, with supporting for
          BSC, Avalanche, Solana, Matic, Improving the liquidity of the hash pawer NFT by multi-chain and multi-market.
        </div>
      </div>
    </div>
  );
};
