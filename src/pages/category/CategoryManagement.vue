<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-start mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <q-btn
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary text-signature hover:bg-btn-secondary"
        @click="AddNewCategory"
      />
    </div>
    <div class="py-4">
      <q-table
        tabindex="0"
        :loading="isLoading"
        :rows="categoryData"
        :columns="categoryColumn"
        row-key="name"
        v-model:pagination="pagination"
        @request="getCategoryList"
      >
        <template v-slot:body-cell-category="props">
          <q-td :props="props">
            <q-btn
              flat
              unelevated
              dense
              size="sm"
              @click="handleManageClick(props.row.categoryId)"
              label="Manage"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn
              size="sm"
              dense
              flat
              unelevated
              :label="props.row.status"
              @click="handleShowEditStatusPopup(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                icon="edit"
                @click="onEditButtonClick(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog
      @update:model-value="selectedRowData = null"
      v-model="isCategoryModalVisible"
    >
      <category-management-modal
        :category="selectedCategory"
        :category-action="CategoryAction"
        @name-changed="updateOrAddCategory"
        :selected-row="selectedRowData?.categoryId"
        @delete-record="deletingCategory"
      />
    </q-dialog>
    <q-dialog v-model="isCategoryStatusModalVisible">
      <category-status-modal
        :selected-status="selectedStatus"
        @updated-status="updatingStatus"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CategoryManagementModal from 'src/components/category-management/CategoryManagementModal.vue';
import CategoryStatusModal from 'src/components/category-management/CategoryStatusModal.vue';
import { categoryColumn } from 'src/pages/category/utils';
import {
  EUserModules,
  ICategoryData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { useQuasar } from 'quasar';
import { isPosError } from 'src/utils';
import { changeCategoryStatus, categoryListApi } from 'src/services';
const router = useRouter();
const $q = useQuasar();
const selectedCategory = ref<string>('');
const selectedRowData = ref<ICategoryData | null>(null);
const isCategoryStatusModalVisible = ref(false);
const pageTitle = getRoleModuleDisplayName(EUserModules.CategoryManagement);
const isCategoryModalVisible = ref<boolean>(false);
const categoryData = ref<ICategoryData[]>([]);
const CategoryAction = ref<string>('');
const selectedStatus = ref('');
const isLoading = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
onMounted(() => {
  getCategoryList();
});
const getCategoryList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (isLoading.value) return;
  isLoading.value = true;

  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await categoryListApi({
      pageNumber: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    });
    if (res?.data) {
      categoryData.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
    let message = 'There was an error fetching the Category list';
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
const onEditButtonClick = (row: ICategoryData) => {
  selectedCategory.value = row.name;
  CategoryAction.value = 'Edit';
  isCategoryModalVisible.value = true;
};
const handleShowEditStatusPopup = (row: ICategoryData) => {
  selectedStatus.value = row.status;
  selectedRowData.value = row;
  isCategoryStatusModalVisible.value = true;
};
const AddNewCategory = () => {
  selectedCategory.value = '';
  CategoryAction.value = 'Add';
  isCategoryModalVisible.value = true;
};
const handleManageClick = (id: number) => {
  router.push(`/category/${id}`);
};
const updateOrAddCategory = async (newName: string, callback: () => void) => {
  if (selectedRowData.value) {
    await new Promise((res) => {
      setTimeout(() => res(newName), 3000);
    });
  } else {
    await new Promise((res) => {
      setTimeout(() => res(newName), 3000);
    });
  }
  selectedRowData.value = null;
  isCategoryModalVisible.value = false;
  callback();
};
const deletingCategory = async (id: string, callback: () => void) => {
  if (selectedRowData.value) {
    try {
      await new Promise((res) => {
        setTimeout(() => res(id), 3000);
        selectedRowData.value = null;
        isCategoryModalVisible.value = false;
        $q.notify({
          message: 'The selected row is deleted successfully',
          color: 'green',
        });
      });
    } catch (e) {
      $q.notify({
        message: 'Unexpected Error',
        color: 'red',
      });
    }
    callback();
  }
};
const updatingStatus = async (updatedStatus: string) => {
  if (updatedStatus === selectedStatus.value) {
    isCategoryStatusModalVisible.value = false;
    return;
  }
  if (isLoading.value) return;
  isLoading.value = true;
  const categoryId = 1;
  try {
    const res = await changeCategoryStatus(categoryId);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      getCategoryList();
    }
  } catch (e) {
    if (isPosError(e)) {
      $q.notify({
        message: e.message,
        color: 'red',
      });
    }
  }
  isLoading.value = false;
  isCategoryStatusModalVisible.value = false;
};
</script>
