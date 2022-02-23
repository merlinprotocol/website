import { useEffect, useRef, ButtonHTMLAttributes } from 'react';
import { message } from 'antd';
import { useHistory } from 'umi';
import MetaMaskOnboarding from '@metamask/onboarding';
import classNames from 'classnames';
import styles from './index.less';

const BSC_CHAIN_ID_HEX = '0x38';
const BSC_RPC_URLS = [process.env.NETWORK, 'https://8.210.141.80/rpc'];
const BSC_CHAIN_NAME = 'Hashrate Testnet';
const BSC_NATIVE_CURRENCY_NAME = 'ETH';
const BSC_NATIVE_CURRENCY_SYMBOL = 'eth';
const BSC_NATIVE_CURRENCY_DECIMALS = 18;
const BSC_BLOCK_EXPLORER_URLS = [''];

export default (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const history = useHistory();
  const onboarding = useRef<MetaMaskOnboarding>();

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  /**
   * 没安装，先安装
   * 未配置，配置
   * */
  const addBscNetwork = async () => {
    try {
      window._hmt && _hmt.push(['_trackEvent', 'addBscNetwork', 'clicked']);

      if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
        onboarding.current = new MetaMaskOnboarding();
        onboarding && onboarding.current && onboarding.current.startOnboarding();

        window._hmt && _hmt.push(['_trackEvent', 'addBscNetwork', 'clicked', 'startOnboarding']);
      }

      const ret = await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: BSC_CHAIN_ID_HEX,
            chainName: BSC_CHAIN_NAME,
            nativeCurrency: {
              name: BSC_NATIVE_CURRENCY_NAME,
              symbol: BSC_NATIVE_CURRENCY_SYMBOL,
              decimals: BSC_NATIVE_CURRENCY_DECIMALS,
            },
            rpcUrls: BSC_RPC_URLS,
            blockExplorerUrls: BSC_BLOCK_EXPLORER_URLS,
          },
        ],
      });

      message.success('Test Network has already been added to Metamask!');
      window._hmt && _hmt.push(['_trackEvent', 'addBscNetwork', 'clicked', 'add BSC Network success']);
    } catch (error) {
      console.log('error', error);
      window._hmt && _hmt.push(['_trackEvent', 'addBscNetwork', 'clicked', 'add BSC Network error', String(error)]);
    }
  };

  return (
    <span className={classNames(styles.addBscNetwork, props.className)} onClick={() => history.push('/add-network')}>
      Add Test Network
    </span>
  );
};
