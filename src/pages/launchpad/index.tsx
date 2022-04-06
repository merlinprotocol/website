import Header from '@/layouts/header';
import Footer from '@/layouts/footer';
import Banner from './Banner';
import List from './List';
import useProject, { ProjectInfo } from '@/hooks/useProject';
import useMetadata from '@/hooks/useMetadata';

import styles from './index.less';

export default () => {
  const { project } = useProject();
  const metadata = useMetadata(project?.contract);

  console.log('metadata:', metadata);

  return (
    <div className={styles.launchpadList}>
      <Header></Header>
      <Banner project={project} metadata={metadata}></Banner>
      <List></List>
      <Footer></Footer>
    </div>
  );
};
