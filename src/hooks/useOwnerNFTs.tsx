import { useState, useEffect } from 'react';
import useWhiteList from './useWhiteList';
import { getContract } from './useContract';
import erc721ABI from '@/abis/NFT.json';

export default (account: string | null | undefined) => {
  const [NFTs, setNFTs] = useState<any[]>([]);
  const whiteList = useWhiteList();

  useEffect(() => {
    if (!account) return;
    if (!whiteList || !whiteList.length) return;

    loadOwnerNFTs();
  }, [account, whiteList]);

  const loadOwnerNFTs = async () => {
    const tokens = [];

    for (let i = 0; i < whiteList.length; i++) {
      try {
        const erc721Contract = getContract(whiteList[i], erc721ABI);
        console.log('account', account);
        console.log('whiteList[i]', whiteList[i]);
        const balance = await erc721Contract.balanceOf(account);
        console.log('balance', balance);

        if (balance === 0) {
          continue;
        }

        for (let n = 0; n < balance; n++) {
          try {
            const tokenId = await erc721Contract.tokenOfOwnerByIndex(account, n);
            const tokenURI = await erc721Contract.tokenURI(tokenId);

            // MOCK
            const image = `https://gateway.pinata.cloud/ipfs/QmcMEyJQFJqc8dREyG1JH4gdn5utU6Ti8tfUoht3KtqBap/${tokenId}.png`;

            tokens.push({
              tokenId: tokenId.toNumber(),
              tokenURI,
              image,
              name: `Test Name #${tokenId}`,
            });
          } catch (error) {
            continue;
          }
        }
      } catch (error) {
        continue;
      }
    }

    setNFTs(tokens);
  };

  return NFTs;
};
