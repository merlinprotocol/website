import { BigNumber } from 'ethers';
import moment from 'moment';

enum Stage {
  None,
  Raise, // starttime + 1week, 过了这个时间才可以结算
  Internship, // starttime + 4week 观察期，之后可以拿首付款
  Delivery, // 可以拿首付款
  Final, // 52 之后结束
}

export interface ProjectInfo {
  issuer: string; // 创建者
  contract: string; // 合约地址

  supply: BigNumber; // 供应量
  price: BigNumber; // 单价
  sold: BigNumber; // 已售算力
  soldAmount: BigNumber; // 已售金额

  currentStage: Stage; // 当前阶段

  contractDuraction: BigNumber; // 合约周期
  collectionPeriodDuration: BigNumber; // 募集周期
  observationPeriodDuration: BigNumber; // 观察期周期

  initialPaymentRatio: BigNumber; // 首付款比例
  initialPayment: string; // 首付款
  depositAccountBalance: string; // 保证金余额

  startTime: moment.Moment; // 项目开始时间(募集开始时间)

  raiseStart: moment.Moment; // 募集开始时间
  raiseEnd: moment.Moment; // 募集结束时间

  deliveryStart: moment.Moment; // 交付开始时间
  deliveryEnd: moment.Moment; // 交付结束时间
  deliveryIndex: number; // 当前是第几期 - 用于delivery第1个参数
  deliveryAmounts: number[];

  settleStart: moment.Moment; // 结算开始时间
  settleEnd: moment.Moment; // 结算结束时间
  settleDay: number; // 周几(结算日) 0 ｜ 1 ｜ 2 ｜ 3 ｜ 4 ｜ 5 ｜ 6

  deliveryTimes: number; // 总共需要结算的次数

  settled: string[]; // 结算记录
  settledTimes: number; // 总的需要结算的次数
}

class Project {
  constructor(contract: string) {}

  /**
   * 获取合约信息
   */
  getProjectInfo(): ProjectInfo {}

  /**
   * 交付
   */
  handleDeliver() {}

  /**
   * 结算
   */
  handleSettle() {}
}
