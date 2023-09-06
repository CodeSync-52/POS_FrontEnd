export type ITableItems =
  | string
  | {
      text: string;
      [key: string]: any;
    }
  | { image: string; [key: string]: any };

export interface ITableHeaders {
  heading: string;
  content: string | number | null;
}
export interface IPdfPayload {
  tableHeaders?: ITableHeaders[];
  tableData?: ITableItems[][];
  filename?: string;
  title?: string;
}

export const downloadPdf: (payload: IPdfPayload) => Promise<void>;
