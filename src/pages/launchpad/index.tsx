import Header from '@/layouts/header';
import Footer from '@/layouts/footer';
import Banner from './Banner';
import List from './List';
import useProject, { ProjectInfo } from '@/hooks/useProject';

import styles from './index.less';

export default () => {
  const { project } = useProject();

  console.log('start', project?.raiseStart.format('YYYY-MM-DD HH:mm:ss'));
  console.log('end', project?.raiseEnd.format('YYYY-MM-DD HH:mm:ss'));

  return (
    <div className={styles.launchpadList}>
      <Header></Header>
      <Banner project={project}></Banner>
      <List></List>
      <Footer></Footer>
    </div>
  );
};
