<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4 mt-2"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.CategoryManagement,
            EActionPermissions.Create
          )
        "
        label="Add New"
        unelevated
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
              class="hover:text-btn-primary"
              :disable="
                !authStore.checkUserHasPermission(
                  EUserModules.CategoryManagement,
                  EActionPermissions.View
                )
              "
            />
          </q-td>
        </template>
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.CategoryManagement,
              EActionPermissions.Update
            ) &&
            authStore.checkUserHasPermission(
              EUserModules.CategoryManagement,
              EActionPermissions.Delete
            )
          "
          v-slot:body-cell-status="props"
        >
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

        <template
          v-slot:header-cell-status
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.CategoryManagement,
              EActionPermissions.View
            )
          "
        >
          <q-th></q-th>
        </template>
        <template
          v-slot:header-cell-action
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.CategoryManagement,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.CategoryManagement,
              EActionPermissions.Delete
            )
          "
        >
          <q-th></q-th>
        </template>
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.CategoryManagement,
              EActionPermissions.Update
            ) &&
            authStore.checkUserHasPermission(
              EUserModules.CategoryManagement,
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
import { useQuasar } from 'quasar';
import CategoryManagementModal from 'src/components/category-management/CategoryManagementModal.vue';
import CategoryStatusModal from 'src/components/category-management/CategoryStatusModal.vue';
import { categoryColumn } from 'src/pages/category/utils';
import {
  EActionPermissions,
  EUserModules,
  ICategoryData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { isPosError } from 'src/utils';
import {
  changeCategoryStatus,
  categoryListApi,
  createCategory,
  updateCategory,
} from 'src/services';
import { useAuthStore } from 'src/stores';
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
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
const onEditButtonClick = (row: ICategoryData) => {
  selectedCategory.value = row.name;
  selectedRowData.value = row;
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
const updateOrAddCategory = async (
  newName: string,
  action: string,
  callback: () => void
) => {
  if (isLoading.value) return;
  isLoading.value = true;
  if (action === 'Edit' && selectedRowData.value) {
    try {
      const res = await updateCategory({
        categoryId: selectedRowData.value?.categoryId,
        name: newName,
      });
      if (res.type === 'Success') {
        $q.notify({
          message: res.message,
          color: 'green',
        });
        if (selectedRowData.value) {
          selectedRowData.value.name = newName;
        }
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
  } else {
    try {
      const res = await createCategory(newName);
      if (res.type === 'Success') {
        $q.notify({
          message: res.message,
          color: 'green',
        });
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
  }
  isLoading.value = false;
  callback();
  isCategoryModalVisible.value = false;
  if (action !== 'Edit') {
    getCategoryList();
  }
  selectedRowData.value = null;
};
const updatingStatus = async (updatedStatus: string, callback: () => void) => {
  if (updatedStatus === selectedStatus.value) {
    isCategoryStatusModalVisible.value = false;
    return;
  }
  if (isLoading.value) return;
  isLoading.value = true;
  if (selectedRowData?.value) {
    try {
      const res = await changeCategoryStatus(
        selectedRowData?.value?.categoryId
      );
      if (res.type === 'Success') {
        $q.notify({
          message: res.message,
          color: 'green',
        });
        if (selectedStatus.value === 'Active' && selectedRowData.value) {
          selectedRowData.value.status = 'InActive';
        } else if (
          selectedStatus.value === 'InActive' &&
          selectedRowData.value
        ) {
          selectedRowData.value.status = 'Active';
        }
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
  }
  callback();
  isLoading.value = false;
  isCategoryStatusModalVisible.value = false;
};
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
</script>
