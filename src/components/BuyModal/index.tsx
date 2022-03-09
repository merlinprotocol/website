import { FC, useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, Button, message } from 'antd';
import { useContract } from '@/hooks/useContract';
import NFTABI from '@/abis/NFT.json';
import { useEthers } from '@usedapp/core';

import styles from './index.less';

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS as string;

const { TabPane } = Tabs;

function callback(key: any) {
  console.log(key);
}

const BuyPane: FC = () => {
  const [loading, setLoading] = useState(false);
  const { account } = useEthers();

  const nftContract = useContract(NFT_CONTRACT_ADDRESS, NFTABI);

  const onFinish = async ({ volume, amount }: any) => {
    console.log({ volume, amount });

    try {
      if (!nftContract) return;

      setLoading(true);

      const ret = await nftContract.mint(account);
      await ret.wait();
      console.log('ret:', ret);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      console.log('11');
      setLoading(false);
    }
  };

  const onFinishFailed = () => {};

  return (
    <div style={{ padding: 24 }}>
      <Form
        size="large"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="Volume" name="volume">
          <Input />
        </Form.Item>

        <Form.Item label="Amount" name="amount">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
          <Button type="primary" htmlType="submit" block size="large" style={{ marginTop: 24 }} loading={loading}>
            Buy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const BuyModal: FC = ({ children }) => {
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
          <TabPane tab="Buy" key="1">
            <BuyPane></BuyPane>
          </TabPane>
          <TabPane tab="Bind" key="2">
            Content of Tab Pane 2
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
