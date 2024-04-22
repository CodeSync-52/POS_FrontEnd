import pdfMake from 'pdfmake/build/pdfmake';
import { pdfFont } from './pdf-Font';
pdfMake.vfs = pdfFont;

export const downloadPdf = async ({
  pdfHeaders = [],
  tableData = [],
  pdfFooters = [],
  filename = 'data.pdf',
  title = '',
}) => {
  let content = [];
  let currentHeaders = [];
  let currentFooters = [];
  pdfHeaders.forEach((header, i) => {
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
                    text: header.heading ? header.heading + ': ' : '',
                    bold: true,
                    width: 'auto',
                    fontSize: header?.styleContent ? 18 : 12,
                    bold: header?.styleContent ? true : false,
                  },
                  {
                    text: header.content,
                    width: 'auto',
                    marginLeft: 3,
                    fontSize: header?.styleContent ? 18 : 12,
                    bold: header?.styleContent ? true : false,
                  },
                ],
              },
            ],
          },
        ],
      };
      if (pdfHeaders[i + 1] !== undefined) {
        const item = pdfHeaders[i + 1];
        currentHeaders.columns.push({
          width: '*',
          alignment: 'right',
          stack: [
            {
              columns: [
                {
                  alignment: 'right',
                  text: item.heading ? item.heading + ': ' : '',
                  width: '*',
                  marginRight: 3,
                  fontSize: item?.styleContent ? 18 : 12,
                  bold: item?.styleContent ? true : false,
                },
                {
                  alignment: 'right',
                  text: item.content,
                  width: 'auto',
                  fontSize: item?.styleContent ? 18 : 12,
                  bold: item?.styleContent ? true : false,
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

  pdfFooters.forEach((footer, i) => {
    if (i % 2 === 0) {
      currentFooters = {
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
                    text: footer.heading ? footer.heading + ': ' : '',
                    bold: true,
                    width: 'auto',
                    fontSize: footer?.styleContent ? 18 : 12,
                    bold: footer?.styleContent ? true : false,
                  },
                  {
                    text: footer.content,
                    width: 'auto',
                    marginLeft: 3,
                    fontSize: footer?.styleContent ? 18 : 12,
                    bold: footer?.styleContent ? true : false,
                  },
                ],
              },
            ],
          },
        ],
      };
      if (pdfFooters[i + 1] !== undefined) {
        const item = pdfFooters[i + 1];
        currentFooters.columns.push({
          width: '*',
          alignment: 'right',
          stack: [
            {
              columns: [
                {
                  alignment: 'right',
                  text: item.heading ? item.heading + ': ' : '',
                  width: '*',
                  marginRight: 3,
                  fontSize: item?.styleContent ? 18 : 12,
                  bold: item?.styleContent ? true : false,
                },
                {
                  alignment: 'right',
                  text: item.content,
                  width: 'auto',
                  fontSize: item?.styleContent ? 18 : 12,
                  bold: item?.styleContent ? true : false,
                },
              ],
            },
          ],
        });
      }
      content.push(currentFooters);
      currentFooters = {};
    }
  });
  //const docData = { content };
  // if (title !== '') {
  //   docData.content.unshift({
  //     text: title,
  //     alignment: 'center',
  //     width: '*',
  //     bold: true,
  //     fontSize: 20,
  //   });
  // }

  // Adding footer with page numbers
  const docData = {
    content,
    footer(currentPage, pageCount) {
      return {
        text: currentPage.toString() + ' of ' + pageCount,
        alignment: 'center',
        fontSize: 10,
        margin: [5, 0, 10, 0],
        height: 30,
      };
    },
  };
  const doc = await pdfMake.createPdf(docData);
  await doc.download(filename);
};
