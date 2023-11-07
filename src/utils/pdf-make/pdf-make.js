import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const downloadPdf = async ({
  tableHeaders = [],
  tableData = [],
  filename = 'data.pdf',
  title = '',
}) => {
  let content = [];
  let currentHeaders = [];
  tableHeaders.forEach((header, i) => {
    if (i % 2 === 0) {
      currentHeaders = {
        marginTop: 5,
        marginBottom: 5,
        columns: [
          {
            width: '*',
            alignemnt: 'right',
            stack: [
              {
                columns: [
                  {
                    text: header.heading + ': ',
                    bold: true,
                    width: 'auto',
                  },
                  {
                    text: header.content,
                    width: 'auto',
                    marginLeft: 3,
                  },
                ],
              },
            ],
          },
        ],
      };
      if (tableHeaders[i + 1] !== undefined) {
        const item = tableHeaders[i + 1];
        currentHeaders.columns.push({
          width: '*',
          alignment: 'right',
          stack: [
            {
              columns: [
                {
                  alignment: 'right',
                  text: item.heading + ': ',
                  bold: true,
                  width: '*',
                  marginRight: 3,
                },
                {
                  alignment: 'right',
                  text: item.content,
                  width: 'auto',
                },
              ],
            },
          ],
        });
      }
      content.push(currentHeaders);
      currentHeaders = {};
    }
  });

  // const docData = {
  //   content: [
  //     content,
  //     {
  //       marginTop: 10,
  //       layout: 'lightHorizontalLines',
  //       table: {
  //         headerRows: 1,
  //         widths: tableData[0].map(() => '*'),
  //         body: tableData,
  //       },
  //     },
  //   ],
  // };

  // replace this code if you want to print only headers and not table

  if (tableData && tableData.length > 0) {
    content.push({
      marginTop: 10,
      layout: 'lightHorizontalLines',
      table: {
        headerRows: 1,
        widths: tableData[0].map(() => '*'),
        body: tableData,
      },
    });
  }
  const docData = { content };
  if (title !== '') {
    docData.content.unshift({
      text: title,
      alignment: 'center',
      width: '*',
      bold: true,
      fontSize: 20,
    });
  }
  const doc = await pdfMake.createPdf(docData);
  await doc.download(filename);
};
