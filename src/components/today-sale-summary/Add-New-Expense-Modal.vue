<template>
  <q-card class="min-w-[400px]">
    <q-card-section>
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-medium">Add Expense</span>
        <q-btn
          class="font-medium"
          icon="close"
          flat
          unelevated
          dense
          v-close-popup
        />
      </div>
      <div class="flex flex-col md:flex-row gap-2 mb-3">
        <div>
          <q-select
            :loading="isLoading"
            class="min-w-[250px]"
            dense
            popup-content-class="!max-h-[200px]"
            map-options
            outlined
            clearable
            v-model="expenseType.expense"
            :options="expenseList"
            label="Expense Type"
            color="btn-primary"
            option-label="expenseTypeName"
            option-value="expenseTypeId"
            ><template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template></q-select
          >
        </div>
        <div>
          <q-input
            class="min-w-[250px]"
            :min="0"
            type="number"
            label="Amount"
            dense
            color="btn-primary"
            outlined
            v-model="expenseType.amount"
            @update:model-value="handleUpdateAmount($event)"
          />
        </div>
      </div>
      <div>
        <q-input
          dense
          autogrow
          color="btn-primary"
          placeholder="Add your comment"
          outlined
          type="textarea"
          v-model="expenseType.comments"
        />
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        label="Cancel"
        color="white"
        v-close-popup
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
      />
      <q-btn
        flat
        label="Add"
        color="white"
        :disable="
          !expenseType.expense ||
          expenseType.amount <= 0 ||
          !expenseType.amount ||
          expenseType.amount > 9999999
        "
        :loading="isLoading"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="confirmAction"
      />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Iexpenses } from 'src/interfaces';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
import { getExpenseList, addExpenseApi } from 'src/services';
const authStore = useAuthStore();
const $q = useQuasar();
const isLoading = ref(false);
const expenseList = ref<Iexpenses[]>([]);
const emit = defineEmits<{ (event: 'confirm'): void }>();
const confirmAction = async () => {
  isLoading.value = true;
  await handleAddNewExpense();
  emit('confirm');
};
onMounted(() => {
  getExpenseTypeList();
});
const expenseType = ref<{
  expense: Iexpenses | null;
  amount: number;
  comments: string;
}>({
  expense: null,
  amount: 0,
  comments: '',
});
const handleUpdateAmount = (newVal: string | number | null) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (!val || val <= 0) {
      expenseType.value.amount = 0;
    } else if (val > 0) {
      expenseType.value.amount = val;
    }
  }
};
const getExpenseTypeList = async () => {
  try {
    const res = await getExpenseList({
      pageNumber: 1,
      pageSize: 100,
    });
    if (res.data) {
      expenseList.value = res.data.items;
    }
  } catch (error) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
};
const handleAddNewExpense = async () => {
  const { expense, amount, comments } = expenseType.value;
  try {
    const res = await addExpenseApi({
      expenseId: expense?.expenseTypeId ?? -1,
      shopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
      amount: amount,
      comments: comments,
    });
    if (res.type === 'Success') {
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
};
</script>
