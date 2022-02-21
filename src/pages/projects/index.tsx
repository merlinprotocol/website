import Banner from '@/components/Banner';
import styles from './index.less';

export const data = {
  name: 'Project Name',
  description: 'Project description ...',
  hashrate_volume: '1000000000000000',
  payment_type: 'Payment type',
  jf_start: '交付其实日期',
  jf_end: '交付其实日期',
  jg_type: '交割类型',
  jg_period: '交割周期',
};

console.log('process.env.NETWORK:', process.env.NETWORK);
console.log('process.env.SETTLE_TOKEN_CONTRACT_ADDRESS:', process.env.SETTLE_TOKEN_CONTRACT_ADDRESS);
console.log('process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS:', process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS);
console.log('process.env.WHITELIST_CONTRACT_ADDRESS:', process.env.WHITELIST_CONTRACT_ADDRESS);
console.log('process.env.HASHRATE_CONTRACT_ADDRESS:', process.env.NETWORK);
console.log('process.env.NFT_CONTRACT_ADDRESS:', process.env.NFT_CONTRACT_ADDRESS);

export default function IndexPage() {
  return (
    <div className={styles.normal}>
      <Banner></Banner>

      {/* <NavLink to="/project/0xxxx">
        <Card title={data.name} style={{ width: 520, marginTop: 48 }}>
          <p>描述: {data.description}</p>
          <p>算力总量: {data.hashrate_volume}</p>
          <p>支付类型: {data.payment_type}</p>
          <p>交付开始日期: {data.jf_start}</p>
          <p>交付结束日期: {data.jf_end}</p>
          <p>交割类型: {data.jg_type}</p>
          <p>交割周琦: {data.jg_period}</p>
        </Card>
      </NavLink> */}
    </div>
  );
}
