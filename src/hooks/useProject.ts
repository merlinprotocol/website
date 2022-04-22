import { useState, useEffect } from 'react';
import { BigNumber, utils } from 'ethers';
import moment from 'moment';
import { useContract } from '@/hooks/useContract';
import hashrateABI from '@/abis/project.json';
import useBlockTimestamp from '@/hooks/useBlockTimestamp';
import _ from 'lodash';

const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;

enum Stage {
  None,
  Raise, // starttime + 1week, 过了这个时间才可以结算
  Internship, // starttime + 4week 观察期，之后可以拿首付款
  Delivery, // 可以拿首付款
  Final, // 52 之后结束
}

const DAY_SECONDS = 24 * 3600;
const WEEK_SECONDS = DAY_SECONDS * 7;

export interface ProjectInfo {
  issuer: string; // 创建者
  contract: string;
  supply: BigNumber;
  price: BigNumber;
  sold: BigNumber;
  collectionPeriodDuration: BigNumber;
  initialPaymentRatio: BigNumber;
  observationPeriodDuration: BigNumber;
  contractDuraction: BigNumber;

  startTime: moment.Moment;
  deliveryStart: moment.Moment;
  deliveryEnd: moment.Moment;
  raiseStart: moment.Moment;
  raiseEnd: moment.Moment;
  settleStart: moment.Moment;
  settleEnd: moment.Moment;
  currentStage: Stage;
  initialPayment: string; // usdt
  deliveryTimes: number;
  soldAmount: BigNumber | null; // wei
  depositAccountBalance: string; // usdt
  week: number; // 第几期 = (now - startTime)  /  1周的秒数
  settleDay: number; // 周几(结算日)
  currentTime: number; // 链上时间
  deliveryCount: number; // 第几个结算周期
  settled: string[]; // 结算记录
  settledTimes: number; // 总的需要结算的次数
  weekDayAmountsValues: string[];
}

