<template>
  <q-card class="min-w-[310px] md:min-w-[400px]">
    <q-card-section>
      <div class="text-lg font-medium row justify-between mb-2">
        <span>Preview Cash Flow</span>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="previewCashFlow.sourceUserName"
            label="Source User Name"
            outlined
            maxlength="250"
            dense
            disable
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="previewCashFlow.targetUserName"
            label="Target User Name"
            outlined
            maxlength="250"
            dense
            disable
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            label="Cash Flow Status"
            v-model="previewCashFlow.cashFlowStatus"
            outlined
            maxlength="250"
            dense
            disable
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            label="Amount"
            type="number"
            v-model="previewCashFlow.amount"
            outlined
            dense
            disable
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="previewCashFlow.transactionDate"
            outlined
            type="date"
            label="Transaction Date"
            maxlength="250"
            dense
            disable
          />
        </div>
        <div class="col-12">
          <q-input
            label="Comments"
            type="textarea"
            autogrow
            v-model="previewCashFlow.comments"
            outlined
            maxlength="250"
            dense
            disable
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        label="download Pdf"
        unelevated
        color="btn-primary"
        @click="downloadPdfData"
      />
      <q-btn
        label="close"
        color=""
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
        unelevated
        v-close-popup
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { ICashFlowRecords } from '../../interfaces';
import moment from 'moment';
import {
  ITableHeaders,
  ITableItems,
  downloadPdf,
} from 'src/utils/pdf-make/pdf-make';
interface IProps {
  selectedData: ICashFlowRecords | null;
}
const props = withDefaults(defineProps<IProps>(), {
  selectedData: null,
});
const previewCashFlow = ref<ICashFlowRecords>({
  targetUserId: -1,
  sourceUserId: -1,
  sourceUserName: '',
  targetUserName: '',
  cashFlowStatus: '',
  transactionDate: '',
  createdBy: null,
  amount: 0,
  comments: '',
});
const tableItems = ref<ITableItems[][]>([]);
onMounted(() => {
  if (props.selectedData) {
    previewCashFlow.value = props.selectedData;
    previewCashFlow.value.transactionDate = moment(
      props.selectedData.transactionDate
    ).format('YYYY-MM-DD');
  }
  async () => {
    if (props.selectedData) {
      tableItems.value = await convertArrayToPdfData([props.selectedData]);
    }
  };
});
async function convertArrayToPdfData(array: ICashFlowRecords[]) {
  const tableStuff = [];
  const headerRow = [
    'Source Username',
    'Target Name',
    'Amount',
    'Transaction Date',
    'Comments',
  ];
  tableStuff.push(headerRow);
  array.forEach((item: ICashFlowRecords) => {
    const row = [
      item.sourceUserName,
      item.targetUserName,
      item.amount,
      item.transactionDate,
      item.comments,
    ];
    tableStuff.push(row);
  });
  return tableStuff;
}
function downloadPdfData() {
  const {
    amount,
    transactionDate,
    comments,
    targetUserName,
    sourceUserName,
    cashFlowStatus,
  } = previewCashFlow.value;
  const headers: ITableHeaders[] = [
    {
      heading: 'Source Username',
      content: sourceUserName,
    },
    {
      heading: 'target Username',
      content: targetUserName,
    },
    {
      heading: 'Amount',
      content: amount,
    },
    {
      heading: 'Transaction Date',
      content: moment(transactionDate).format('DD-MM-YYYY'),
    },
    {
      heading: 'Comments',
      content: comments || 'N/A',
    },
    {
      heading: 'CashFlow Status',
      content: cashFlowStatus,
    },
  ];
  const fileTitle = 'CashFlow Report';
  const myFileName = 'CashFlow.pdf';
  downloadPdf({
    filename: myFileName,
    tableHeaders: headers,
    tableData: [],
    title: fileTitle,
  });
}
</script>
