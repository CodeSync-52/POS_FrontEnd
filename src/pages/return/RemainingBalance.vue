<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="font-semibold text-lg text-center">
          <span>Remaining Balance Details</span>
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
                <template v-if="props.row.editing">
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
                <template v-if="props.row.editing">
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
                  v-if="!props.row.saveRow && props.row.editing"
                  flat
                  unelevated
                  dense
                  size="sm"
                  icon="check"
                  color="green"
                  @click="saveRow(props.row)"
                >
                  <q-tooltip class="bg-green" :offset="[10, 10]">
                    Save row
                  </q-tooltip>
                </q-btn>
                <q-btn
                  v-if="!props.row.saveRow || !props.row.editing"
                  flat
                  unelevated
                  dense
                  size="sm"
                  icon="cancel"
                  color="red"
                  @click="discardRow(props.row)"
                >
                  <q-tooltip class="bg-red" :offset="[10, 10]">
                    Delete Row
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template v-slot:bottom-row>
              <q-tr>
                <q-td>
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
      </q-card-section>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { IShopSaleExpenses } from 'src/interfaces';
import { shopSaleExpenseTableColumn } from './utils';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const openingBalance = ref('');
const runningBalance = ref('');
const balanceSubmitToHod = ref('');
const ShopManagementExpenseRecords = ref<IShopSaleExpenses[]>([]);
const editingRow = ref<number | null>(null);
const expenseCounter = ref(0);
const addRow = () => {
  const id = expenseCounter.value++;
  const newRecord: IShopSaleExpenses = {
    id,
    name: '',
    amount: 0,
    saveRow: false,
    editing: true,
  };
  ShopManagementExpenseRecords.value.push(newRecord);
  editingRow.value = id;
};
const saveRow = (row: IShopSaleExpenses) => {
  if (row.name.trim() !== '') {
    row.amount = Math.max(row.amount, 0);
    row.saveRow = true;
    row.editing = false;
  } else {
    $q.notify({
      message: 'Empty expense field or amount is below 0',
      type: 'negative',
    });
  }
};


const discardRow = (row: IShopSaleExpenses) => {
  const index = ShopManagementExpenseRecords.value.indexOf(row);
  if (index !== -1) {
    ShopManagementExpenseRecords.value.splice(index, 1);
  }
};
</script>
