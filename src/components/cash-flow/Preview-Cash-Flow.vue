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
            label="Receiver Username"
            outlined
            maxlength="250"
            dense
            readonly
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="previewCashFlow.sourceOutstandingBalance"
            label="Receiver O/B"
            outlined
            maxlength="250"
            dense
            readonly
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="previewCashFlow.targetUserName"
            label="Sender Username"
            outlined
            maxlength="250"
            dense
            readonly
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="previewCashFlow.targetOutstandingBalance"
            label="Sender O/B"
            outlined
            maxlength="250"
            dense
            readonly
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            label="Status"
            v-model="previewCashFlow.cashFlowStatus"
            outlined
            maxlength="250"
            dense
            readonly
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            label="Amount"
            type="number"
            v-model="previewCashFlow.amount"
            outlined
            dense
            readonly
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
            readonly
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
            readonly
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions
      align="right"
      class="flex flex-col md:flex-row gap-2 md:gap-0 items-center"
    >
      <q-btn
        label="Sender Pdf"
        unelevated
        color="btn-primary"
        @click="downloadPdfData('sender')"
      />
      <q-btn
        label="Receiver Pdf"
        unelevated
        color="btn-primary"
        @click="downloadPdfData('receiver')"
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
import { ICashFlowRecords, IUserResponse } from '../../interfaces';
import moment from 'moment';
import {
  IPdfHeaders,
  ITableItems,
  downloadPdf,
} from 'src/utils/pdf-make/pdf-make';
import { GetUsers } from 'src/services';
import { CanceledError } from 'axios';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
interface IProps {
  selectedData: ICashFlowRecords | null;
}
const $q = useQuasar();
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
  sourceOutstandingBalance: 0,
  targetOutstandingBalance: 0,
  createdBy: null,
  amount: 0,
  comments: '',
});
const userList = ref<IUserResponse[]>([]);
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
  getUserList();
});
async function convertArrayToPdfData(array: ICashFlowRecords[]) {
  const tableStuff = [];
  const headerRow = [
    'Sender Username',
    'Receiver Name',
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
function downloadPdfData(pdfType: 'sender' | 'receiver') {
  const {
    amount,
    transactionDate,
    comments,
    targetUserName,
    sourceUserName,
    cashFlowStatus,
  } = previewCashFlow.value;
  let userOutstandingBalance = 0;
  if (pdfType === 'sender') {
    const selectedUserData = userList.value.find(
      (record) => record.userId === previewCashFlow.value.targetUserId
    );
    if (selectedUserData) {
      userOutstandingBalance = selectedUserData.outStandingBalance ?? 0;
    }
  } else {
    const selectedUserData = userList.value.find(
      (record) => record.userId === previewCashFlow.value.sourceUserId
    );
    if (selectedUserData) {
      userOutstandingBalance = selectedUserData.outStandingBalance ?? 0;
    }
  }
  const headers: IPdfHeaders[] = [
    {
      heading: 'Sender Username',
      content: targetUserName,
    },
    {
      heading: 'Receiver Username',
      content: sourceUserName,
    },
    {
      heading: `Amount ${pdfType === 'sender' ? 'Sent' : 'Received'}`,
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
      heading: 'Status',
      content: cashFlowStatus,
    },
  ];
  if (pdfType === 'sender') {
    headers.push({
      heading: 'Sender Outstanding Balance',
      content: userOutstandingBalance,
    });
  } else {
    headers.push({
      heading: 'Receiver Outstanding Balance',
      content: userOutstandingBalance,
    });
  }
  const fileTitle = 'CashFlow Report';
  const myFileName = 'CashFlow.pdf';
  downloadPdf({
    filename: myFileName,
    pdfHeaders: headers,
    tableData: [],
    title: fileTitle,
  });
}

const getUserList = async () => {
  try {
    const res = await GetUsers({
      pageNumber: 1,
      pageSize: 500,
    });
    if (res?.data) {
      userList.value = res.data.items;

      previewCashFlow.value.sourceOutstandingBalance = userList.value.find(
        (record) => record.userId === previewCashFlow.value.sourceUserId
      )?.outStandingBalance;

      previewCashFlow.value.targetOutstandingBalance = userList.value.find(
        (record) => record.userId === previewCashFlow.value.targetUserId
      )?.outStandingBalance;
    }
  } catch (e) {
    if (e instanceof CanceledError) return;
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
};
</script>
