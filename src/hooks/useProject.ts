import { useState, useEffect } from 'react';
import { BigNumber, utils } from 'ethers';
import moment from 'moment';
import { useContract } from '@/hooks/useContract';
import hashrateABI from '@/abis/project.json';

const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;

enum Stage {
  None,
  Raise, // starttime + 1week, 过了这个时间才可以结算
  Internship, // starttime + 4week 观察期，之后可以拿首付款
  Delivery, // 可以拿首付款
  Final, // 52 之后结束
}

export interface ProjectInfo {
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
  currentStage: Stage;
  initialPayment: string; // usdt
  deliveryTimes: number;
  soldAmount: BigNumber | null; // wei
  depositAccountBalance: number; // usdt
}

export default () => {
  const [project, setProject] = useState<ProjectInfo>();

  const hashrateContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);

  useEffect(() => {
    init();
  }, [hashrateContract]);

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
    if (soldAmount) {
      const initialPayment = soldAmount.mul(initialPaymentRatio).div(BigNumber.from('10000'));

      return utils.formatEther(initialPayment);
    }

    return '';
  };

  const calcDeliveryTimes = (contractDuraction: BigNumber, collectionPeriodDuration: BigNumber) => {
    if (contractDuraction && collectionPeriodDuration) {
      const duration = contractDuraction?.sub(collectionPeriodDuration);

      const times = duration.toNumber() / 3600 / 7 / 24;

      return times;
    }

    return 0;
  };

  const calcDepositAccountBalance = (initialPayment: string, soldAmount: BigNumber | null) => {
    if (!soldAmount) return '';

    const balanceWei = soldAmount.sub(utils.parseEther(initialPayment));

    return utils.formatUnits(balanceWei);
  };

  const init = async () => {
    if (!hashrateContract) return;

    try {
      const supply = await hashrateContract.getSupply();
      const price = await hashrateContract.getPrice();
      const sold = await hashrateContract.getSold();

      const startTime = await hashrateContract.startTime();
      const collectionPeriodDuration = await hashrateContract.collectionPeriodDuration();
      const observationPeriodDuration = await hashrateContract.observationPeriodDuration();
      const contractDuraction = await hashrateContract.contractDuraction();
      const initialPaymentRatio = await hashrateContract.initialPaymentRatio();
      const currentStage = await hashrateContract.currentStage();

      const deliveryStart = startTime.add(collectionPeriodDuration).toNumber();
      const deliveryEnd = startTime.add(contractDuraction).toNumber();

      const startTimeMoment = moment(startTime.mul('1000').toNumber());

      const soldAmount = calcSoldAmount(currentStage, price, sold); // wei
      const initialPayment = calcInitialPayment(soldAmount, initialPaymentRatio); // usdt
      const deliveryTimes = calcDeliveryTimes(contractDuraction, collectionPeriodDuration);
      const depositAccountBalance = calcDepositAccountBalance(initialPayment, soldAmount);

      // console.log('project: ', {
      //   supply,
      //   price,
      //   sold,
      //   collectionPeriodDuration,
      //   observationPeriodDuration,
      //   contractDuraction,
      //   initialPaymentRatio,
      //   currentStage,
      //   deliveryStart: moment(deliveryStart * 1000),
      //   deliveryEnd: moment(deliveryEnd * 1000),
      //   startTime: startTimeMoment,
      //   raiseStart: startTimeMoment,
      //   raiseEnd: startTimeMoment.clone().add(collectionPeriodDuration, 'seconds'),
      // });
      setProject({
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
        startTime: startTimeMoment,
        raiseStart: startTimeMoment,
        raiseEnd: startTimeMoment.clone().add(collectionPeriodDuration, 'seconds'),
        initialPayment,
        deliveryTimes,
        soldAmount: utils.parseEther(soldAmount?.toString() || '0'),
        depositAccountBalance,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return { project, init };
};
