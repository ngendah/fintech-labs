function sequenceGenerator(prefix: string, suffix?: string): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
  const no = `${prefix}-${year}${month}${day}-${randomString}`;
  if (suffix) {
    return `${no}-${suffix}`;
  }
  return no;
}

export const bookingNoGenerator = () => sequenceGenerator('BOK');
export const ticketNoGenerator = (seatNo: string) =>
  sequenceGenerator('TKT', seatNo);
export const invoiceNoGenerator = () => sequenceGenerator('INV');
export const receiptNoGenerator = () => sequenceGenerator('REC');
