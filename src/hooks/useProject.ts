import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
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

interface ProjectInfo {
  supply: BigNumber;
  price: BigNumber;
  sold: BigNumber;
  raiseDuration: BigNumber;
  firstFundRatio: BigNumber;
  internshipDuration: BigNumber;
  contractDuraction: BigNumber;

  startTime: moment.Moment;
  deliveryStart: moment.Moment;
  deliveryEnd: moment.Moment;
  raiseStart: moment.Moment;
  raiseEnd: moment.Moment;
  currentStage: Stage;
}

export default () => {
  const [project, setProject] = useState<ProjectInfo>();

  const hashrateContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);

  const init = async () => {
    if (!hashrateContract) return;

    try {
      const supply = await hashrateContract.getSupply();
      const price = await hashrateContract.getPrice();
      const sold = await hashrateContract.getSold();

      const startTime = await hashrateContract.startTime();
      const raiseDuration = await hashrateContract.raiseDuration();
      const internshipDuration = await hashrateContract.internshipDuration();
      const contractDuraction = await hashrateContract.contractDuraction();
      const firstFundRatio = await hashrateContract.firstFundRatio();
      const currentStage = await hashrateContract.currentStage();

      const deliveryStart = startTime.add(raiseDuration).toNumber();
      const deliveryEnd = startTime.add(contractDuraction).toNumber();

      const startTimeMoment = moment(startTime.mul('1000').toNumber());

      setProject({
        supply,
        price,
        sold,
        raiseDuration,
        internshipDuration,
        contractDuraction,
        firstFundRatio,
        currentStage,
        deliveryStart: moment(deliveryStart * 1000),
        deliveryEnd: moment(deliveryEnd * 1000),
        startTime: startTimeMoment,
        raiseStart: startTimeMoment,
        raiseEnd: startTimeMoment.clone().add(raiseDuration, 'seconds'),
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    init();
  }, [hashrateContract]);

  return project;
};
