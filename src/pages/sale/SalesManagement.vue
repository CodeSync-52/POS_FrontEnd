<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>

      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.SalesManagement,
            EActionPermissions.Create
          )
        "
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        color=""
      />
    </div>
    <q-table
      :columns="salesManagementColumn"
      :rows="salesManagementRecords"
      v-model:pagination="pagination"
      align="left"
      :loading="isLoading"
      @request="getSalesManagementList"
    >
    </q-table>
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  IPagination,
  ISalesManagementData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { useAuthStore } from 'src/stores';
import {
  isPosError,
  salesManagementColumn,
  salesManagementData,
} from 'src/utils';
import { onMounted, ref } from 'vue';
const pageTitle = getRoleModuleDisplayName(EUserModules.SalesManagement);
const authStore = useAuthStore();
const $q = useQuasar();
const defaultPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
};
const salesManagementRecords = ref<ISalesManagementData[]>(salesManagementData);
const pagination = ref<IPagination>(defaultPagination);
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
onMounted(() => {
  getSalesManagementList();
});
const getSalesManagementList = async (data?: {
  pagination?: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (isLoading.value) return;
  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    // const res = await salesManagementListApi(
    //   {
    //     ToDate: filterSearch.value.endDate,
    //     FromDate: filterSearch.value.startDate,
    //     UserId: filterSearch.value.userId,
    //     FullName: filterSearch.value.userName,
    //     PageNumber: pagination.value.page,
    //     PageSize: pagination.value.rowsPerPage,
    //   },
    //   apiController.value
    // );
    // if (res?.data) {
    //   salesManagementRecords.value = res.data.items;
    //   pagination.value.rowsNumber = res.data.totalItemCount;
    // }
  } catch (e) {
    let message = 'Unexpected Error Occurred fetching Sales List';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
  isLoading.value = false;
};
</script>
