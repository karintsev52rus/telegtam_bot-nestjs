export const hasPassedTwoDays = (date: number) => {
  return Date.now() - 48 * 60 * 60 * 1000 > date * 1000;
};
