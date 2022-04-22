import { useRef, useState, useEffect } from 'react';
import Web3 from 'web3';

export const useSDK = () => {
  const sdk = useRef<any>(null);

  useEffect(() => {
    const SDK = require('@/sdk');
    sdk.current = new SDK(
      Web3.givenProvider,
      process.env.HASHRATE_CONTRACT_ADDRESS,
      process.env.SETTLE_TOKEN_CONTRACT_ADDRESS,
      process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS,
    );
  }, []);

  return sdk;
};

export const useBasicInfo = () => {
  const sdk = useSDK();

  const [basicInfo, setBasicInfo] = useState<any>({});

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const basic = await sdk.current.getBasicInfo();
    setBasicInfo(basic);
  };

  return basicInfo;
};

export const useMetadata = () => {
  const sdk = useSDK();

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
