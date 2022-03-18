import telgram from '@/assets/telegram.png';
import github from '@/assets/github.png';
import twitter from '@/assets/twitter.png';
import discord from '@/assets/discord.png';
import styles from './footer.less';

export default () => {
  return (
    <div className={styles.footer}>
      <div className={styles.wrapImage}>
        <img src={telgram} />
      </div>
      <div className={styles.wrapImage}>
        <img src={twitter} />
      </div>
      <div className={styles.wrapImage}>
        <img src={discord} />
      </div>
      <div className={styles.wrapImage}>
        <img src={github} />
      </div>
    </div>
  );
};
