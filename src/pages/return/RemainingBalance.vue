<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="font-semibold text-lg text-center">
          <span> Remaining Balance Details</span>
        </div>
        <div class="flex flex-col gap-2 md:gap-4 items-center md:items-end q-pa-md">
          <div class="md:flex gap-2 items-center">
            <span class="font-medium md:text-lg">Opening Balance :</span>
            <q-input v-model="text" type="number" class="max-w-[200px] min-w-[200px]" maxlength="250" disable outlined
              dense color="btn-primary" />
          </div>
          <div class="md:flex gap-2 items-center">
            <span class="font-medium md:text-lg">Running Balance :</span>
            <q-input v-model="text" type="number" class="max-w-[200px] min-w-[200px]" maxlength="250" disable outlined
              dense color="btn-primary" />
          </div>
          <div class="md:flex gap-2 items-center">
            <span class="font-medium md:text-lg">Balance Submit to HOD :</span>
            <q-input v-model="text" type="number" class="max-w-[200px] min-w-[200px]" maxlength="250" disable outlined
              dense color="btn-primary" />
          </div>
        </div>
        <div class="q-pa-md">
          <q-table flat bordered title="Expenses" :rows="rows" :columns="columns" row-key="id" :loading="loading">
            <template v-slot:bottom-row>
              <q-tr>
                <q-td>
                  <q-btn :disable="loading" unelevated color="btn-primary" label="Add row" @click="addRow" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { QTableColumn } from 'quasar';
import { ref } from 'vue'
const text = ref('')
interface IExpenses {
  id: number,
  name: string,
  amount: number
}
const columns: QTableColumn<IExpenses>[] = [
  {
    name: 'name',
    required: true,
    label: 'Expense Name',
    align: 'left',
    field: row => row.name,
  },
  {
    name: 'amount',
    required: true,
    label: 'Amount',
    align: 'left',
    field: row => row.amount,
  },
]
const originalRows = [
  {
    id: 0,
    name: 'Water',
    amount: 10,
  },
  {
    id: 1,
    name: 'Ice',
    amount: 10,
  }
]
const rows = ref([...originalRows])
const loading = ref(false);
const rowCount = ref(rows.value.length);

const addRow = () => {
  const newId = rowCount.value++;
  const newRow: IExpenses = {
    id: newId,
    name: 'Enter Text',
    amount: 0,
  };
  rows.value.push(newRow);
};
</script>
