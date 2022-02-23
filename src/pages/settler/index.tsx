import { useState, useEffect } from 'react';
import { Card, Steps, Button, InputNumber, message } from 'antd';
import { useEthers } from '@usedapp/core';
import { ethers, utils, ContractFactory } from 'ethers';
import erc20ABI from '@/abis/erc20.json';
import hashrateABI from '@/abis/project.json';
import { useContract } from '@/hooks/useContract';
import PaymentSplitter from '@/contracts/paymentSplitter.json';

import styles from './index.less';

const SETTLE_TOKEN_CONTRACT_ADDRESS = process.env.SETTLE_TOKEN_CONTRACT_ADDRESS as string;
const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;

const { Step } = Steps;

export default () => {
  const [current, setCurrent] = useState(0);
  const [settleLoading, setSettleLoading] = useState(false);

  const { account, library } = useEthers();
  const [settleTokenBalance, setSettleTokenBalance] = useState<string>();
  const [settleTokenSymbol, setSettleTokenSymbol] = useState<string>();
  const [paymentAmount, setPaymentAmount] = useState<number>();

  const settleTokenContract = useContract(SETTLE_TOKEN_CONTRACT_ADDRESS, erc20ABI);
  const hashrateContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);

  useEffect(() => {
    if (!account || !settleTokenContract) return;

    (async () => {
      const balance = await settleTokenContract.balanceOf(account);
      const symbol = await settleTokenContract.symbol();
      setSettleTokenBalance(utils.formatUnits(balance, 8));
      setSettleTokenSymbol(symbol);
    })();
  }, [account, settleTokenContract]);

  const handleSettle = async () => {
    if (!account || !settleTokenContract || !hashrateContract) return;

    if (!paymentAmount) {
      return message.info('Input Payment Amount');
    }

    try {
      setSettleLoading(true);
      // step 1: deploy contract

      // const signer = library?.getSigner(account);
      // const contractFactory = ContractFactory.fromSolidity(PaymentSplitter, signer as ethers.Signer);
      // const splitterContract = await contractFactory.deploy();
      // console.log('splitterContract.address', splitterContract.address);
      // console.log('tx', splitterContract.deployTransaction);
      // //   await splitterContract.deployTransaction.wait()

      // // step 2: Transfer wBTC
      // setCurrent(1);
      // const transferAmount = utils.parseUnits(String(paymentAmount), 8);

      // const tx = await settleTokenContract.approve(account, transferAmount);
      // await tx.wait();

      // const transferTx = await settleTokenContract.transferFrom(account, splitterContract.address, transferAmount);
      // await transferTx.wait();

      // // step 3: settle
      // const settleTx = await hashrateContract.settle(splitterContract.address);
      // await settleTx.wait();

      // setCurrent(2);

      const settleTx = await hashrateContract.settle();
      await settleTx.wait();
      console.log('settleTx', settleTx);

      const splitterAddresses = await hashrateContract.getSettled();
      const lastSplitter = splitterAddresses[splitterAddresses.length - 1];

      console.log('splitterAddresses:', splitterAddresses);

      // // step 2: Transfer wBTC

      const transferAmount = utils.parseUnits(String(paymentAmount), 8);

      const tx = await settleTokenContract.approve(account, transferAmount);
      await tx.wait();

      const transferTx = await settleTokenContract.transferFrom(account, lastSplitter, transferAmount);
      await transferTx.wait();

      message.success('Success!');
    } catch (error) {
    } finally {
      setSettleLoading(false);
    }
  };

  return (
    <div style={{ width: 1200, margin: '0 auto' }}>
      <Card style={{ marginTop: 48 }} bordered={false}>
        <div className={styles.content}>
          <Steps size="small" current={current}>
            <Step title="Deploy Contract" />
            <Step title="Payment WBTC" />
            <Step title="Finished" />
          </Steps>
          <p>
            WBTC Balance:{settleTokenBalance} {settleTokenSymbol}
          </p>

          <span>
            Payment Amount:
            <InputNumber value={paymentAmount} addonAfter="wBTC" onChange={(val) => setPaymentAmount(val)} />
          </span>

          <Button onClick={handleSettle} block size="large" type="primary">
            Settle
          </Button>
        </div>
      </Card>
    </div>
  );
};
