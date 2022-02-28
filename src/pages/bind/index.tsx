import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { Form, Input, Button, InputNumber, Card, message } from 'antd';
import { utils, BigNumber } from 'ethers';
import { useEthers } from '@usedapp/core';
import NFTABI from '@/abis/NFT.json';
import hashrateABI from '@/abis/project.json';
import erc20ABI from '@/abis/erc20.json';
import whitelistABI from '@/abis/whitelist.json';
import { useContract } from '@/hooks/useContract';

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS as string;
const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;
const PAYMENT_TOKEN_CONTRACT_ADDRESS = process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS as string;
const WHITELIST_CONTRACT_ADDRESS = process.env.WHITELIST_CONTRACT_ADDRESS as string;

export default () => {
  const { address } = useParams<{ address: string }>();
  const nftContract = useContract(NFT_CONTRACT_ADDRESS, NFTABI);
  const hashrateContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);
  const paymentTokenContract = useContract(PAYMENT_TOKEN_CONTRACT_ADDRESS, erc20ABI);
  const whitelistContract = useContract(WHITELIST_CONTRACT_ADDRESS, whitelistABI);

  const { account } = useEthers();

  const [mintLoading, setMintLoading] = useState(false);
  const [bindLoading, setBindLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [form] = Form.useForm<{ tokenId: number; contract: string; price: number; amount: number }>();
  const [showTokenId, setShowTokenId] = useState<number>();
  const [inputContract, setInputContract] = useState(NFT_CONTRACT_ADDRESS);

  useEffect(() => {
    setup();
  }, [account, paymentTokenContract, hashrateContract]);

  const setup = async () => {
    if (!hashrateContract || !paymentTokenContract) return;

    loadAccountNFT(account);

    const hashratePrice = await hashrateContract.getPrice();
    console.log('hashratePrice', utils.formatEther(hashratePrice));

    const erc20Decimals = await paymentTokenContract.decimals();

    form.setFieldsValue({ contract: NFT_CONTRACT_ADDRESS, price: parseFloat(utils.formatUnits(hashratePrice.toString(), erc20Decimals)) });
  };

  const onFinish = async (values: any) => {
    if (!hashrateContract || !paymentTokenContract || !whitelistContract) return;

    try {
      // check whitelist
      const isWhitelist = await whitelistContract.verify(values.contract);
      if (!isWhitelist) {
        return message.error('Contract is not in whitelist');
      }

      setBindLoading(true);
      console.log('values.amount', values.amount);
      console.log('utils.parseEther(values.amount):', utils.parseEther(String(values.amount)));
      const tx = await paymentTokenContract.approve(HASHRATE_CONTRACT_ADDRESS, utils.parseEther(String(values.amount)));
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

      const ret = await nftContract.mint(account);
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

  const addWhiteList = async () => {
    if (!inputContract || !whitelistContract) return;

    try {
      setAddLoading(true);
      const tx = await whitelistContract.add(inputContract);
      await tx.wait();
      message.success('Success!');
    } catch (error: any) {
      console.error(error);
      message.error(error.message);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div style={{ width: 1200, margin: '48px auto' }}>
      <Card title="Step 1: Mint NFT(DEV)" bordered={false}>
        <p>NFT Contract: {NFT_CONTRACT_ADDRESS}</p>
        <p>Token ID: {showTokenId}</p>
        <Button type="primary" size="large" onClick={handleMint} loading={mintLoading} block disabled={!account}>
          Mint
        </Button>
      </Card>

      <Card title="Add to whitelist" style={{ marginTop: 48 }} bordered={false}>
        <p>
          Contract:
          <Input size="large" value={inputContract} onChange={(e) => setInputContract(e.target.value)} />
        </p>

        <Button type="primary" size="large" onClick={addWhiteList} loading={addLoading} block>
          Add
        </Button>
        <p>Whitelist contract owner is: account #0</p>
      </Card>

      <Card title={`Project: ${address}`} style={{ marginTop: 24 }} bordered={false}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
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
            <Input size="large" />
          </Form.Item>

          <Form.Item label="NFT Token ID" name="tokenId">
            <Input size="large" />
          </Form.Item>

          <Form.Item label="Volume" name="volume">
            <InputNumber size="large" addonAfter="T" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Hashrate Price" name="price">
            <InputNumber size="large" readOnly addonAfter="USDT/T" disabled style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Amount" name="amount">
            <InputNumber size="large" readOnly addonAfter="USDT" disabled style={{ width: '100%' }} />
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
