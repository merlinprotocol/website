import classnames from 'classnames';
import styles from './footer.less';

export default () => {
  return (
    <div className={styles.footer}>
      <div className={classnames(styles.wrapImage, styles.telegram)}>{/* telegram */}</div>
      <div className={classnames(styles.wrapImage, styles.email)}></div>
      <div className={classnames(styles.wrapImage, styles.twitter)}></div>
      <div className={classnames(styles.wrapImage, styles.discord)}></div>
      <div className={classnames(styles.wrapImage, styles.github)}></div>
    </div>
  );
};
