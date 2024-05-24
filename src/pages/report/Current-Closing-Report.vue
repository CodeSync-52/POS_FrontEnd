<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
  >
    <span class="text-xl font-medium">Current + Closing Report</span>
  </div>
  <div class="py-4">
    <q-table
      :loading="isLoading"
      tabindex="0"
      :rows="reportData"
      align="left"
      :columns="CurrentClosingReportColumn"
      row-key="id"
      :rows-per-page-options="[0]"
      @request="currentClosingReport()"
      :pagination="{ rowsPerPage: 0 }"
      :hide-bottom="reportData.length > 0"
    >
      <template v-slot:no-data>
        <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
          <q-icon name="warning" size="xs" />
          <span class="text-md font-medium"> No data available. </span>
        </div>
      </template>
      <template v-if="reportData.length" v-slot:bottom-row>
        <q-tr class="sticky bottom-0 bg-white">
          <q-td colspan="1" class="text-bold"> Total </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('discount') }}
          </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('netSale') }}
          </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('totalItemsSale') }}
          </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('remainingBalance') }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ICurrentClosingReportData } from 'src/interfaces';
import { isPosError } from 'src/utils';
import { CurrentClosingReportColumn } from 'src/utils/reports';
import { useQuasar } from 'quasar';
import { GetCurrentClosingReport } from 'src/services/reports';
const $q = useQuasar();
const isLoading = ref(false);
const reportData = ref<ICurrentClosingReportData[]>([]);
onMounted(async () => {
  await currentClosingReport();
});
const currentClosingReport = async () => {
  isLoading.value = true;
  try {
    const res = await GetCurrentClosingReport();
    if (res?.data) {
      reportData.value = res.data;
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
};
const calculateTotal = (columnName: keyof (typeof reportData.value)[0]) => {
  return reportData.value.reduce(
    (total, row) => total + Number(row[columnName]),
    0
  );
};
</script>
