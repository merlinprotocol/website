import axios from './axios';

export const getWhiteList = async () => axios.get('/api/v1/whitelist');
