import { useState, useEffect } from 'react';
import { Calendar, Spin } from 'antd';
import moment from 'moment';
import useProject from '@/hooks/useProject';

const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;

export default () => {
  const project = useProject();

  useEffect(() => {
    if (!project) return;

    console.log(project.deliveryStart.format('YYYY.MM.DD HH:mm:ss'));
  }, [project]);

  function dateCellRender(date: moment.Moment) {
    const today = moment().set({
      hour: 0,
      minute: 0,
      second: 0,
    });

    if (date.isSame(project?.startTime, 'day')) {
      return '开始募集';
    }

    if (date.isSame(project?.raiseEnd, 'day')) {
      return '募集结束';
    }

    if (date.isAfter(project?.startTime) && date.isBefore(project?.raiseEnd)) {
      return '募集中';
    }

    if (date.isSame(project?.startTime.clone().add(52, 'weeks'), 'day')) {
      return '结束';
    }

    if (date.isAfter(project?.startTime.clone().add(52, 'weeks'))) {
      return null;
    }

    if (date.isAfter(project?.raiseEnd)) {
      return (
        <ul>
          <li>待交付</li>
          <li>预期交付: 100 wBTC</li>
        </ul>
      );
    }
  }

  const handleSelect = (date: moment.Moment) => {
    console.log(date.format('YYYY.MM.DD HH:mm:ss'));
  };

  return project ? (
    <Calendar
      validRange={[project?.startTime, project?.startTime.clone().add(52, 'weeks')]}
      dateCellRender={dateCellRender}
      disabledDate={(date: moment.Moment) => date.isBefore(project?.deliveryStart)}
      onSelect={handleSelect}
    />
  ) : (
    <Spin />
  );
};
