import API from './axios';
import type { Analytics } from '../types';

export const getAnalytics = async (): Promise<Analytics> => {
  const res = await API.get('/analytics');
  return res.data;
};
