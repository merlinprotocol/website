import { FC, useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, InputNumber, Button, message, Select, Spin } from 'antd';
import { ProjectInfo } from '@/hooks/useProject';
import close from '@/assets/icon-close.png';
import people from '@/assets/people.png';
import { utils, BigNumber } from 'ethers';
import { useEthers } from '@usedapp/core';

import classnames from 'classnames';
import styles from './index.less';

const BuyModal: FC<{ idx: number; handleDeliver: (idx: number, amount: string, account: string) => void; onOk?: () => void }> = ({
  idx,
  children,
  handleDeliver,
}) => {
  const [visible, setVisible] = useState(false);
  const { account } = useEthers();
  const [amount, setAmount] = useState<string>('');

  const onClickButton = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const doDeliver = async () => {
    if (!account) return;

    await handleDeliver(idx, amount, account);

    setVisible(false);
  };

  return (
    <div>
      <Modal centered title={null} footer={null} visible={visible} onCancel={handleCancel} wrapClassName={styles.deliverModal} closable={false} width={800}>
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
