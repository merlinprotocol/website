import axios from './axios';

// export const getWhiteList = async () => axios.get('/api/v1/whitelist');

export const getDailyMined = async (start: number, end: number) =>
  axios(`/api/merlin/miner_daily_hashrate/list?params%5BbeginTime%5D=${start}&params%5BendTime%5D=${end}`);
