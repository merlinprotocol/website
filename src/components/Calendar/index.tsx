import React, { FC, useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { Popover, Button, message, Space, Select } from 'antd';
import { utils, BigNumber } from 'ethers';
import Web3 from 'web3';
import { useEthers } from '@usedapp/core';
import DeliverModal from '@/components/DeliverModal/index';

import classnames from 'classnames';
import styles from './index.less';

const SDK = require('@/sdk');
const { Option } = Select;

function parseMonthGroups(days: any[]) {
  const monthGroups: any[] = [];
  let currentIndex = -1;
  let currentMonth = -1;
  for (let i = 0, len = days.length; i < len; i++) {
    const day = days[i];
    let _month = moment(day.timestamp).get('month');

    if (_month !== currentMonth) {
      currentMonth = _month;
      currentIndex++;
    }

    if (!monthGroups[currentIndex]) {
      monthGroups[currentIndex] = [];
    }
    monthGroups[currentIndex].push(day);
  }

  return monthGroups;
}

function parseWeekGroups(monthGroups: any[]) {
  const weekGroups: any[] = [];
  let weekIndex = -1;
  let week = -1;
  for (let i = 0, lenI = monthGroups.length; i < lenI; i++) {
    const month = monthGroups[i];

    for (let j = 0, lenJ = month.length; j < lenJ; j++) {
      const _item = month[j];
      let _week = moment(_item.timestamp).get('week');
      if (_week !== week) {
        week = _week;
        weekIndex++;
      }
      if (!weekGroups[weekIndex]) {
        weekGroups[weekIndex] = [];
      }

      weekGroups[weekIndex].push(_item);
    }
  }

  return weekGroups;
}

export default () => {
  const [weekGroups, setWeekGroups] = useState<any[]>([]);
  const sdk = useRef<any>(null);
  const { account } = useEthers();

  const [days, setDays] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [currentMoment, setCurrentMoment] = useState(moment());

  console.log(days);

  // const [currentInfo, setCurrentInfo] = useState([]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    days.length && initYears(days);
  }, [days]);

  const init = async () => {
    sdk.current = new SDK(
      Web3.givenProvider,
      process.env.HASHRATE_CONTRACT_ADDRESS,
      process.env.SETTLE_TOKEN_CONTRACT_ADDRESS,
      process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS,
    );
    const _days = await sdk.current!.ProjectCalendarInfo();
    console.log('days:', _days);

    _days.forEach((day: any) => {
      day.timestamp = day.timestamp * 1000;
    });
    const monthGroups = parseMonthGroups(_days);
    const _weekGroups = parseWeekGroups(monthGroups);

    setWeekGroups(_weekGroups);
    setDays(_days);

    console.log(_days);

    // currentTime
    const time = await sdk.current.currentTime();

    setCurrentMoment(moment(time * 1000));

    // currentInfo
    // const _currentInfo = sdk.current.currentInfo
  };

  const initYears = async (days: any[]) => {
    const _years = days.map((day) => moment(day.timestamp).get('year'));
    const _values = [...new Set(_years)];
    setYears(_values);
  };

  const handleSettle = async (idx: number) => {
    try {
      const tx = await sdk.current.settle(idx, 0, account);
      console.log('tx:', tx);
      message.success('Successed!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeliver = async (idx: number) => {
    console.log('idx:', idx);
  };

  // 给定日期是否在选定月份前
  const isBeforeMonth = (timestamp: number) => {
    return moment(timestamp).isBefore(currentMoment, 'month') && !moment(timestamp).isAfter(currentMoment, 'year');
  };
  // 给定日期是否在选定月份后
  const isAfterMonth = (timestamp: number) => {
    return moment(timestamp).isAfter(currentMoment, 'month') && !moment(timestamp).isBefore(currentMoment, 'year');
  };

  const dateCellRender = (day: any, onSettle: (idx: number) => void, onDeliver: (idx: number) => void): React.ReactNode => {
    const content = (
      <div>
        <div>应交付:{day.wbtcMinted} WBTC</div>
        <div>已交付:{day.wbtcAmount ? utils.formatUnits(BigNumber.from(day.wbtcAmount), 8) : '-'} WBTC</div>
        <div>已交付:{day.usdtAmount ? utils.formatUnits(BigNumber.from(day.usdtAmount), 18) : '-'} USDT</div>
      </div>
    );
    return (
      <Popover content={content} key={day.timestamp}>
        <td title={moment(day.timestamp).format('YYYY-MM-DD')} key={day.timestamp} className={styles.pickerCell}>
          <div
            className={classnames(styles.pickerCellInner, {
              [styles.pickerCellInnerSettleDay]: day.isSettleDay,
              [styles.pickerCellInnerToday]: day.isCurrent,
            })}
          >
            <div>{moment(day.timestamp).format('DD')}</div>

            <div>
              {day.stage === 'Collection' ? (
                '募集期'
              ) : (
                <>
                  {day.deliverState === 0 && '未交付'}
                  {day.deliverState === 1 && '交付不足'}
                  {day.deliverState === 2 && '正常交付'}
                </>
              )}
            </div>

            <div>
              {day.isDeliverEnable && (
                <DeliverModal idx={day.index} handleDeliver={sdk.current.deliver.bind(sdk.current)}>
                  <Button type="link" onClick={() => onDeliver(day.index)} disabled={!account}>
                    交付
                  </Button>
                </DeliverModal>
              )}
            </div>
            <div>
              {day.isSettleDay && (
                <>
                  {day.isSettled ? (
                    <Button type="link" disabled>
                      已结算
                    </Button>
                  ) : (
                    <Button type="link" onClick={() => onSettle(day.index)} disabled={!account}>
                      结算
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </td>
      </Popover>
    );
  };

  // 首周或末周不满7天时，填充空白日期
  const extraDateCellRender = (week: any[]) => {
    const eles = [];
    for (let i = 0, len = 7 - week.length; i < len; i++) {
      eles.push(
        <td key={`extra-${i}`} className={styles.pickerCell}>
          <div className={styles.pickerCellInner}>
            <div></div>
            <div></div>
          </div>
        </td>,
      );
    }

    return eles;
  };

  const renderWeek = (week: any[]) => {
    // 完整的一周，直接渲染
    if (week.length === 7) {
      return (
        <tr key={`${week[0].timestamp}-${week[week.length - 1].timestamp}`}>{week.map((day: any) => dateCellRender(day, handleSettle, handleDeliver))}</tr>
      );
    }

    // 周的第一天应该是周日，否则说明前面有空白
    // 第一天是周日，向后插入日期； 否则，向前插入日期
    const day = moment(week[0].timestamp).get('day');
    return day === 0 ? (
      <tr key={`${week[0].timestamp}-${week[week.length - 1].timestamp}`}>
        {week.map((day: any) => dateCellRender(day, handleSettle, handleDeliver))}
        {extraDateCellRender(week)}
      </tr>
    ) : (
      <tr key={`${week[0].timestamp}-${week[week.length - 1].timestamp}`}>
        {extraDateCellRender(week)}
        {week.map((day: any) => dateCellRender(day, handleSettle, handleDeliver))}
      </tr>
    );
  };

  const onYearChanged = (value: number) => {
    const _moment = currentMoment.clone().set('year', value);
    setCurrentMoment(_moment);
  };

  const onMonthChanged = (value: number) => {
    const _moment = currentMoment.clone().set('month', value);
    setCurrentMoment(_moment);
  };

  return (
    <div className={styles.calendar}>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <Space>
          <span>{currentMoment.format('YYYY.MM.DD HH:mm')}</span>
          {years.length && (
            <Select value={currentMoment.get('year')} onChange={onYearChanged}>
              {years.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          )}

          <Select defaultValue={currentMoment.get('M')} onChange={onMonthChanged}>
            {new Array(12).fill(null).map((_, i) => (
              <Option key={i} value={i}>
                {i + 1}月
              </Option>
            ))}
          </Select>
        </Space>
      </div>

      <table className={styles.pickerContent}>
        <thead>
          <tr>
            <th>日</th>
            <th>一</th>
            <th>二</th>
            <th>三</th>
            <th>四</th>
            <th>五</th>
            <th>六</th>
          </tr>
        </thead>
        <tbody>
          {weekGroups.map((week, index) => {
            // 只渲染选中月份
            if (isBeforeMonth(week[week.length - 1].timestamp)) return null;
            if (isAfterMonth(week[0].timestamp)) return null;

            return renderWeek(week);
          })}
        </tbody>
      </table>
    </div>
  );
};
