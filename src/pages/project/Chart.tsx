import { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import ReactECharts from 'echarts-for-react';
import { useBasicInfo } from '@/hooks/useSDK';
import styles from './Chart.less';

// ?params%5BbeginTime%5D=1649350415370&params%5BendTime%5D=1649868815370

const api = 'http://api.merlinprotocol.org/api/merlin/miner_daily_hashrate/list';

export default () => {
  const {
    query: { addr, network },
  }: any = useLocation();
  const basicInfo = useBasicInfo(network || 'hardhat', addr);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (basicInfo?.startTime) queryData();
  }, [basicInfo]);

  const queryData = async () => {
    try {
      const beginTime = basicInfo.startTime.valueOf();
      const endTime = beginTime + basicInfo.contractDuraction * 1000;

      const url = new URL(`${api}?params.beginTime=${beginTime}&params.endTime=${endTime}`);

      const response = await fetch(url.href);
      const res = await response.json();

      console.log('res', res);
      if (res.code === 200) {
        const _series = res.rows.map((row: any) => [row.timestamp, row.hashesDay]);

        setSeries(_series);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getOptions = () => {
    const option: any = {
      textStyle: {
        color: '#fff',
      },

      title: {
        text: '每日平均算力',
        textStyle: {
          color: '#fff',
        },
      },
      grid: {
        // show: true,
        left: 40,
        right: 0,
      },
      xAxis: {
        type: 'time',
        // data: [],
        axisLine: {
          show: true,
          lineStyle: {
            width: 3,
            color: '#fff',
          },
        },

        maxInterval: 3600 * 24 * 1000 * 7,
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            width: 3,
            color: '#fff',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      series: [
        {
          data: [],
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(199, 87, 147, 1)',
                },
                {
                  offset: 1,
                  color: 'rgba(199, 87, 147, .2)',
                },
              ],
              global: false, // 缺省为 false
            },
          },
          showSymbol: false,
          lineStyle: {
            color: '#C75793',
            width: 3,
          },
        },
      ],
    };

    if (!series.length) return option;

    option.series[0].data = series;

    return option;
  };
  return <div className={styles.content}>{!!series.length && <ReactECharts option={getOptions()} notMerge={true} lazyUpdate={true} />}</div>;
};
