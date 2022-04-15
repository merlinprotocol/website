import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import { useContract } from '@/hooks/useContract';
import { ProjectInfo } from '@/hooks/useProject';
import hashrateABI from '@/abis/project.json';
import erc20ABI from '@/abis/erc20.json';
import { getContract } from '@/hooks/useContract';

const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;
const PAYMENT_TOKEN_CONTRACT_ADDRESS = process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS as string;

// 检查支付Token授权
async function checkPaymentTokenArropve(paymentTokenContract: any, vendingContractAddr: string, account: string): Promise<BigNumber> {
  return await paymentTokenContract?.allowance(account, vendingContractAddr);
}

export async function paymentTokenApprove(paymentTokenContract: any, vendingContractAddr: string, account: string, amount: string) {
  const allowance = await checkPaymentTokenArropve(paymentTokenContract, vendingContractAddr, account);

  if (allowance.lt(BigNumber.from(amount))) {
    const maxApproval = utils.parseUnits((2 ** 64 - 1).toString(), 'ether');
    const approveTx = await paymentTokenContract?.approve(vendingContractAddr, maxApproval);
    await approveTx.wait();
  }
}

// 交付授权
export async function deliverTokenApprove(deliverTokenContract: any, projectContractAddr: string, account: string, amount: string | number) {
  const allowance = await deliverTokenContract?.allowance(account, projectContractAddr);

  if (allowance.lt(BigNumber.from(amount))) {
    const maxApproval = utils.parseUnits((2 ** 64 - 1).toString(), 'ether');
    const approveTx = await deliverTokenContract?.approve(projectContractAddr, maxApproval);
    await approveTx.wait();
    return maxApproval;
  }

  return allowance;
}

// 交付
// 当前是第几期
// 交付日期不能早于raiseEnd
// 当期未做结算
export async function handleDeliver(
  projectContract: any,
  project: ProjectInfo | undefined,
  deliverTokenContract: any,
  account: string | null | undefined,
  date: moment.Moment,
  amount: number | string,
) {
  if (!projectContract || !project) return message.error('error');
  if (!account) return message.error('wallet error');

  const settled = projectContract.getSettled();
  const isSettled = settled[project?.deliveryCount];

  if (isSettled) {
    return message.error('Already settled');
  }

  if (!account) return message.error('Connect wallet');

  const approved = await deliverTokenApprove(deliverTokenContract, HASHRATE_CONTRACT_ADDRESS, account, amount);
  console.log('approved:', approved);

  const one_day = 3600 * 24;
  const one_week = one_day * 7;

  const ms = date.valueOf() - project.deliveryStart.valueOf();
  const seconds = Math.floor(ms / 1000);

  const day = Math.floor((seconds % one_week) / one_day);
  console.log('day:', day, 'amount:', amount); // 0

  const tx = await projectContract.deliver(day, utils.parseEther(String(amount)));
  console.log('tx:', tx);

  console.log(date.format('YYYY.MM.DD HH:mm:ss'));
  return tx;
}

// 结算
export async function handleSettle(projectContract: any, week: number) {
  const tx = await projectContract?.settle(week, 0);
  console.log(tx, week);
}
