export interface ICashFlowRecords {
  sourceUserId: number;
  targetUserId: number;
  sourceUserName: string;
  targetUserName: string;
  sourceOutstandingBalance?: number;
  targetOutstandingBalance?: number;
  cashFlowId: number | null;
  cashFlowStatus: string;
  transactionDate: string;
  createdBy: null;
  amount: number;
  comments?: string;
  isRevertTransactionAllowed: boolean;
}
