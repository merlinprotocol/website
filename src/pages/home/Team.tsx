import team from '@/assets/team.png';
import ceo from '@/assets/ceo.png';
import ceoava from '@/assets/ceo-ava.png';
import cto from '@/assets/cto.png';
import ctoava from '@/assets/cto-ava.png';
import cmo from '@/assets/cmo.png';
import cmoava from '@/assets/cmo-ava.jpg';
import cof from '@/assets/cof.png';
import cfa2ava from '@/assets/cfa2-ava.png';
import eco from '@/assets/cfa.png';
import ecoava from '@/assets/cfa-ava.png';
import styles from './Team.less';

export default () => {
  return (
    <div className={styles.team}>
      <div className={styles.content}>
        <div className={styles.block}>
          <img src={ceo} className={styles.title} />
          <img src={ceoava} className={styles.avatar} />
          <span>
            who is an early participant and contributor to the Bitcoin community, code contributor to the open source project LibBitcoin. developer and
            technical expert with deep roots in the blockchain space and other IT technology sectors. Past experiences include: core developer of a pioneering
            public blockchain project in 2016; P2P network architect and key developer of a Top video streaming provider; Founder and key developer of a
            distributed computing and storage service provider; and contributor of series open-source projects on github.
          </span>
        </div>

        <div className={styles.block}>
          <img src={cto} className={styles.title} />
          <img src={ctoava} className={styles.avatar} />
          <span>
            Mr.Ma graduated from Academy of Space Technology, Tsinghua University, but has diversified research experiences in NLP Algorithm, Deep Learning,
            Simulations, Distributed System and Data Science. Mr.Ma is a senior architect in blockchain and distributed system with deep insight into the space,
            who has blockchain-related development experience of more than 5 years and contributed for several open-source projects as an independent developer.
          </span>
        </div>

        <div className={styles.block}>
          <img src={cmo} className={styles.title} />
          <img src={cmoava} className={styles.avatar} />
          <span>
            Alex Parker is a former investment banker and passionate blockchain investor with more than 8 years of financial services experience. He specialized
            in industrial and financial technology coverage. Alex has an MBA from the Wharton School of the University of Pennsylvania and a BS in Finance from
            the University at Buffalo (SUNY).
          </span>
        </div>

        <div className={styles.teamBlock}>
          <img src={team} alt="" />
        </div>

        <div className={styles.block}>
          <img src={cof} className={styles.title} />
          <img src={cfa2ava} className={styles.avatar} />
          <span>
            Northeastern University, majoring in finance and Infoamation System Management. Worked with the top 10 hedge fund in US, mainly engaged in equity
            research and quantitative strategy. Worked as the VP of investment banking in top teir bank in US. With years of consulting experience in fintech
            projects. Started to enter the blockchain industry in 2017, experienced onpublic block chain, Dapp, Defi, and NFT projects.
          </span>
        </div>

        <div className={styles.block}>
          <img src={eco} className={styles.title} />
          <img src={ecoava} className={styles.avatar} />
          <span>
            Rilke LI, CFA, BS in physics at PKU and MF candidate in finance at SJTU. Worked in China's top securities firms such as cicc and htsc, focused on
            product structuring. Mr.Li has invested in many early star blockchain projects and earned dozens of returns in blockchain investment.
          </span>
        </div>
      </div>
    </div>
  );
};
