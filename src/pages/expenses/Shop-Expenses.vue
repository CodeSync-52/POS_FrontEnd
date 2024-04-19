<template>
  <div>
    <div
      class="flex flex-col sm:flex-row justify-center md:justify-between px-4 gap-4 items-center mb-4"
    >
      <span class="text-lg font-medium">Expenses Type</span>
      <q-btn
        label="Add New"
        unelevated
        icon="add"
        class="rounded-[4px] bg-btn-primary text-signature hover:bg-btn-secondary"
        @click="handleAddNewExpense"
      />
    </div>
    <q-card-section>
      <div>
        <q-table
          class="max-h-[55vh] lg:max-h-[65vh] 3xl:max-h-[75vh]"
          :rows="expenseListRows"
          v-model:pagination="pagination"
          :columns="expenseColumns"
          row-key="expenseTypeId"
          :rows-per-page-options="[0]"
          @request="fetchingExpenseList"
        >
          <template v-slot:top>
            <div
              class="flex flex-col sm:flex-row justify-center md:justify-between gap-4 item-center w-full"
            >
              <div class="font-medium text-lg flex items-center"></div>
            </div>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td class="!text-right" :props="props">
              <div class="flex gap-2 md:pr-4">
                <q-btn
                  size="sm"
                  flat
                  dense
                  unelevated
                  icon="edit"
                  class="hover:text-btn-primary"
                  @click="handleEditExpenseNamePopup(props.row)"
                  ><q-tooltip class="bg-black" :offset="[10, 10]">
                    Edit Expense
                  </q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
          <template v-slot:no-data>
            <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
              <q-icon name="warning" size="xs" />
              <span class="text-md font-medium"> No data available. </span>
            </div>
          </template>
        </q-table>
      </div>
    </q-card-section>
    <q-dialog
      v-model="showAddNewExpensePopup"
      @update:model-value="selectedRowData = null"
      ><add-expense-modal
        :user-name="selectedRowData?.expenseTypeName"
        :is-edit-expense="isEditExpense"
        @name-changed="updateOrAddExpense"
    /></q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { IExpenses } from 'src/interfaces';
import {
  CreateExpense,
  GetExpenseList,
  UpdateExpense,
} from 'src/services';
import AddExpenseModal from 'src/components/expenses/Add-Update-Expense-Modal.vue';
import { isPosError } from 'src/utils';
import { expenseColumns } from 'src/utils/expense';
const $q = useQuasar();
const expenseListRows = ref<IExpenses[]>([]);
const selectedRowData = ref<IExpenses | null>(null);
const showAddNewExpensePopup = ref(false);
const isEditExpense = ref(false);
const isLoading = ref(false);
const newExpenseName = ref('');
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100000,
  rowsNumber: 0,
});
onMounted(() => {
  fetchingExpenseList();
});
const handleAddNewExpense = () => {
  selectedRowData.value = null;
  isEditExpense.value = false;
  newExpenseName.value = '';
  showAddNewExpensePopup.value = true;
};
const handleEditExpenseNamePopup = (selectedRow: IExpenses) => {
  isEditExpense.value = true;
  newExpenseName.value = selectedRow.expenseTypeName;
  showAddNewExpensePopup.value = true;
  selectedRowData.value = selectedRow;
};
const updateOrAddExpense = async (
  newName: string,
  action: string,
  callback: () => void
) => {
  if (action !== 'add' && selectedRowData.value?.expenseTypeName === newName) {
    showAddNewExpensePopup.value = false;
    callback();
    return;
  }
  try {
    const expenseId = selectedRowData.value?.expenseTypeId ?? -1;
    const res = await (action === 'add'
      ? CreateExpense(newName)
      : UpdateExpense({ newName, expenseId }));
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
    }
  } catch (e) {
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
  selectedRowData.value = null;
  showAddNewExpensePopup.value = false;
  callback();
  fetchingExpenseList();
};
async function fetchingExpenseList(data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) {
  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const pageSize =
      pagination.value.rowsPerPage === 0 ? 10000 : pagination.value.rowsPerPage;
    const res = await GetExpenseList({
      pageNumber: pagination.value.page,
      pageSize: pageSize,
    });
    if (res?.data) {
      expenseListRows.value = res?.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
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
  isLoading.value = false;
}
</script>
