export const dateFormate = (date?: Date) => {
  const dateString = new Date(String(date));
  return dateString.toLocaleDateString("ko");
};
