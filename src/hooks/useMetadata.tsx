import { useEffect, useState } from 'react';
import { useContract } from './useContract';
import ProjectABI from '@/abis/project.json';

// project metadata
export default (contract: string | undefined) => {
  const [metadata, setMetadata] = useState<any>(null);
  const projectContract = useContract(contract, ProjectABI);

  useEffect(() => {
    init();
  }, [projectContract]);

  const init = async () => {
    try {
      const tokenURI = await projectContract?.getURI();

      if (!tokenURI) return;

      const response = await fetch(tokenURI);
      const res = await response.json();

      setMetadata(res);
    } catch (error) {
      console.log('useMetadata err:', error);
    }
  };

  return metadata;
};
