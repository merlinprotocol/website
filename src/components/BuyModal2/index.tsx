import { FC, useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, InputNumber, Button, message, Select, Spin } from 'antd';
import { ProjectInfo } from '@/hooks/useProject';
import close from '@/assets/icon-close.png';
import people from '@/assets/people.png';
import classnames from 'classnames';
import styles from './index.less';

const BUY = 'Buy';
const BIND = 'Bind';

const BuyModal: FC<{ project: ProjectInfo; onOk?: () => void }> = ({ project, children, onOk }) => {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState(BUY);
  const [congration, setCongration] = useState(false);

  const onClickButton = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = () => {
    setCongration(true);
  };

  return (
    <div>
      <Modal title={null} footer={null} visible={visible} onCancel={handleCancel} wrapClassName={styles.buyModal} closable={false} width={800}>
        <div className={styles.content}>
          <div
            className={classnames(styles.header, {
              [styles.congrationHeader]: congration,
            })}
          >
            {congration ? <span className={styles.headerText}>Congration</span> : <span>{tab} Hashrate</span>}

            <span className={styles.wrapCloseIcon} onClick={() => setVisible(false)}>
              <img src={close} alt="close" />
            </span>
          </div>

          {congration ? (
            <div className={styles.congrationContainer}>
              <img src={people} className={styles.image} />

              <div className={styles.message}>
                <span>Hashrate: 88TH/s</span>
                <span>Hash: 0x123...1234</span>
              </div>
            </div>
          ) : (
            <div className={styles.container}>
              {/* Tabs */}
              <div className={styles.tabs}>
                <span
                  className={classnames(styles.tab, {
                    [styles.active]: tab === BUY,
                  })}
                  onClick={() => setTab(BUY)}
                >
                  Buy
                </span>
                <span
                  className={classnames(styles.tab, {
                    [styles.active]: tab === BIND,
                  })}
                  onClick={() => setTab(BIND)}
                >
                  Bind
                </span>
              </div>

              {/* Form */}
              <div className={styles.formContainer}>
                <div className={styles.formItem}>
                  <span className={styles.label}>数量:</span>
                  <input type="number" placeholder="volumn" className={styles.input} />
                </div>
                <div className={styles.formItem}>
                  <span className={styles.label}>总额:</span>
                  <input type="number" placeholder="amount" className={styles.input} />
                </div>
                {tab === BIND && (
                  <div className={styles.formItem}>
                    <span className={styles.label}>NFT:</span>
                    <input type="text" placeholder="NFT" className={styles.input} />
                  </div>
                )}

                <div className={styles.wrapButton}>
                  <a type="button" className={styles.button} onClick={handleSubmit}>
                    {tab}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <div style={{ cursor: 'pointer' }} onClick={onClickButton}>
        {children}
      </div>
    </div>
  );
};

export default BuyModal;
