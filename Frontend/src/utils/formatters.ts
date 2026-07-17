export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    Pending: 'text-yellow-400',
    Processing: 'text-blue-400',
    Shipped: 'text-accent',
    Delivered: 'text-success',
    Cancelled: 'text-error',
  };
  return colors[status] || 'text-text-secondary';
};

export const truncate = (str: string, len: number): string => {
  if (str.length <= len) return str;
  return str.slice(0, len) + '...';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getImageUrl = (url: string): string => {
  if (!url) return '/placeholder.svg';
  if (url.startsWith('http')) return url;
  return url;
};
