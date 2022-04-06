import { useState, useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import { useContract } from '@/hooks/useContract';
import hashrateABI from '@/abis/project.json';
import erc20ABI from '@/abis/erc20.json';

const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;
const PAYMENT_TOKEN_CONTRACT_ADDRESS = process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS as string;

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
