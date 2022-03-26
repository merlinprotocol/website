import { FC, useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, InputNumber, Button, message, Select, Spin } from 'antd';
import { ProjectInfo } from '@/hooks/useProject';
import close from '@/assets/icon-close.png';
import styles from './index.less';

const BuyModal: FC<{ project: ProjectInfo; onOk?: () => void }> = ({ project, children, onOk }) => {
  const [visible, setVisible] = useState(false);

  const onClickButton = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Modal title={null} footer={null} visible={visible} onCancel={handleCancel} wrapClassName={styles.buyModal} closable={false} width={800}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span>Buy Hashrate</span>
            <span className={styles.wrapCloseIcon} onClick={() => setVisible(false)}>
              <img src={close} alt="close" />
            </span>
          </div>

          <div className={styles.container}></div>
        </div>
      </Modal>

      <div style={{ cursor: 'pointer' }} onClick={onClickButton}>
        {children}
      </div>
    </div>
  );
};

export default BuyModal;
