import { useEffect, useState, useRef } from 'react';
import { useMouseWheel } from 'react-use';
import { NavLink } from 'umi';

import classnames from 'classnames';
import styles from './header.less';

export default () => {
  const mouseWheel = useMouseWheel();
  const [hidden, setHidden] = useState(false);

  const deltaY = useRef(0);
  const hiddenRef = useRef(false);
  const [ontop, setOntop] = useState(true);

  useEffect(() => {
    if (mouseWheel > deltaY.current) {
      if (!hidden) {
        setHidden(true);
      }
    } else {
      if (hidden) {
        setHidden(false);
      }
    }

    if (window.scrollY === 0) {
      !ontop && setOntop(true);
    } else {
      ontop && setOntop(false);
    }

    deltaY.current = mouseWheel;
  }, [mouseWheel]);

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  // const handleScroll = () => {
  //   console.log(hiddenRef.current);
  //   // 下拉隐藏
  //   if (window.scrollY > scrollY.current) {
  //     if (!hiddenRef.current) hiddenRef.current = true;
  //   } else {
  //     // 向上显示
  //     if (hiddenRef.current) hiddenRef.current = false;
  //   }

  //   scrollY.current = window.scrollY;
  // };

  return (
    <div
      className={classnames(styles.header, {
        [styles.hidden]: hidden,
        [styles.ontop]: ontop,
      })}
    >
      <NavLink to="/" className={styles.logoLink}>
        Merlin Protocol
      </NavLink>

      <div className={styles.menus}>
        {/* <NavLink to="/" className={classnames(styles.menu, styles.menuHome)} exact activeClassName={styles.active}>
          Home
        </NavLink>
        <NavLink to="/launchpad" className={classnames(styles.menu, styles.menuDapp)} exact activeClassName={styles.active}>
          DAPP
        </NavLink> */}
        <a href="https://eason-3.gitbook.io/mercury/protocol/merlin-overview" target="_blank" className={classnames(styles.menu, styles.menuDocs)}>
          DOCS
        </a>
      </div>

      {/* <div className={styles.account}>0x123...1234</div> */}
    </div>
  );
};
