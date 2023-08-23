<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between items-center q-mb-md">
        <span class="text-h6">{{ isEdit ? 'Edit Bill' : 'Preview Bill' }}</span>
        <q-btn icon="close" dense flat unelevated v-close-popup />
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-input
            v-model="billInfo.billId"
            :disable="!isEdit"
            dense
            label="Bill Id"
            outlined
          />
        </div>
        <div class="col-6">
          <q-input
            v-model="billInfo.outstandingBalance"
            :disable="!isEdit"
            dense
            label="Outstanding Balance"
            outlined
          />
        </div>
        <div class="col-6">
          <q-input
            type="date"
            v-model="billInfo.date"
            :disable="!isEdit"
            dense
            label="Date"
            outlined
          />
        </div>
        <div class="col-6">
          <q-input
            v-model="billInfo.userName"
            :disable="!isEdit"
            dense
            label="User Name"
            outlined
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="row justify-end">
      <q-btn
        :label="isEdit ? 'Cancel' : 'Close'"
        v-close-popup
        color="btn-secondary"
      />
      <q-btn v-if="isEdit" label="Save" color="btn-primary" />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { IBillGenerationData } from '../../interfaces/bill-generation';
interface IProps {
  isEdit: boolean;
  selectedBill: IBillGenerationData;
}
const props = withDefaults(defineProps<IProps>(), {
  isEdit: false,
});
const billInfo = ref<{
  billId: number;
  outstandingBalance: number;
  date: string;
  userName: string;
}>({
  billId: -1,
  outstandingBalance: 0,
  date: '',
  userName: '',
});
onMounted(() => {
  if (billInfo.value !== undefined) {
    billInfo.value.billId = props.selectedBill?.billId;
    billInfo.value.date = props.selectedBill?.date;
    billInfo.value.outstandingBalance = props.selectedBill?.totalAmount;
    billInfo.value.userName = props.selectedBill?.name;
  }
});
</script>
