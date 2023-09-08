export interface ICashFlowRecords {
  sourceUserId: number;
  targetUserId: number;
  sourceUserName: string;
  targetUserName: string;
  cashFlowStatus: string;
  transactionDate: string;
  createdBy: null;
  amount: number;
  comments?: string;
}
