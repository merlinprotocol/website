import classnames from 'classnames';
import styles from './footer.less';

export default () => {
  return (
    <div className={styles.footer}>
      {/* <a href="" target="_blank" className={classnames(styles.wrapImage, styles.telegram)}></a> */}
      <a href="mailto:business@merlinprotocol.org" target="_blank" className={classnames(styles.wrapImage, styles.email)}></a>
      <a href="https://twitter.com/ProtocolMerlin" target="_blank" className={classnames(styles.wrapImage, styles.twitter)}></a>
      <a href="https://discord.gg/VRSCTayjwR" target="_blank" className={classnames(styles.wrapImage, styles.discord)}></a>
      <a href="https://github.com/merlinprotocol" target="_blank" className={classnames(styles.wrapImage, styles.github)}></a>
    </div>
  );
};
