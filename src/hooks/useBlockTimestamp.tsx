import { useState, useEffect } from 'react';
import { useEthers } from '@usedapp/core';

export default () => {
  const { library } = useEthers();
  const [timestamp, setTimestamp] = useState(0);

  useEffect(() => {
    getCurrentBlockTime(library);
  }, [library]);

  const getCurrentBlockTime = async (library: any) => {
    try {
      const blockNumber = await library?.send('eth_blockNumber', []);
      const block = await library?.send('eth_getBlockByNumber', [blockNumber, false]);
      const time = parseInt(block.timestamp);

      setTimestamp(time * 1000);
    } catch (error) {}
  };

  return timestamp;
};
