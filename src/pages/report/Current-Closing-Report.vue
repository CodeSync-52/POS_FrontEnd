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
      :columns="CurrentClosingReport"
      row-key="id"
      :rows-per-page-options="[0]"
      @request="offlineShopArticelInventoryReport()"
      :pagination="{ rowsPerPage: 0 }"
      :hide-bottom="reportData.length > 0"
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <div
            class="h-[100px] w-[100px] min-w-[2rem] overflow-hidden"
            :class="props.row.image"
          >
            <img
              class="w-full h-full object-cover"
              :src="props.row.image || 'assets/default-image.png'"
              alt="img"
            />
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
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IOfflineShopArticleReportData } from 'src/interfaces';
import { isPosError } from 'src/utils';
import { CurrentClosingReport } from 'src/utils/reports';
import { useQuasar } from 'quasar';
// import { GetOfflineShopArticleInventoryReport } from 'src/services/reports';
const $q = useQuasar();
const isLoading = ref(false);
const filterSearch = ref<{
  shopId: number | null;
  sortBy: number;
  categoryId: any;
}>({
  shopId: null,
  sortBy: 1,
  categoryId: null,
});
const reportData = ref<IOfflineShopArticleReportData[]>([]);
onMounted(async () => {
  offlineShopArticelInventoryReport();
});
const offlineShopArticelInventoryReport = async () => {
  isLoading.value = true;
  if (!filterSearch.value.shopId) {
    isLoading.value = false;
    $q.notify({
      message: 'Please Select Shop',
      icon: 'error',
      color: 'red',
    });
    return;
  }
  try {
    // const res = await GetOfflineShopArticleInventoryReport({
    //   shopId: filterSearch.value.shopId,
    //   categoryId: filterSearch.value.categoryId ?? 0,
    //   sortBy: filterSearch.value.sortBy,
    // });
    // if (res?.data) {
    //   reportData.value = res.data;
    // }
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
</script>
