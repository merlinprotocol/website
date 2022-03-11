import { useState, useEffect } from 'react';
import { useContract } from '@/hooks/useContract';
import hashrateABI from '@/abis/project.json';

const HASHRATE_CONTRACT_ADDRESS = process.env.HASHRATE_CONTRACT_ADDRESS as string;

function useProject() {
  const hashrateContract = useContract(HASHRATE_CONTRACT_ADDRESS, hashrateABI);

  const [project, setProject] = useState({});

  return project;
}
