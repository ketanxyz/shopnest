import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../api/analytics';

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  });
};
