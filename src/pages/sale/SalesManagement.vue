<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <router-link to="/sale/add-new">
        <q-btn
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.SalesManagement,
              EActionPermissions.Create
            )
          "
          unelevated
          label="Add New"
          icon="add"
          class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
          color=""
        />
      </router-link>
    </div>
    <div
      class="row flex lg:justify-end sm:justify-start items-center w-full min-h-[3.5rem] gap-8"
    >
      <q-select
        dense
        outlined
        style="min-width: 200px"
        v-model="filterSearch.userId"
        @update:model-value="filterSearch.userId = $event.userId"
        map-options
        option-label="fullName"
        option-value="userId"
        label="User"
        color="btn-primary"
      />
      <q-select
        dense
        outlined
        style="min-width: 200px"
        v-model="filterSearch.wholesaleStatus"
        label="Wholesale Status"
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.userName"
        outlined
        label="Name"
        dense
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.startDate"
        label="From"
        :max="filterSearch.endDate"
        type="date"
        outlined
        dense
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.endDate"
        label="To"
        type="date"
        :min="filterSearch.startDate"
        outlined
        color="btn-primary"
        dense
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-4">
        <q-btn
          :loading="isLoading"
          color=""
          unelevated
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          :disable="filterSearch.userId !== null && filterSearch.userId < 0"
          @click="getSalesManagementList()"
        />
        <q-btn
          color=""
          :loading="isLoading"
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table
        :columns="salesManagementColumn"
        :rows="salesManagementRecords"
        v-model:pagination="pagination"
        align="left"
        :loading="isLoading"
        @request="getSalesManagementList"
      >
        <template
          v-slot:header-cell-action
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.SalesManagement,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.SalesManagement,
              EActionPermissions.Delete
            )
          "
        >
          <q-th></q-th>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td
            v-if="
              authStore.checkUserHasPermission(
                EUserModules.SalesManagement,
                EActionPermissions.Update
              ) ||
              authStore.checkUserHasPermission(
                EUserModules.SalesManagement,
                EActionPermissions.Delete
              )
            "
            :props="props"
          >
            <div class="flex gap-2 flex-nowrap">
              <router-link :to="`/sale/${props.row.userId}`">
                <q-btn
                  v-if="
                    authStore.checkUserHasPermission(
                      EUserModules.SalesManagement,
                      EActionPermissions.Update
                    ) &&
                    props.row.wholesaleStatus !== 'Cancelled' &&
                    props.row.wholesaleStatus !== 'Billed'
                  "
                  size="sm"
                  flat
                  dense
                  unelevated
                  icon="edit"
                  class="hover:text-btn-primary"
                />
              </router-link>
              <router-link :to="`/sale/${props.row.userId}/preview`">
                <q-btn
                  size="sm"
                  flat
                  dense
                  unelevated
                  icon="visibility"
                  color="green"
                />
              </router-link>
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.SalesManagement,
                    EActionPermissions.Update
                  ) &&
                  props.row.wholesaleStatus !== 'Cancelled' &&
                  props.row.wholesaleStatus !== 'Billed'
                "
                size="sm"
                flat
                dense
                unelevated
                icon="receipt"
                color="bg-btn-secondary"
              />
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.SalesManagement,
                    EActionPermissions.Update
                  ) &&
                  props.row.wholesaleStatus !== 'Cancelled' &&
                  props.row.wholesaleStatus !== 'Billed'
                "
                size="sm"
                flat
                dense
                unelevated
                icon="cancel"
                color="red"
                @click="handleCancelSale(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isCancelSaleModalVisible">
      <q-card class="min-w-[400px]">
        <q-card-section>
          <div class="flex justify-between items-center mb-2">
            <span class="text-lg font-medium">Cancel Sale</span>
            <q-btn
              class="font-medium"
              icon="close"
              flat
              unelevated
              dense
              v-close-popup
            />
          </div>
          <div class="text-center">
            <span>Are you sure you want to Cancel the Sale?</span>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            color="white"
            v-close-popup
            class="bg-btn-cancel hover:bg-btn-cancel-hover"
          />
          <q-btn
            flat
            label="Cancel"
            color="white"
            :loading="isCancellingSale"
            class="bg-btn-primary hover:bg-btn-primary-hover"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  ISalesFilterSearch,
} from 'src/interfaces';
import { salesManagementListApi } from 'src/services';
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
const filterSearch = ref<ISalesFilterSearch>({
  userId: null,
  userName: null,
  startDate: null,
  endDate: null,
  wholesaleStatus: null,
});
const isCancelSaleModalVisible = ref(false);
const isCancellingSale = ref(false);
const salesManagementRecords = ref<ISalesManagementData[]>(salesManagementData);
const pagination = ref<IPagination>(defaultPagination);
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const selectedRowData = ref<ISalesManagementData | null>(null);
onMounted(() => {
  getSalesManagementList();
});
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    userId: null,
    userName: null,
    startDate: null,
    endDate: null,
    wholesaleStatus: null,
  };
  getSalesManagementList();
};
const handleCancelSale = (selectedRow: ISalesManagementData) => {
  selectedRowData.value = selectedRow;
  isCancelSaleModalVisible.value = true;
};
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
    const res = await salesManagementListApi(
      {
        filterSearch: filterSearch.value,
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
      },
      apiController.value
    );
    if (res?.data) {
      salesManagementRecords.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
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
