export const formatDate = (timestamp: number | string | null) => {
  if (isNaN(Number(timestamp))) return null;
  if (!timestamp) return null;

  try {
    const date = new Date(Number(timestamp));
    return date.toISOString();
  } catch (error) {
    return null;
  }
};
