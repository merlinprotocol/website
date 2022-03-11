import { FC, useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, InputNumber, Button, message, Select, Spin } from 'antd';
import { useContract } from '@/hooks/useContract';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import useOwnerNFTs from '@/hooks/useOwnerNFTs';
import hashrateABI from '@/abis/project.json';
import useProject, { ProjectInfo } from '@/hooks/useProject';

import styles from './index.less';
const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;

const { TabPane } = Tabs;
const { Option } = Select;

function callback(key: any) {
  console.log(key);
}

const BuyPane: FC<{ project: ProjectInfo; bindToken?: boolean; onOk?: () => void }> = ({ project, bindToken, onOk }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { account } = useEthers();
  const { nfts, loading: loadingNFTs } = useOwnerNFTs(account);

  const hashrateContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);

  useEffect(() => {
    if (project?.price) {
      const volume = form.getFieldValue('volume');
      onVolumeChanged(volume);
    }
  }, [project?.price]);

  const onFinish = async ({ volume, amount, token }: any) => {
    console.log({ volume, amount, token });
    const [contract, tokenId] = token.split('_');

    try {
      if (!hashrateContract) return;

      setLoading(true);

      const tx = await hashrateContract.bind(contract, tokenId, volume);
      await tx.wait();
      console.log('tx:', tx);
      message.success('successed!');

      onOk && onOk();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      console.log('11');
      setLoading(false);
    }
  };

  const onVolumeChanged = (value: number) => {
    const price = project?.price;

    if (price) {
      const amount = price.mul(BigNumber.from(value));

      form.setFieldsValue({
        volume: value,
        amount: utils.formatEther(amount),
      });
    } else {
      form.setFieldsValue({
        volume: value,
      });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Form form={form} size="large" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} initialValues={{ remember: true }} onFinish={onFinish} autoComplete="off">
        <Form.Item label="Volume" name="volume">
          <InputNumber style={{ width: '100%' }} addonAfter="T" onChange={onVolumeChanged} />
        </Form.Item>

        <Form.Item label="Amount" name="amount">
          <Input addonAfter="USDT" readOnly />
        </Form.Item>

        {bindToken && (
          <Form.Item label="Token" name="token">
            <Select size="large" loading={loadingNFTs} notFoundContent={loadingNFTs ? <Spin size="small" /> : null}>
              {nfts.map((nft) => (
                <Option key={nft.image} value={`${nft.contract}_${nft.tokenId}`}>
                  <img src={nft.image} alt="" style={{ width: '25px', height: '25px' }} />
                  <span>{nft.name}</span>
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
          <Button type="primary" htmlType="submit" block size="large" style={{ marginTop: 24 }} loading={loading}>
            Buy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

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
      <Modal title={null} footer={null} visible={visible} onCancel={handleCancel} wrapClassName={styles.buyModal} closable={false} width={680}>
        <Tabs onChange={callback} type="card" centered>
          <TabPane tab="Bind" key="1">
            <BuyPane
              project={project}
              bindToken
              onOk={() => {
                onOk && onOk();
                setVisible(false);
              }}
            ></BuyPane>
          </TabPane>
          <TabPane tab="Buy" key="2">
            <BuyPane></BuyPane>
          </TabPane>
        </Tabs>
      </Modal>

      <div className={styles.wrapButton} onClick={onClickButton}>
        {children}
      </div>
    </div>
  );
};

export default BuyModal;
