export const cleanObject = (obj: any) => {
  if (typeof obj !== 'object') return obj;
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  );
};
