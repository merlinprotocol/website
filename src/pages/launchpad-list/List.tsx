import itemLogo from '@/assets/item-logo.png';
import styles from './List.less';

const list = [
  {
    logo: itemLogo,
    title: 'BTC Mining Project 2022 ETHPool Ends In (ended)',
    desc: 'Native IDO tokens of the IDO Launchpad platform',
    price: '100 USDT',
    supply: '300,000 TH/s',
    period: '1 Week',
  },
  {
    logo: itemLogo,
    title: 'BTC Mining Project 2022 ETHPool Ends In (ended)',
    desc: 'Native IDO tokens of the IDO Launchpad platform',
    price: '100 USDT',
    supply: '300,000 TH/s',
    period: '1 Week',
  },
  {
    logo: itemLogo,
    title: 'BTC Mining Project 2022 ETHPool Ends In (ended)',
    desc: 'Native IDO tokens of the IDO Launchpad platform',
    price: '100 USDT',
    supply: '300,000 TH/s',
    period: '1 Week',
  },
  {
    logo: itemLogo,
    title: 'BTC Mining Project 2022 ETHPool Ends In (ended)',
    desc: 'Native IDO tokens of the IDO Launchpad platform',
    price: '100 USDT',
    supply: '300,000 TH/s',
    period: '1 Week',
  },
  {
    logo: itemLogo,
    title: 'BTC Mining Project 2022 ETHPool Ends In (ended)',
    desc: 'Native IDO tokens of the IDO Launchpad platform',
    price: '100 USDT',
    supply: '300,000 TH/s',
    period: '1 Week',
  },
  {
    logo: itemLogo,
    title: 'BTC Mining Project 2022 ETHPool Ends In (ended)',
    desc: 'Native IDO tokens of the IDO Launchpad platform',
    price: '100 USDT',
    supply: '300,000 TH/s',
    period: '1 Week',
  },
];

const Item = ({ data }: { data: any }) => {
  return (
    <div className={styles.item}>
      <div className={styles.top}>
        <img src={data.logo} />
        <span className={styles.title}>{data.title}</span>
      </div>

      <div className={styles.desc}>{data.desc}</div>

      <div className={styles.data}>
        <span className={styles.dataItem}>
          <span className={styles.label}>售价</span>
          <span className={styles.value}>{data.price}</span>
        </span>
        <span className={styles.dataItem}>
          <span className={styles.label}>算力总供应量</span>
          <span className={styles.value}>{data.supply}</span>
        </span>
        <span className={styles.dataItem}>
          <span className={styles.label}>挖矿周期</span>
          <span className={styles.value}>{data.period}</span>
        </span>
      </div>
    </div>
  );
};

export default () => {
  return (
    <div className={styles.list}>
      {list.map((data: any, index) => (
        <Item key={index} data={data}></Item>
      ))}
    </div>
  );
};
