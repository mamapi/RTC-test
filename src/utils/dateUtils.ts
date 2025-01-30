export const formatDate = (timestamp: number | string) => {
  return new Date(Number(timestamp)).toISOString();
};
