import { useState, useEffect } from 'react';
import { Spin, message, Popover } from 'antd';
import { Link } from 'umi';
import moment from 'moment';
import useProject, { ProjectInfo } from '@/hooks/useProject';
import { utils } from 'ethers';
import NavMenus from './NavMenus';
import Footer from '@/layouts/footer';
import logo from '@/assets/logo.png';
import styles from './index.less';
import { useEthers } from '@usedapp/core';
import { shortAddress } from '@/utils';
import DeliverModal from '@/components/DeliverModal/index';
import { getDailyMined } from '@/servers/index';
import { handleSettle } from '@/actions/project';
import { useContract } from '@/hooks/useContract';
import hashrateABI from '@/abis/project.json';
import Calendar from '@/components/Calendar';

const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;

export default () => {
  const { project } = useProject();
  const { account, activateBrowserWallet } = useEthers();
  const projectContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);

  return (
    <div>
      <div className={styles.calendar}>
        <div className={styles.sidebar}>
          <Link className={styles.header} to="/">
            <img src={logo} />
            <span className={styles.text}>Merlin Protocol</span>
          </Link>

          <div className={styles.block}>
            <span className={styles.label}>Option account balance</span>
            <span className={styles.value}>-</span>
          </div>
          <div className={styles.block}>
            <span className={styles.label}>Deposit account balance</span>
            <span className={styles.value}>{project?.depositAccountBalance || '-'} USDT</span>
          </div>
          <div className={styles.block}>
            <span className={styles.label}>Initial Payment</span>
            <span className={styles.value}>{project?.initialPayment || '-'} USDT</span>
          </div>

          <div className={styles.processLabel}>
            交付进度: {project?.settled?.length}/{project?.settledTimes}
          </div>
          <a type="button" className={styles.button}>
            Initial Claim
          </a>
          <a type="button" className={styles.button}>
            Deposit Claim
          </a>

          <div className={styles.wrapFooter}>
            <Footer></Footer>
          </div>
        </div>

        <div className={styles.content}>
          <NavMenus></NavMenus>

          <div className={styles.extra}>
            <a type="button" className={styles.account}>
              {account ? <> Account: {shortAddress(account)}</> : <span onClick={activateBrowserWallet}>Connect</span>}
            </a>
            <a type="button" className={styles.project}>
              {project?.contract ? <>Project: {shortAddress(project.contract)}</> : <Spin></Spin>}
            </a>
          </div>

          <div className={styles.wrapCalendar}>
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
};
