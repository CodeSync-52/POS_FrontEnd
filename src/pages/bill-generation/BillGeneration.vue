<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.BillGeneration,
            EActionPermissions.Create
          )
        "
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary text-signature hover:bg-btn-secondary"
        @click="router.push('/bill-generation/add-new')"
      />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-start items-center w-full min-h-[3.5rem] gap-8"
    >
      <q-input
        v-model="filterSearch.billId"
        min="1"
        label="Bill ID"
        type="number"
        dense
        outlined
      />
      <q-input v-model="filterSearch.userName" outlined label="Name" dense />
      <q-input
        v-model="filterSearch.FromDate"
        label="From"
        type="date"
        outlined
        dense
      />
      <q-input
        v-model="filterSearch.ToDate"
        label="To"
        type="date"
        outlined
        dense
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-4">
        <q-btn
          unelevated
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          :disable="filterSearch.billId !== null && filterSearch.billId < 0"
          @click="handleFilterSearch"
        />
        <q-btn
          unelevated
          color=""
          :loading="isLoading"
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="resetFilter"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table
        tabindex="0"
        :loading="isLoading"
        :rows="billGenerationData"
        :columns="billGenerationColumn"
        row-key="name"
        v-model:pagination="pagination"
        @request="getBillList"
      >
        <template
          v-slot:header-cell-action
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.BillGeneration,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.BillGeneration,
              EActionPermissions.Delete
            )
          "
        >
          <q-th></q-th>
        </template>
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.BillGeneration,
              EActionPermissions.Update
            ) &&
            authStore.checkUserHasPermission(
              EUserModules.BillGeneration,
              EActionPermissions.Delete
            )
          "
          v-slot:body-cell-action="props"
        >
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                icon="receipt"
                @click="router.push(`/bill-generation/${props.row.billId}`)"
              />
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                icon="visibility"
                @click="
                  router.push(`/bill-generation/${props.row.billId}/preview`)
                "
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isBillPreviewModalVisible">
      <bill-preview-modal :isEdit="isEdit" :selected-bill="selectedRowData" />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores';
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isPosError, billGenerationColumn } from 'src/utils';
import {
  getRoleModuleDisplayName,
  EActionPermissions,
  EUserModules,
  IBillGenerationData,
  IBillGenerationFilter,
} from 'src/interfaces';
import { billListApi } from 'src/services';
import BillPreviewModal from 'src/components/bill-generation/BillPreviewModal.vue';
const authStore = useAuthStore();
const router = useRouter();
const billGenerationData = ref<IBillGenerationData[]>([]);
const pageTitle = getRoleModuleDisplayName(EUserModules.BillGeneration);
const isLoading = ref(false);
const $q = useQuasar();
const isBillPreviewModalVisible = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const isEdit = ref(false);
const selectedRowData = ref<IBillGenerationData | null>(null);
const filterSearch = ref<IBillGenerationFilter>({
  billId: null,
  userName: null,
  ToDate: null,
  FromDate: null,
});
onMounted(() => {
  getBillList();
});
const handleFilterSearch = () => {
  getBillList();
};
const resetFilter = () => {
  filterSearch.value = {
    billId: null,
    userName: null,
    ToDate: null,
    FromDate: null,
  };
  getBillList();
};
const getBillList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (isLoading.value) return;
  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await billListApi({
      PageNumber: pagination.value.page,
      PageSize: pagination.value.rowsPerPage,
      filterSearch: filterSearch.value,
    });
    if (res.data) {
      billGenerationData.value = res.data.items;
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
};
</script>
