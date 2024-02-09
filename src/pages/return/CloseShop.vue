<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="font-semibold text-lg text-center">
          <span>Balance Summary</span>
        </div>
        <div
          class="flex flex-col gap-2 md:gap-4 items-center md:items-end q-pa-md"
        >
          <div class="md:flex gap-2 items-center">
            <span class="font-medium md:text-lg">Opening Balance :</span>
            <q-input
              v-model="openingBalance"
              type="number"
              label="Opening Balance"
              class="max-w-[200px] min-w-[200px]"
              maxlength="250"
              outlined
              dense
              color="btn-primary"
            />
          </div>
          <div class="md:flex gap-2 items-center">
            <span class="font-medium md:text-lg">Running Balance :</span>
            <q-input
              v-model="runningBalance"
              type="number"
              label="Running Balance"
              class="max-w-[200px] min-w-[200px]"
              maxlength="250"
              outlined
              dense
              color="btn-primary"
            />
          </div>
          <div class="md:flex gap-2 items-center">
            <span class="font-medium md:text-lg">Balance Submit to HOD :</span>
            <q-input
              v-model="balanceSubmitToHod"
              type="number"
              label="Balance Submit to HOD"
              class="max-w-[200px] min-w-[200px]"
              maxlength="250"
              outlined
              dense
              color="btn-primary"
            />
          </div>
        </div>
        <div class="q-pa-md">
          <q-table
            flat
            bordered
            title="Expenses"
            :rows="ShopManagementExpenseRecords"
            :columns="shopSaleExpenseTableColumn"
            row-key="id"
          >
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <template
                  v-if="props.row.isEditing || props.row.id === editingRowId"
                >
                  <q-input
                    v-model="props.row.name"
                    type="text"
                    label="Expense"
                    class="max-w-[200px] min-w-[200px]"
                    outlined
                    dense
                    color="btn-primary"
                  />
                </template>
                <template v-else>
                  <span>{{ props.row.name }}</span>
                </template>
              </q-td>
            </template>
            <template v-slot:body-cell-amount="props">
              <q-td :props="props">
                <template
                  v-if="props.row.isEditing || props.row.id === editingRowId"
                >
                  <q-input
                    v-model="props.row.amount"
                    type="number"
                    label="Amount"
                    class="max-w-[200px] min-w-[200px]"
                    outlined
                    dense
                    color="btn-primary"
                  />
                </template>
                <template v-else>
                  <span>{{ props.row.amount }}</span>
                </template>
              </q-td>
            </template>
            <template v-slot:body-cell-saveRow="props">
              <q-td :props="props">
                <q-btn
                  v-if="props.row.isSavingRow && !props.row.isEditing"
                  flat
                  unelevated
                  dense
                  size="sm"
                  icon="edit"
                  color="green"
                  @click="handleEditRow(props.row)"
                >
                  <q-tooltip class="bg-green" :offset="[10, 10]">
                    Edit Row
                  </q-tooltip>
                </q-btn>
                <q-btn
                  v-if="!props.row.isSavingRow || props.row.isEditing"
                  flat
                  unelevated
                  dense
                  size="sm"
                  icon="check"
                  color="green"
                  @click="hanldeSaveRow(props.row)"
                >
                  <q-tooltip class="bg-green" :offset="[10, 10]">
                    Save Row
                  </q-tooltip>
                </q-btn>
                <q-btn
                  v-if="!props.row.isSavingRow || !props.row.isEditing"
                  flat
                  unelevated
                  dense
                  size="sm"
                  icon="cancel"
                  color="red"
                  @click="handleDeletedRow(props.row)"
                >
                  <q-tooltip class="bg-red" :offset="[10, 10]">
                    Delete Row
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template v-slot:bottom-row>
              <q-tr v-if="showTotalExpenseRow">
                <q-td>
                  <span class="font-medium">Total: </span>
                </q-td>
                <q-td>
                  <span>{{ expensesTotalSum }}</span>
                </q-td>
                <q-td />
              </q-tr>
              <q-tr>
                <q-td colSpan="3">
                  <q-btn
                    unelevated
                    color="btn-primary"
                    label="Add row"
                    @click="addRow"
                  />
                </q-td>
              </q-tr>
            </template>
            <template v-slot:no-data>
              <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
                <q-icon name="warning" size="xs" />
                <span class="text-md font-medium"> No data available. </span>
              </div>
            </template>
          </q-table>
        </div>
        <div
          class="flex flex-col gap-2 md:gap-4 items-center md:items-end q-pa-md"
        >
          <div class="md:flex gap-2 items-center">
            <span class="font-medium md:text-lg">Remaining Balance :</span>
            <q-input
              v-model="remainingBalance"
              type="number"
              label="Remaining Balance"
              class="max-w-[200px] min-w-[200px]"
              maxlength="250"
              outlined
              dense
              readonly
              color="btn-primary"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { IShopSaleExpenses } from 'src/interfaces';
import { shopSaleExpenseTableColumn } from './utils';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const openingBalance = ref(0);
const runningBalance = ref(0);
const balanceSubmitToHod = ref(0);
const ShopManagementExpenseRecords = ref<IShopSaleExpenses[]>([]);
const editingRowId = ref<number | null>(null);
const expenseCounter = ref(0);
const addRow = () => {
  if (editingRowId.value !== null) {
    $q.notify({
      message: 'Complete or discard the current edit before adding a new row.',
      type: 'warning',
    });
  } else {
    const id = expenseCounter.value++;
    const newRecord: IShopSaleExpenses = {
      id,
      name: '',
      amount: 0,
      isSavingRow: false,
      isEditing: true,
    };
    ShopManagementExpenseRecords.value.push(newRecord);
    editingRowId.value = id;
  }
};
const hanldeSaveRow = (row: IShopSaleExpenses) => {
  if (row.name.trim() !== '') {
    row.amount = Math.max(row.amount, 0);
    row.isSavingRow = true;
    row.isEditing = false;
    editingRowId.value = null;
  } else {
    $q.notify({
      message: 'Empty expense field',
      type: 'negative',
    });
  }
};
const handleDeletedRow = (row: IShopSaleExpenses) => {
  ShopManagementExpenseRecords.value =
    ShopManagementExpenseRecords.value.filter((item) => item.id !== row.id);
  editingRowId.value = null;
};
const handleEditRow = (row: IShopSaleExpenses) => {
  editingRowId.value = row.id;
  row.isSavingRow = false;
};
const expensesTotalSum = computed(() => {
  return ShopManagementExpenseRecords.value.reduce(
    (acc, record) => acc + (record.isSavingRow ? record.amount : 0),
    0
  );
});
const showTotalExpenseRow = computed(() => {
  return ShopManagementExpenseRecords.value.some(
    (record) => record.isSavingRow
  );
});
const remainingBalance = computed(() => {
  return (
    runningBalance.value -
    openingBalance.value -
    balanceSubmitToHod.value -
    expensesTotalSum.value
  );
});
</script>
