import { useLocation } from 'umi';
import { useEffect } from 'react';
import config from '@/config';

const { networks }: any = config;

export default () => {
  const {
    query: { network },
  }: any = useLocation();

  useEffect(() => {
    handleCheck();
  }, [network]);

  // 切换网络后刷新页面
  useEffect(() => {
    try {
      ethereum.on('chainChanged', () => {
        location.reload();
      });
    } catch (error) {}
  }, []);

  const handleCheck = async () => {
    try {
      if (!ethereum) return;
      //   if (!network) return;

      const chainId = await ethereum.request({ method: 'eth_chainId' });
      const targetNetwork = networks[network] || networks['hardhat'];
      if (!chainId) return;
      if (!targetNetwork || !targetNetwork.chainId) return;

      // 当前网络和期望网路不通，要求切换
      if (chainId !== targetNetwork.chainId) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetNetwork.chainId }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              console.log('Chain has not been added');
              // await ethereum.request({
              //   method: 'wallet_addEthereumChain',
              //   params: [
              //     {
              //       chainId: '0xf00',
              //       chainName: '...',
              //       rpcUrls: ['https://...'] /* ... */,
              //     },
              //   ],
              // });
            } catch (addError) {
              // handle "add" error
            }
          }
          // handle other "switch" errors
        }
      }
    } catch (error) {
      return;
    }
  };
  return null;
};
