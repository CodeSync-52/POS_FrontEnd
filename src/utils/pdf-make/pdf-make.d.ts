export type ITableItems =
  | string
  | {
      text: string;
      [key: string]: any;
    }
  | { image: string; [key: string]: any };

export interface IPdfHeaders {
  heading?: string;
  content: string | number | null | undefined;
  styleContent?: boolean;
}

export interface IPdfFooters {
  heading?: string;
  content: string | number | null | undefined;
  styleContent?: boolean;
}
export interface IPdfPayload {
  pdfHeaders?: IPdfHeaders[];
  pdfFooters?: IPdfFooters[];
  tableData?: ITableItems[][];
  tableData2?: ITableItems[][];
  tableData3?: ITableItems[][];
  filename?: string;
  title?: string;
}

export const downloadPdf: (payload: IPdfPayload) => Promise<void>;
