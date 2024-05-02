<template>
  <div>
    <div
      class="text-lg text-center row justify-between md:text-left font-medium mb-4"
    >
      <span>Add New Flow</span>
      <q-btn icon="info" color="btn-primary" flat unelevated dense
        ><q-tooltip class="bg-btn-primary" :offset="[10, 10]">
          If Outstanding balance is greater than zero, the business owner has to
          pay. If Outstanding balance is less than zero, the business owner has
          to receive.
        </q-tooltip></q-btn
      >
    </div>
    <q-card>
      <q-card-section>
        <div class="q-gutter-y-md">
          <div class="row q-col-gutter-md">
            <div class="col-md-4 col-12 q-gutter-y-md">
              <div>
                <span class="text-base font-medium">Receiver</span>
                <q-select
                  autofocus
                  dense
                  color="btn-primary"
                  outlined
                  clearable
                  map-options
                  use-input
                  popup-content-class="!max-h-[200px]"
                  @filter="filterUser"
                  option-label="fullName"
                  option-value="userId"
                  :options="receiverUserList"
                  @update:model-value="
                    handleShowOutstandingBalance($event, false)
                  "
                  v-model="addNewFlow.cashIn"
                />
              </div>
              <div>
                <span class="text-base font-medium"
                  >Receiver Outstanding Balance</span
                >
                <q-input
                  v-model="addNewFlow.cashInOutstandingBalance"
                  readonly
                  color="btn-primary"
                  dense
                  outlined
                />
              </div>
            </div>
            <div class="col-md-4 col-12 q-gutter-y-md">
              <div>
                <span class="text-base font-medium">Sender</span>
                <q-select
                  color="btn-primary"
                  dense
                  outlined
                  clearable
                  use-input
                  popup-content-class="!max-h-[200px]"
                  map-options
                  @filter="filterUser"
                  @update:model-value="
                    handleShowOutstandingBalance($event, true)
                  "
                  option-label="fullName"
                  option-value="userId"
                  :options="receiverUserList"
                  v-model="addNewFlow.cashOut"
                />
              </div>
              <div>
                <span class="text-base font-medium"
                  >Sender Outstanding Balance</span
                >
                <q-input
                  v-model="addNewFlow.cashOutOutstandingBalance"
                  readonly
                  dense
                  outlined
                  color="btn-primary"
                />
              </div>
            </div>
            <div class="col-md-4 col-12">
              <span class="text-base font-medium">Amount</span>
              <q-input
                :min="0"
                type="number"
                dense
                color="btn-primary"
                outlined
                v-model="addNewFlow.amount"
                @update:model-value="handleUpdateAmount($event)"
              />
            </div>
          </div>
          <div class="q-gutter-y-xs">
            <span class="font-medium text-base">Comments</span>
            <q-input
              autogrow
              color="btn-primary"
              placeholder="Add your comment"
              outlined
              type="textarea"
              v-model="addNewFlow.comment"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-gutter-x-sm">
        <router-link to="/cash-flow">
          <q-btn
            unelevated
            label="Cancel"
            :disable="isAdding"
            color="btn-cancel hover:bg-btn-cancel-hover"
          />
        </router-link>
        <q-btn
          label="Add"
          unelevated
          :disable="
            !addNewFlow.cashIn ||
            !addNewFlow.cashOut ||
            addNewFlow.amount <= 0 ||
            !addNewFlow.amount ||
            addNewFlow.amount > 9999999
          "
          :loading="isAdding"
          @click="handleAddNewFlow"
          color="btn-primary"
        />
        <q-dialog v-model="isPreviewCashFlowModalVisible">
          <preview-cash-flow :selected-data="cashFlowResponse" />
        </q-dialog>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { CanceledError } from 'axios';
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { ICashFlowRecords, IUserResponse } from 'src/interfaces';
import { CreateTransaction, GetUsers } from 'src/services';
import PreviewCashFlow from 'src/components/cash-flow/Preview-Cash-Flow.vue';
import { isPosError } from 'src/utils';

const isPreviewCashFlowModalVisible = ref(false);
const cashFlowResponse = ref<ICashFlowRecords | null>(null);
const isAdding = ref(false);
const addNewFlow = ref<{
  cashIn: IUserResponse | null;
  cashOut: IUserResponse | null;
  amount: number;
  comment: string;
  cashInOutstandingBalance: null | number;
  cashOutOutstandingBalance: null | number;
}>({
  cashIn: null,
  cashOut: null,
  amount: 0,
  comment: '',
  cashInOutstandingBalance: null,
  cashOutOutstandingBalance: null,
});
const handleShowCashFlow = (cashFlowRes: ICashFlowRecords) => {
  cashFlowResponse.value = cashFlowRes;
  isPreviewCashFlowModalVisible.value = true;
};
const senderUserList = ref<IUserResponse[]>([]);
const receiverUserList = ref<IUserResponse[]>([]);
const handleUpdateAmount = (newVal: string | number | null) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (!val || val <= 0) {
      addNewFlow.value.amount = 0;
    } else if (val > 0) {
      addNewFlow.value.amount = val;
    }
  }
};
const handleAddNewFlow = async () => {
  if (isAdding.value) return;
  isAdding.value = true;
  const { cashIn, cashOut, amount, comment } = addNewFlow.value;
  try {
    const res = await CreateTransaction({
      sourceUserId: cashIn?.userId ?? -1,
      amount: amount,
      targetUserId: cashOut?.userId ?? -1,
      comments: comment,
    });
    if (res.type === 'Success') {
      if (res.data) {
        handleShowCashFlow(res.data);
      }
      $q.notify({
        message: res.message,
        color: 'green',
      });
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred Add Cash Flow';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  isAdding.value = false;
};
const $q = useQuasar();
onMounted(() => {
  getUserList();
});
const handleShowOutstandingBalance = (
  value: IUserResponse,
  isSender: boolean
) => {
  if (isSender) {
    addNewFlow.value.cashOutOutstandingBalance =
      value?.outStandingBalance ?? null;
  } else {
    addNewFlow.value.cashInOutstandingBalance =
      value?.outStandingBalance ?? null;
  }
};
const getUserList = async () => {
  try {
    const res = await GetUsers({
      pageNumber: 1,
      pageSize: 500,
    });
    if (res?.data) {
      receiverUserList.value = res.data.items.filter(
        (user) => user.status === 'Active' && user.roleName === 'Customer'
      );
      senderUserList.value = res.data.items.filter(
        (user) => user.status === 'Active' && user.roleName === 'Customer'
      );
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
const filterUser = (val: string, update: CallableFunction) => {
  update(() => {
    receiverUserList.value = senderUserList.value.filter((user) =>
      user.fullName?.toLowerCase().includes(val.toLowerCase())
    );
    if (addNewFlow.value.cashIn?.userId) {
      receiverUserList.value = receiverUserList.value.filter(
        (user) => user.userId !== addNewFlow.value.cashIn?.userId
      );
    }
    if (addNewFlow.value.cashOut?.userId) {
      receiverUserList.value = receiverUserList.value.filter(
        (user) => user.userId !== addNewFlow.value.cashOut?.userId
      );
    }
  });
};
</script>
