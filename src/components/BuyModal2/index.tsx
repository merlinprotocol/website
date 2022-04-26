import { FC, useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import close from '@/assets/icon-close.png';
import people from '@/assets/people.png';
import { useEthers } from '@usedapp/core';
import { shortAddress } from '@/utils';
import useOwnerNFTs from '@/hooks/useOwnerNFTs';
import config from '@/config';

import classnames from 'classnames';
import styles from './index.less';

const networks: any = config.networks;
const BUY = 'Buy';
const BIND = 'Bind';

const BuyModal: FC<{ projectInfo: { network: string; projectAddr: string }; project: any; wrapBtnClassName?: string }> = ({
  projectInfo,
  project,
  children,
  wrapBtnClassName,
}) => {
  const { account } = useEthers();
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState(BUY);
  const [congration, setCongration] = useState(false);

  const [volumn, setVolumn] = useState<string>(''); // 购买数量
  const [amount, setAmount] = useState<string>(''); // 购买总额(USDT)
  const [hash, setHash] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<any>(null); // bind时选择的NFT

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

    if (!project) {
      message.error('Error');
    }

    try {
      setLoading(true);

      const SDK = require('@/sdk');
      const { network, projectAddr } = projectInfo;
      const { provider, wbtc, usdt, vending } = networks[network] || {};
      const sdk = new SDK(provider, projectAddr, wbtc, usdt, vending);

      let tx = null;
      if (tab === BUY) {
        tx = await sdk.buy(volumn, account);
      } else if (tab === BIND) {
        // if (!selectedNFT) {
        //   message.error('NFT not select!');
        //   return;
        // }
        // const [contract, tokenId] = selectedNFT.split('_');
        // await vendingContract?.bind(HASHRATE_CONTRACT_ADDRESS, contract, tokenId, volumn);
      }

      setHash(tx.transactionHash);
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
