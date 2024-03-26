export interface IAccountReportData {
  date: Date;
  transactionDetail: string;
  debit: number | null;
  credit: number | null;
  balance: number;
}

export interface IOutStandingReportData {
  user: string;
  balance: number | null;
  phone: string | number | null;
}
