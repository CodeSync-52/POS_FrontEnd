<template>
  <div>
    <div class="text-lg text-center md:text-left font-medium mb-4">
      <span>Add New Flow</span>
    </div>
    <q-card>
      <q-card-section>
        <div class="q-gutter-y-md">
          <div class="row q-col-gutter-md">
            <div class="col-md-4 col-12 q-gutter-y-md">
              <div>
                <span class="text-base font-medium">Source</span>
                <q-select
                  label="Source"
                  dense
                  outlined
                  map-options
                  option-label="userName"
                  option-value="userId"
                  :options="userList"
                  @update:model-value="
                    addNewFlow.sourceOutstandingBalance =
                      $event.outStandingBalance
                  "
                  v-model="addNewFlow.source"
                />
              </div>
              <q-input
                v-if="addNewFlow.sourceOutstandingBalance"
                v-model="addNewFlow.sourceOutstandingBalance"
                disable
                label="Source Outstanding Balance"
                dense
                outlined
              />
            </div>
            <div class="col-md-4 col-12 q-gutter-y-md">
              <div>
                <span class="text-base font-medium">Target</span>
                <q-select
                  label="Target"
                  dense
                  outlined
                  @update:model-value="
                    addNewFlow.targetOutstandingBalance =
                      $event.outStandingBalance
                  "
                  map-options
                  option-label="userName"
                  option-value="userId"
                  :options="userList"
                  v-model="addNewFlow.target"
                />
              </div>
              <q-input
                v-if="addNewFlow.targetOutstandingBalance"
                v-model="addNewFlow.targetOutstandingBalance"
                disable
                label="Target Outstanding Balance"
                dense
                outlined
              />
            </div>
            <div class="col-md-4 col-12">
              <span class="text-base font-medium">Amount</span>
              <q-input
                :min="0"
                type="number"
                label="Amount"
                dense
                outlined
                v-model="addNewFlow.amount"
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
            !addNewFlow.source || !addNewFlow.target || addNewFlow.amount <= 0
          "
          :loading="isAdding"
          @click="handleAddNewFlow"
          color="btn-primary"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { CanceledError } from 'axios';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { IUserResponse } from 'src/interfaces';
import { addCashFlowApi, getUserListApi } from 'src/services';
import { isPosError } from 'src/utils';
const router = useRouter();
const isAdding = ref(false);
const addNewFlow = ref<{
  source: IUserResponse | null;
  target: IUserResponse | null;
  amount: number;
  comment: string;
  sourceOutstandingBalance: null | number;
  targetOutstandingBalance: null | number;
}>({
  source: null,
  target: null,
  amount: 0,
  comment: '',
  sourceOutstandingBalance: null,
  targetOutstandingBalance: null,
});
const userList = ref<IUserResponse[]>([]);
const handleAddNewFlow = async () => {
  if (isAdding.value) return;
  isAdding.value = true;
  const { source, target, amount } = addNewFlow.value;
  try {
    const res = await addCashFlowApi({
      sourceUserId: source?.userId ?? -1,
      amount: Number(amount),
      targetUserId: target?.userId ?? -1,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      router.push('/cash-flow');
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
const getUserList = async () => {
  try {
    const res = await getUserListApi({
      pageNumber: 1,
      pageSize: 500,
    });
    if (res?.data) {
      userList.value = res.data.items;
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
