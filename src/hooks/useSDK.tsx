import { useRef, useState, useEffect } from 'react';
import Web3 from 'web3';
import config from '@/config';

const { network }: any = config;

// const config: any = {
//   31337: {
//     provider: new Web3.providers.HttpProvider(process.env.NETWORK as string, {
//       headers: [
//         {
//           name: 'Access-Control-Allow-Origin',
//           value: '*',
//         },
//       ],
//     }),
//     wbtc: process.env.SETTLE_TOKEN_CONTRACT_ADDRESS,
//     usdt: process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS,
//   },
// };

export const useSDK = (chainId: string | number, project: string) => {
  const sdk = useRef<any>(null);
  if (!chainId || !project) return sdk;

  const { provider, wbtc, usdt, vending } = network[chainId];

  console.log({ chainId, project, wbtc, usdt, provider });

  useEffect(() => {
    const SDK = require('@/sdk');
    sdk.current = new SDK(provider, project, wbtc, usdt);
  }, []);

  return sdk;
};

export const useBasicInfo = (chainId: string | number, project: string) => {
  if (!chainId || !project) return null;

  const sdk = useSDK(chainId, project);

  const [basicInfo, setBasicInfo] = useState<any>({});

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const basic = await sdk?.current.getBasicInfo();
    setBasicInfo(basic);
  };

  return basicInfo;
};

export const useMetadata = (chainId: string | number, project: string) => {
  if (!chainId || !project) return null;

  const sdk = useSDK(chainId, project);

  const [metadata, setMetadata] = useState<any>({});

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const data = await sdk.current.getMetadata();
    setMetadata(data);
  };

  return metadata;
};
