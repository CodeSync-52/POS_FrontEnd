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
const openingBalance = ref('');
const runningBalance = ref('');
const balanceSubmitToHod = ref('');
const ShopManagementExpenseRecords = ref<IShopSaleExpenses[]>([]);
const expenseCounter = ref(0);
const addRow = () => {
  const id = expenseCounter.value++;
  const newRecord: IShopSaleExpenses = {
    id,
    name: 'Enter Text',
    amount: 0,
  };
  ShopManagementExpenseRecords.value.push(newRecord);
};
</script>
