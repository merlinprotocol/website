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

import classnames from 'classnames';
import styles from './index.less';

const BUY = 'Buy';
const BIND = 'Bind';

const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;
const VENDING_CONTRACT_ADDRESS = process.env.VENDING_CONTRACT_ADDRESS as string;
const PAYMENT_TOKEN_CONTRACT_ADDRESS = process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS as string;

const BuyModal: FC<{ project: any; wrapBtnClassName?: string }> = ({ project, children, wrapBtnClassName }) => {
  const { account } = useEthers();
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState(BUY);
  const [congration, setCongration] = useState(false);

  const [volumn, setVolumn] = useState<string>(''); // 购买数量
  const [amount, setAmount] = useState<string>(''); // 购买总额(USDT)
  const [hash, setHash] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<any>(null); // bind时选择的NFT

  const vendingContract = useContract(VENDING_CONTRACT_ADDRESS, vendingABI);
  const paymentTokenContract = useContract(PAYMENT_TOKEN_CONTRACT_ADDRESS, erc20ABI);

  const { nfts, loading: loadingNfts } = useOwnerNFTs(account);

  // console.log('nfts:', nfts);

  useEffect(() => {
    if (volumn && project?.price) {
      const _amount = project?.price * volumn;
      setAmount(_amount);
    }
  }, [volumn, project]);

  const onClickButton = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = async () => {
    if (!account) {
      message.error('Wallet disconnect');
      return;
    }

    if (!paymentTokenContract) {
      message.error('Contract is null');
    }

    if (!project) {
      message.error('Error');
    }

    try {
      setLoading(true);

      const _amount = utils.parseUnits(String(amount), project.usdtDecimals);
      await paymentTokenApprove(paymentTokenContract, VENDING_CONTRACT_ADDRESS, account, _amount.toString());

      let tx = null;
      if (tab === BUY) {
        tx = await vendingContract?.buy(HASHRATE_CONTRACT_ADDRESS, volumn);
      } else if (tab === BIND) {
        if (!selectedNFT) {
          message.error('NFT not select!');
          return;
        }
        const [contract, tokenId] = selectedNFT.split('_');
        tx = await vendingContract?.bind(HASHRATE_CONTRACT_ADDRESS, contract, tokenId, volumn);
      }

      await tx.wait();
      setHash(tx.hash);
      setCongration(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classnames('wrapBuyModal')}>
      <Modal
        title={null}
        footer={null}
        visible={visible}
        onCancel={handleCancel}
        wrapClassName={styles.buyModal}
        closable={false}
        width={800}
        afterClose={() => {
          setCongration(false);
          setVolumn('');
          setAmount('');
        }}
      >
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
                <span>Hashrate: {volumn} TH/s</span>
                <span>Hash: {shortAddress(hash)}</span>
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
                  <input type="number" placeholder="volumn" className={styles.input} value={volumn} onChange={(e) => setVolumn(e.target.value)} />
                </div>
                <div className={styles.formItem}>
                  <span className={styles.label}>总额:</span>
                  <input type="number" placeholder="amount" className={styles.input} value={amount} readOnly />
                </div>
                {tab === BIND && (
                  <div className={styles.formItem}>
                    <span className={styles.label}>NFT:</span>
                    {/* <input type="text" placeholder="NFT" className={styles.input} /> */}
                    <select
                      style={{ width: '100%' }}
                      onChange={(e) => {
                        setSelectedNFT(e.target.value);
                      }}
                    >
                      <option value="">--Please choose an NFT--</option>
                      {nfts.map((nft) => (
                        <option key={`${nft.contract}_${nft.tokenId}`} value={`${nft.contract}_${nft.tokenId}`}>
                          {nft.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className={styles.wrapButton}>
                  <a type="button" className={styles.button} onClick={handleSubmit}>
                    {loading ? 'Pending...' : tab}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <div style={{ cursor: 'pointer' }} onClick={onClickButton} className={wrapBtnClassName}>
        {children}
      </div>
    </div>
  );
};

export default BuyModal;
