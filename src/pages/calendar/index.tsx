import { useState, useEffect } from 'react';
import { Calendar, Spin, message, Popover } from 'antd';
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

const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;

export default () => {
  const { project } = useProject();
  const { account, activateBrowserWallet } = useEthers();
  const projectContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);

  const [dailyMined, setDailyMined] = useState<any[]>([]);

  useEffect(() => {
    if (!project) return;
    initDailyMined(project?.deliveryStart, project?.deliveryEnd);
  }, [project]);

  // 渲染结算按钮要满足：
  // 1. 是项目创建者账户
  // 2. 是结算日
  // 3. 当期未结算
  const isAllowSettled = (project: ProjectInfo, account: string | undefined | null, allowSettle: boolean) => {
    if (!project?.issuer || !account) return false;

    const isOwner = project?.issuer.toLocaleLowerCase() === account.toLocaleLowerCase();
    const weekSettled = project?.settled[project?.week];
    const ZERO = '0x0000000000000000000000000000000000000000';

    let settled: boolean | string = weekSettled;
    if (weekSettled === ZERO) {
      settled = false;
    }

    return isOwner && !settled && allowSettle;
  };

  function dateCellRender(date: moment.Moment) {
    if (!project) return null;

    const today = moment().set({
      hour: 0,
      minute: 0,
      second: 0,
    });

    const list = [];

    if (date.isAfter(project?.startTime?.clone().add(52, 'weeks'))) {
      return null;
    }

    const settleDay = project.settleDay;
    const allowSettle = date.get('day') === settleDay;

    if (date.isSame(project?.raiseStart, 'day')) {
      list.push(<li key="ksmj">开始募集</li>);
    } else if (date.isAfter(project?.startTime) && date.isBefore(project?.raiseEnd, 'day')) {
      list.push(<li key="mjz">募集中</li>);
    }

    if (date.isSame(project?.raiseEnd, 'day')) {
      list.push(<li key="mjjs">募集结束</li>);
    }

    if (today.isSame(date, 'day') && date.isAfter(project.deliveryStart)) {
      list.push(<li key="jryjf">今日应交付</li>);
    }

    if (allowSettle) {
      list.push(<li key="jsr">结算日</li>);
    }

    if (date.isAfter(project?.raiseEnd)) {
      list.push(<li key="djf">待交付</li>);
    }

    if (date.isSame(project?.startTime?.clone().add(52, 'weeks'), 'day')) {
      list.push(<li key="js">结束</li>);
    }

    // 已交付
    const weekDayAmountsValues = project?.weekDayAmountsValues;
    const time = date.valueOf() - project.deliveryStart.valueOf();
    const day = Math.floor(time / (3600 * 24 * 1000));

    // 距离计算日
    const currentDay = date.get('day');
    const DAY_MS = 3600 * 24 * 1000;
    let lastDay;
    if (date.isBefore(project.settleStart, 'date')) {
      lastDay = Math.ceil((project.settleStart.valueOf() - date.valueOf()) / DAY_MS);
    } else if (currentDay <= settleDay) {
      lastDay = settleDay - currentDay;
    } else {
      lastDay = 7 - (currentDay - settleDay);
    }

    // after deliver show popover
    if (date.isBefore(project.deliveryStart, 'day')) {
      return (
        <div>
          <DeliverModal project={project} date={date}>
            <ul style={{ marginBottom: '0', height: '100%' }}>{list.map((li) => li)}</ul>
          </DeliverModal>
        </div>
      );
    }

    const allowSettled = isAllowSettled(project, account, allowSettle);

    const doSettle = async () => {
      await handleSettle(projectContract, project.week);
    };

    return (
      <Popover
        content={
          <div>
            <p>应交付: 1 WBTC</p>
            <p>已交付: {weekDayAmountsValues[day]} WBTC</p>
            <p>距离结算日: {lastDay} 天</p>
            {allowSettled && (
              <a type="button" onClick={doSettle}>
                结算
              </a>
            )}
          </div>
        }
      >
        <div>
          <DeliverModal project={project} date={date}>
            <ul style={{ marginBottom: '0', height: '100%' }}>{list.map((li) => li)}</ul>
          </DeliverModal>
        </div>
      </Popover>
    );
  }

  const initDailyMined = async (start: moment.Moment, end: moment.Moment) => {
    try {
      const { code, rows }: any = await getDailyMined(start.valueOf(), end.valueOf());
      // const { code, rows }: any = await getDailyMined(1649350415370, 1649868815370);

      rows.forEach((row) => {
        console.log(moment(row.timestamp).format('YYYY.MM.DD HH:mm:ss'));
      });
    } catch (error) {}
  };

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
            {project && !!project.currentTime && (
              <Calendar
                key={account}
                // value={project?.currentTime ? moment(project?.currentTime) : moment()}
                // validRange={[project?.startTime, project?.startTime.clone().add(52, 'weeks')]}
                dateCellRender={dateCellRender}
                // disabledDate={(date: moment.Moment) => date.isBefore(project?.deliveryStart)}
                // onSelect={handleDeliver}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
