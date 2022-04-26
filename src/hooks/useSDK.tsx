import { useRef, useState, useEffect } from 'react';
import Web3 from 'web3';
import config from '@/config';

const { networks }: any = config;

export const useSDK = (network: string, project: string) => {
  const sdk = useRef<any>(null);
  if (!network || !project) return sdk;

  const networkCfg = networks[network];
  if (!networkCfg) return sdk;

  const { provider, wbtc, usdt, vending } = networkCfg;

  console.log({ network, project, wbtc, usdt, provider });

  useEffect(() => {
    const SDK = require('@/sdk');
    sdk.current = new SDK(provider, project, wbtc, usdt, vending);
  }, []);

  return sdk;
};

export const useBasicInfo = (network: string, project: string) => {
  if (!network || !project) return null;

  const sdk = useSDK(network, project);

  const [basicInfo, setBasicInfo] = useState<any>({});

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (!sdk.current) return null;

    const basic = await sdk?.current.getBasicInfo();
    setBasicInfo(basic);
  };

  return basicInfo;
};

export const useMetadata = (network: string, project: string) => {
  if (!network || !project) return null;

  const sdk = useSDK(network, project);

  const [metadata, setMetadata] = useState<any>({});

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (!sdk.current) return null;

    const data = await sdk.current.getMetadata();
    setMetadata(data);
  };

  return metadata;
};
