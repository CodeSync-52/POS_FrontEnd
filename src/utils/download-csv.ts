export const downloadCsv = (
  csvData: Record<string, string | number>[],
  name?: string
) => {
  if (csvData.length < 1) {
    throw new Error("Please Don't send empty Object");
  }
  const rows: (string | number)[][] = [Object.keys(csvData[0])];
  csvData.forEach((item) => rows.push(Object.values(item)));
  const rowSeparated: string[] = rows.map((rowArr) => rowArr.join(','));
  const rowData = rowSeparated.join('\n');
  const encodedUri = encodeURI(rowData);
  const link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,' + encodedUri;
  link.target = '_blank';
  link.download = (name || 'Report') + '.csv';
  link.click();
  link.remove();
};
