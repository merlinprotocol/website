import { useState, useEffect } from 'react';
import useWhiteList from './useWhiteList';
import { getContract } from './useContract';
import erc721ABI from '@/abis/NFT.json';

export default (account: string | null | undefined) => {
  const [NFTs, setNFTs] = useState<any[]>([]);
  const whiteList = useWhiteList();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) return;
    if (!whiteList || !whiteList.length) return;

    loadOwnerNFTs();
  }, [account, whiteList]);

  const loadOwnerNFTs = async () => {
    setLoading(true);

    const tokens = [];

    for (let i = 0; i < whiteList.length; i++) {
      try {
        const nftAddress = whiteList[i];
        const erc721Contract = getContract(nftAddress, erc721ABI);

        const balance = await erc721Contract.balanceOf(account);

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
              contract: whiteList[i],
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
        console.error(error);
        continue;
      }
    }

    setNFTs(tokens);

    setLoading(false);
  };

  return {
    nfts: NFTs,
    loading,
  };
};
