import classnames from 'classnames';
import styles from './History.less';

const Item = ({ data }: { data: any }) => {
  return (
    <div className={styles.Item}>
      <span>{data.no}</span>
      <span>{data.time}</span>
      <span>
        交付:
        <span
          className={classnames({
            [styles.nice]: data.settled > data.minSettle,
            [styles.ok]: data.settled === data.minSettle,
            [styles.warn]: data.settled < data.minSettle,
          })}
        >
          {data.settled}BTC
        </span>
        <span>/{data.minSettle}BTC</span>
      </span>
      <span>
        收益: {data.mintedBTC}BTC {data.mintedUSDT && '、' + data.mintedUSDT + 'USDT'}
      </span>
      <span
        className={classnames(styles.wrapBtn, {
          [styles.disabled]: data.claimed,
        })}
      >
        <span>Claim</span>
      </span>
    </div>
  );
};

const history = [
  {
    no: 4,
    time: '2022.03.13 00:00:00',
    settled: 5.6,
    minSettle: 5.6,
    mintedBTC: 0.8,
    claimed: false,
  },
  {
    no: 3,
    time: '2022.03.20 00:00:00',
    settled: 5.8,
    minSettle: 5.6,
    mintedBTC: 1,
    claimed: false,
  },
  {
    no: 2,
    time: '2022.03.27 00:00:00',
    settled: 5.4,
    minSettle: 5.6,
    mintedBTC: 0.8,
    mintedUSDT: 10,
    claimed: true,
  },
  {
    no: 1,
    time: '2022.04.03 00:00:00',
    settled: 5.6,
    minSettle: 5.6,
    mintedBTC: 0.6,
    claimed: true,
  },
];
export default () => {
  return (
    <div className={styles.history}>
      {history.map((item: any) => (
        <Item key={item.no} data={item}></Item>
      ))}
    </div>
  );
};
