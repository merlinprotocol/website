import { useParams } from 'umi';
import { RightOutlined } from '@ant-design/icons';
import useProject, { ProjectInfo } from '@/hooks/useProject';
import moment from 'moment';
import { utils, BigNumber } from 'ethers';
import classnames from 'classnames';
import styles from './Info.less';
import useMetadata from '@/hooks/useMetadata';

export default () => {
  const { contract }: any = useParams();
  const { project } = useProject();
  const metadata = useMetadata(project?.contract);

  console.log('project:', project);

  return (
    <div className={styles.info}>
      {/* top */}
      <div className={styles.top}>
        <div className={styles.left}>
          <span className={styles.wrapImg}>
            <img src={metadata?.logo} alt="" />
          </span>
          <span className={styles.wrapText}>
            <span>{metadata?.name}</span>
            {/* <span>ETH Pool Ends In(ended)</span> */}
          </span>
        </div>

        {/* <div className={styles.right}>
          <RightOutlined />
          More
        </div> */}
      </div>

      {/* Message && Buy */}
      <div className={styles.messageAndBuy}>
        <span className={styles.text}>
          {metadata?.description}:{contract}
        </span>
        <span className={styles.buyBtn}>购买</span>
      </div>

      {/* Supply && Time */}
      <div className={styles.supplyAndTime}>
        <span className={styles.totalSupply}>
          <span className={styles.label}>Total hashpower supply</span>
          <span className={styles.value}>{project?.supply?.toNumber()}TH/s</span>
        </span>

        <span className={styles.deliveryTimes}>
          <span className={styles.label}>Delivery times</span>
          <span className={styles.value}>{project?.deliveryTimes}Times</span>
        </span>

        <span className={styles.deliveryTime}>
          <span className={styles.label}>Delivery time</span>
          <span className={styles.value}>
            {project?.deliveryStart.format('YYYY/MM/DD')}-{project?.deliveryEnd.format('YYYY/MM/DD')}
          </span>
        </span>
      </div>

      {/* Some Amount */}
      <div className={styles.someAmount}>
        <span className={styles.item} style={{ marginRight: '170px' }}>
          <span className={styles.label}>Initial payment</span>
          <span className={styles.value}>{project?.initialPayment || '-'} USDT</span>
        </span>
        <span className={styles.item} style={{ marginRight: '150px' }}>
          <span className={styles.label}>Option Account balance</span>
          <span className={styles.value}>unknow USDT</span>
        </span>
        <span className={styles.item}>
          <span className={styles.label}>Deposit account balance</span>
          <span className={styles.value}>{project?.depositAccountBalance || '-'} USDT</span>
        </span>
      </div>

      {/* Stage bar */}
      <div className={styles.stageBar}>
        <span className={classnames(styles.item, styles.collection)}>
          <span className={styles.text}>Collection period</span>
        </span>
        <span className={classnames(styles.item, styles.overation)}>
          <span className={styles.text}>Overvation period</span>
        </span>
        <span className={classnames(styles.item, styles.operating)}>
          <span className={styles.text}>Operating period</span>
        </span>
      </div>
    </div>
  );
};
