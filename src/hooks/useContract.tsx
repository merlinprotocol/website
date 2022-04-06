import React from 'react';
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';

// const network = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const network = process.env.NETWORK;

export const getProviderOrSigner = (
  library?: ethers.providers.JsonRpcProvider,
  account?: string | null,
): ethers.providers.Provider | ethers.Signer | undefined => {
  if (library && account) {
    return library.getSigner(account).connectUnchecked();
    // return library.getSigner(account);
  }

  return library || ethers.getDefaultProvider(network);
};

export const useContract = (address: string | undefined, abi: ethers.ContractInterface) => {
  const { chainId, library, account } = useEthers();

  const provider = getProviderOrSigner(library, account);

  return React.useMemo(() => {
    if (!address) return null;

    try {
      return new ethers.Contract(address, abi, provider);
    } catch (error) {
      console.log('err', error);
      return null;
    }
  }, [chainId, library, account]);
};

export const getContract = (address: string, abi: ethers.ContractInterface, library?: ethers.providers.JsonRpcProvider, account?: string | null) => {
  const provider = getProviderOrSigner(library, account);

  return new ethers.Contract(address, abi, provider);
};