export default () => {
  const [project, setProject] = useState<ProjectInfo>();
  const currentTime = useBlockTimestamp();

  const hashrateContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);

  useEffect(() => {
    init();
  }, [hashrateContract, currentTime]);

  // wei
  const calcSoldAmount = (currentStage: number, price: BigNumber, sold: BigNumber) => {
    if (currentStage && currentStage > 1) {
      if (sold && price) {
        const soldAmount = sold.mul(price);

        return soldAmount;
      }
    }

    return null;
  };

  // USDT
  const calcInitialPayment = (soldAmount: BigNumber | null, initialPaymentRatio: BigNumber) => {
    console.log({ soldAmount: soldAmount?.toNumber(), initialPaymentRatio: initialPaymentRatio.toNumber() });
    if (soldAmount) {
      const amount = soldAmount.div(BigNumber.from('1000000')).toNumber();
      const radio = initialPaymentRatio.toNumber() / 1e4;
      const initialPayment = amount * radio;

      return initialPayment;
    }

    return '';
  };

  // 结算次数
  const calcDeliveryTimes = (contractDuraction: BigNumber, collectionPeriodDuration: BigNumber) => {
    if (contractDuraction && collectionPeriodDuration) {
      const duration = contractDuraction?.sub(collectionPeriodDuration);

      const times = duration.toNumber() / 3600 / 7 / 24;

      return times + 1;
    }

    return 0;
  };

  const calcDepositAccountBalance = (initialPayment: string, soldAmount: BigNumber | null) => {
    if (!soldAmount) return '';

    const balanceWei = soldAmount.sub(utils.parseEther(initialPayment));

    return utils.formatUnits(balanceWei);
  };

  // 第几周 = (now - deliveryStart)  /  1周的秒数
  const calcWeek = (deliveryStart: number, currentTime: number) => {
    // const now = Date.now();

    const week = (currentTime - deliveryStart * 1000) / (WEEK_SECONDS * 1000) - 1;
    return Math.floor(week);
  };

  // 结算日合约实现 = (startTime + collectionPeriodDuration) + 1天的秒数 * 8（n+1） （n是第几周）
  const calcSettleDay = (startTime: moment.Moment, collectDuration: BigNumber, week: number) => {
    // const date = startTime.get('seconds') + DAY_SECONDS * 8 * (week + 1);
    const enCollectionMoment = startTime.add(collectDuration.toNumber(), 'seconds');
    const settleDay = enCollectionMoment.valueOf() + 8 * (week + 1) * 1000;
    const day = moment(settleDay).get('day');

    if (day === 7) return 0;
    return day;
  };

  // 当前是第几个结算周期：
  // Math.floor( (now-(startTime+collectDuration)) / (3600*24*7) )
  const calcDeliveryCount = (deliveryStart: number) => {
    const now = moment();
    const start = moment(deliveryStart * 1000);

    const count = (now.valueOf() - start.valueOf()) / 1000 / (3600 * 24 * 7);

    return Math.floor(count);
  };

  /**
   * 结算次数 = [contractDuration - (startTime + collectionDuration)] / WEEK_SECONDS
   */
  const calcSettledTimes = async (contractDuraction: BigNumber, collectDuration: BigNumber) => {
    const times = Math.ceil(contractDuraction.sub(collectDuration).toNumber() / WEEK_SECONDS);
    return times;
  };

  const init = async () => {
    if (!hashrateContract) return;

    try {
      const issuer = await hashrateContract.issuer();
      const supply = await hashrateContract.getSupply();
      const price = await hashrateContract.getPrice();
      const sold = await hashrateContract.getSold();

      const startTime = await hashrateContract.startTime();
      const collectionPeriodDuration: BigNumber = await hashrateContract.collectionPeriodDuration();
      const observationPeriodDuration = await hashrateContract.observationPeriodDuration();
      const contractDuraction = await hashrateContract.contractDuraction();
      const initialPaymentRatio = await hashrateContract.initialPaymentRatio();
      const currentStage = await hashrateContract.currentStage();

      const deliveryStart = startTime.add(collectionPeriodDuration).toNumber();
      const deliveryEnd = startTime.add(contractDuraction).toNumber();
      const settleStart = startTime.add(collectionPeriodDuration).add(WEEK_SECONDS).toNumber();
      const settleEnd = startTime.add(contractDuraction).add(DAY_SECONDS).toNumber();

      const startTimeMoment = moment(startTime.mul('1000').toNumber());

      const soldAmount = calcSoldAmount(currentStage, price, sold); // wei
      const initialPayment = calcInitialPayment(soldAmount, initialPaymentRatio); // usdt
      const deliveryTimes = calcDeliveryTimes(contractDuraction, collectionPeriodDuration);
      const depositAccountBalance = calcDepositAccountBalance(initialPayment, soldAmount);

      const week = calcWeek(deliveryStart, currentTime);
      const settleDay = calcSettleDay(startTimeMoment.clone(), collectionPeriodDuration, week);
      const deliveryCount = calcDeliveryCount(deliveryStart);

      const settled = currentStage > 1 ? await hashrateContract.getSettled() : [];
      const settledTimes = await calcSettledTimes(contractDuraction, collectionPeriodDuration);

      const weekDayAmounts = await hashrateContract.getWeekDayAmounts();
      const weekDayAmountsValues: string[] = _.flatten(weekDayAmounts).map((item: any) => utils.formatEther(item));

      const info: ProjectInfo = {
        issuer,
        contract: HASHRATE_CONTRACT_ADDRESS,
        supply,
        price,
        sold,
        collectionPeriodDuration,
        observationPeriodDuration,
        contractDuraction,
        initialPaymentRatio,
        currentStage,
        deliveryStart: moment(deliveryStart * 1000),
        deliveryEnd: moment(deliveryEnd * 1000),
        settleStart: moment(settleStart * 1000),
        settleEnd: moment(settleEnd * 1000),
        startTime: startTimeMoment,
        raiseStart: startTimeMoment,
        raiseEnd: startTimeMoment.clone().add(collectionPeriodDuration.toNumber() - 1, 'seconds'),
        initialPayment,
        deliveryTimes,
        soldAmount: utils.parseEther(soldAmount?.toString() || '0'),
        depositAccountBalance,
        week,
        settleDay,
        currentTime,
        deliveryCount,
        settled,
        settledTimes,
        weekDayAmountsValues,

        _price: price.toNumber(),
        _nodeTime: moment(currentTime).format('YYYY.MM.DD HH:mm:ss'),
        _startTime: startTimeMoment.format('YYYY.MM.DD HH:mm:ss'),
        _raiseStart: startTimeMoment.format('YYYY.MM.DD HH:mm:ss'),
        _raiseEnd: startTimeMoment
          .clone()
          .add(collectionPeriodDuration.toNumber() - 1, 'seconds')
          .format('YYYY.MM.DD HH:mm:ss'),
        _deliveryStart: moment(deliveryStart * 1000).format('YYYY.MM.DD HH:mm:ss'),
        _deliveryEnd: moment(deliveryEnd * 1000).format('YYYY.MM.DD HH:mm:ss'),
        _collectionPeriodDuration: collectionPeriodDuration.toNumber(),
        _settleStart: moment(settleStart * 1000).format('YYYY.MM.DD HH:mm:ss'),
      };
      setProject(info);

      console.log('project info: ', info);
    } catch (error) {
      console.error(error);
    }
  };

  return { project, init };
};
