import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { Form, Input, Button, InputNumber, Card, message } from 'antd';
import { utils, BigNumber } from 'ethers';
import { useEthers } from '@usedapp/core';
import NFTABI from '@/abis/NFT.json';
import hashrateABI from '@/abis/project.json';
import erc20ABI from '@/abis/erc20.json';
import { useContract } from '@/hooks/useContract';
import { data } from '../projects/index';

const nftContractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
const hashrateContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const erc20ContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default () => {
  const { address } = useParams<{ address: string }>();
  const nftContract = useContract(nftContractAddress, NFTABI);
  const hashrateContract = useContract(hashrateContractAddress, hashrateABI);
  const erc20Contract = useContract(erc20ContractAddress, erc20ABI);

  const { account } = useEthers();

  const [mintLoading, setMintLoading] = useState(false);
  const [bindLoading, setBindLoading] = useState(false);

  const [form] = Form.useForm<{ tokenId: number; contract: string; price: number; amount: number }>();
  const [showTokenId, setShowTokenId] = useState<number>();

  useEffect(() => {
    setup();
  }, [account, erc20Contract, hashrateContract]);

  const setup = async () => {
    if (!hashrateContract || !erc20Contract) return;

    loadAccountNFT(account);

    const hashratePrice = await hashrateContract.getPrice();
    const erc20Decimals = await erc20Contract.decimals();

    form.setFieldsValue({ contract: nftContractAddress, price: parseFloat(utils.formatUnits(hashratePrice.toString(), erc20Decimals)) });
  };

  const onFinish = async (values: any) => {
    if (!hashrateContract || !erc20Contract) return;

    try {
      setBindLoading(true);

      const tx = await erc20Contract.approve(hashrateContractAddress, values.amount * 1e8);
      await tx.wait();
      await hashrateContract.bind(values.contract, values.tokenId, values.volume);

      message.success('Success!');
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setBindLoading(false);
    }
  };

  const loadAccountNFT = async (_account?: string | null) => {
    if (!_account || !nftContract) return;

    try {
      const balance = await nftContract.balanceOf(_account);
      if (balance > 0) {
        const _tokenId = await nftContract.tokenOfOwnerByIndex(_account, balance - 1);
        console.log('_tokenId:', _tokenId.toNumber());

        form.setFieldsValue({ tokenId: _tokenId.toNumber() });
        setShowTokenId(_tokenId.toNumber());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMint = async () => {
    try {
      setMintLoading(true);
      if (!nftContract) return;

      const ret = await nftContract.mint(account, '_uri');
      await ret.wait();
      await loadAccountNFT(account);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setMintLoading(false);
    }
  };

  const changeAmount = (volume: number) => {
    const decimals = 1e8;
    const price = form.getFieldValue('price');

    const amount = BigNumber.from(volume * decimals).mul(BigNumber.from(price));
    form.setFieldsValue({
      amount: amount.toNumber() / decimals,
    });
  };

  console.log('token id: ', form.getFieldValue('tokenId'));

  return (
    <div>
      <h1>Address: {address}</h1>

      <Card>
        <p>描述: {data.description}</p>
        <p>算力总量: {data.hashrate_volume}</p>
        <p>支付类型: {data.payment_type}</p>
        <p>交付开始日期: {data.jf_start}</p>
        <p>交付结束日期: {data.jf_end}</p>
        <p>交割类型: {data.jg_type}</p>
        <p>交割周琦: {data.jg_period}</p>
      </Card>

      <Card title="Step 1: Mint NFT(DEV)" style={{ marginTop: 24 }}>
        <p>NFT Contract: {nftContractAddress}</p>
        <p>Token ID: {showTokenId}</p>
        <Button type="primary" size="large" onClick={handleMint} loading={mintLoading} block disabled={!account}>
          Mint
        </Button>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
          autoComplete="off"
          onValuesChange={(changedValues) => {
            console.log('onValuesChange:', changedValues);
            if (changedValues.volume) {
              changeAmount(changedValues.volume);
            }
            if (changedValues.tokenId || changedValues.tokenId === 0) {
              setShowTokenId(changedValues.tokenId);
            }
          }}
        >
          <Form.Item label="NFT Contract Address" name="contract">
            <Input />
          </Form.Item>

          <Form.Item label="NFT Token ID" name="tokenId">
            <Input />
          </Form.Item>

          <Form.Item label="Volume" name="volume">
            <InputNumber addonAfter="T" />
          </Form.Item>

          <Form.Item label="Hashrate Price" name="price">
            <InputNumber readOnly addonAfter="USDT/T" disabled />
          </Form.Item>

          <Form.Item label="Amount" name="amount">
            <InputNumber readOnly addonAfter="USDT" disabled />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
            <Button type="primary" htmlType="submit" size="large" block loading={bindLoading}>
              Bind
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
