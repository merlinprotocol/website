import { useState, useEffect } from 'react';
import { useParams } from 'umi';
import { Table, Tag, Space, Button, message } from 'antd';
import { utils, BigNumber } from 'ethers';
import { useEthers } from '@usedapp/core';
import hashrateABI from '@/abis/project.json';
import erc20ABI from '@/abis/erc20.json';
import PaymentSplitterABI from '@/abis/paymentSplitter.json';
import { SETTLE_TOKEN_CONTRACT_ADDRESS } from '@/variables';
import { useContract, getContract } from '@/hooks/useContract';

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

interface SettlerInfo {
  contract: string;
  tokenBalance: string;
  totalReleased: string;
  totalPaied: string;
  totalShares: number;
  shares: number;
  sold: number;
  released: string;
}

export default () => {
  const { library, account } = useEthers();

  const { project } = useParams<{ project: string }>();
  const hashrateContract = useContract(project, hashrateABI);
  const settleTokenContract = useContract(SETTLE_TOKEN_CONTRACT_ADDRESS, erc20ABI);

  const [hashrate, setHashrate] = useState<any>({
    supply: undefined,
    sold: undefined,
    settled: [],
  }); // 项目信息
  const [settlerInfos, setSettlerInfos] = useState<SettlerInfo[]>([]); // PaymentSplitter 获取的信息

  const columns = [
    {
      title: '交付',
      key: 'no',
      render: (text: string, record: SettlerInfo, index: number) => {
        return `第${index + 1}次`;
      },
    },
    {
      title: '交付日期',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '算力总量(TH/s)',
      dataIndex: 'sold',
      key: 'sold',
    },
    {
      title: '交付总量(wBTC)',
      dataIndex: 'totalPaied',
      key: 'totalPaied',
    },
    {
      title: '持有算力(TH/s)',
      key: 'sold',
      dataIndex: 'sold',
      render: (text: string, record: SettlerInfo) => {
        return (record.shares / record.totalShares) * record.sold;
      },
    },
    {
      title: '本期收益(wBTC)',
      key: 'shares',
      dataIndex: 'shares',
      render: (text: string, record: SettlerInfo) => {
        return (record.shares / record.totalShares) * parseFloat(record.totalPaied);
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: SettlerInfo) => {
        return record.released === '0' ? (
          <Button
            type="primary"
            onClick={async () => {
              const contract = getContract(record.contract, PaymentSplitterABI, library, account);
              const tx = await contract['release(address,address)'](SETTLE_TOKEN_CONTRACT_ADDRESS, account);
              message.success('Released!');
            }}
          >
            领取收益
          </Button>
        ) : (
          <span>已领取</span>
        );
      },
    },
  ];

  useEffect(() => {
    initHashrateData();
  }, [hashrateContract]);

  useEffect(() => {
    initSplitterData();
  }, [hashrate.settled]);

  //   useEffect(() => {
  //     initHistory();
  //   }, [settlerInfos]);

  const initHashrateData = async () => {
    if (!hashrateContract) return;

    try {
      const supply = await hashrateContract.getSupply();
      const sold = await hashrateContract.getSold();
      const settled = await hashrateContract.getSettled();
      console.log(settled);

      setHashrate({
        supply: supply.toNumber(),
        sold: sold.toNumber(),
        settled,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const initSplitterData = async () => {
    if (!hashrate.settled.length || !settleTokenContract || !account) return;

    const infos: SettlerInfo[] = [];
    for (let contract of hashrate.settled) {
      const tokenBalance = await settleTokenContract.balanceOf(contract);
      const splitterContract = getContract(contract, PaymentSplitterABI, library, account);
      const totalReleased = await splitterContract['totalReleased(address)'](SETTLE_TOKEN_CONTRACT_ADDRESS);
      const totalShares = await splitterContract.totalShares();
      const shares = await splitterContract.shares(account);
      const released = await splitterContract['released(address,address)'](SETTLE_TOKEN_CONTRACT_ADDRESS, account);

      console.log('released: ', released.toString());

      infos.push({
        contract,
        tokenBalance: tokenBalance,
        totalReleased: totalReleased,
        totalPaied: utils.formatUnits(BigNumber.from(tokenBalance).add(BigNumber.from(totalReleased)).toNumber(), 8),
        totalShares: totalShares.toNumber(),
        shares: shares.toNumber(),
        sold: hashrate.sold,
        released: released.toString(),
      });
    }

    setSettlerInfos(infos);
  };

  //   const initHistory = async () => {
  //     const list = [];
  //     for (const info of settlerInfos) {
  //       list.push({
  //         ...info,
  //       });
  //     }
  //   };

  return (
    <div style={{ width: 1200, margin: '48px auto' }}>
      <Table rowKey="contract" columns={columns} dataSource={settlerInfos} pagination={false} />
    </div>
  );
};
