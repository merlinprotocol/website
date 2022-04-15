import { FC, useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, InputNumber, Button, message, Select, Spin } from 'antd';
import { ProjectInfo } from '@/hooks/useProject';
import close from '@/assets/icon-close.png';
import people from '@/assets/people.png';
import { utils, BigNumber } from 'ethers';
import { useContract } from '@/hooks/useContract';
import vendingABI from '@/abis/vending.json';
import erc20ABI from '@/abis/erc20.json';
import { useEthers } from '@usedapp/core';
import { paymentTokenApprove } from '@/actions/project';
import { shortAddress } from '@/utils';
import useOwnerNFTs from '@/hooks/useOwnerNFTs';
import { handleDeliver } from '@/actions/project';
import hashrateABI from '@/abis/project.json';

import classnames from 'classnames';
import styles from './index.less';
import moment from 'moment';

const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;
const SETTLE_TOKEN_CONTRACT_ADDRESS = process.env.SETTLE_TOKEN_CONTRACT_ADDRESS as string;

const BuyModal: FC<{ project: ProjectInfo | undefined; date: moment.Moment; onOk?: () => void }> = ({ project, date, children, onOk }) => {
  const [visible, setVisible] = useState(false);
  const { account } = useEthers();
  const [amount, setAmount] = useState<number | string>('');

  const projectContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);
  const deliverTokenContract = useContract(SETTLE_TOKEN_CONTRACT_ADDRESS, erc20ABI);

  const onClickButton = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const doDeliver = async () => {
    const tx = await handleDeliver(projectContract, project, deliverTokenContract, account, date, amount);
    console.log('txx:', tx);

    setVisible(false);
  };

  return (
    <div>
      <Modal title={null} footer={null} visible={visible} onCancel={handleCancel} wrapClassName={styles.deliverModal} closable={false} width={800}>
        <div className={styles.content}>
          <div className={classnames(styles.header)}>
            <span className={styles.wrapCloseIcon} onClick={() => setVisible(false)}>
              <img src={close} alt="close" />
            </span>
          </div>

          <div className={styles.body}>
            <div>
              <span className="label">日期: </span>
              <span className="value">2022.03.02</span>
            </div>

            <div>
              <span>
                <span className="label">交付总额: </span>
                <span className="value">0.9WBTC</span>
              </span>
              <span style={{ marginLeft: '20px' }}>
                <span>已交:</span>
                <span>0.1WBTC</span>
              </span>
            </div>

            <div>钱包余额: 1.1WBTC</div>
          </div>

          <div className={styles.footer}>
            <div className={styles.wrapInput}>
              <input type="number" onChange={(e) => setAmount(e.target.value)} />
              <span className={styles.label}>WBTC</span>
            </div>
            <a type="button" className={styles.deliverBtn} onClick={doDeliver}>
              交付
            </a>
          </div>
        </div>
      </Modal>

      <div style={{ cursor: 'pointer' }} onClick={onClickButton}>
        {children}
      </div>
    </div>
  );
};

export default BuyModal;
