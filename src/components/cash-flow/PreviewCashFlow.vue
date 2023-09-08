<template>
  <q-card class="">
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
            v-model="previewCashFlow.sourceUserName"
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
interface IProps {
  selectedData: ICashFlowRecords | null;
}
const props = withDefaults(defineProps<IProps>(), {
  selectedData: null,
});
const previewCashFlow = ref({
  amount: 0,
  cashFlowStatus: '',
  createdBy: null,
  sourceUserId: -1,
  sourceUserName: '',
  targetUserId: -1,
  targetUserName: '',
  transactionDate: '',
});
onMounted(() => {
  if (props.selectedData) {
    previewCashFlow.value = props.selectedData;
    previewCashFlow.value.transactionDate = moment(
      props.selectedData.transactionDate
    ).format('YYYY-MM-DD');
  }
});
</script>
