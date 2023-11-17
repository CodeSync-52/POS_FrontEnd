<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-6"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>
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
    <div class="">
      <q-table
        tabindex="0"
        :loading="isLoading"
        :rows="filteredRows"
        :filter="filter"
        :columns="categoryColumn"
        row-key="name"
        v-model:pagination="pagination"
        @request="getCategoryList"
      >
        <template v-slot:top>
          <div
            class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4 w-full"
          >
            <div class="font-medium text-lg"><span>Category</span></div>

            <q-input
              outlined
              maxlength="250"
              dense
              debounce="300"
              color="btn-primary"
              label="Name"
              autofocus
              v-model="filter"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
        <template v-slot:body-cell-category="props">
          <q-td :props="props">
            <q-btn
              flat
              unelevated
              dense
              size="sm"
              class="hover:text-btn-primary"
              @click="handleManageClick(props.row.categoryId, props.row.name)"
              label="Manage"
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
              class="hover:text-btn-primary"
              :label="props.row.status"
              @click="handleShowEditStatusPopup(props.row)"
              ><q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                Edit Status
              </q-tooltip></q-btn
            >
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
                class="hover:text-btn-primary !px-[5px]"
                @click="onEditButtonClick(props.row)"
                ><q-tooltip class="bg-black" :offset="[10, 10]">
                  Edit Category
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
        <template v-slot:body-cell-group="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.name }}
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
import { ref, onMounted, watch } from 'vue';
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
const filter = ref('');
const isLoading = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const filteredRows = ref<ICategoryData[]>([]);
const filterChanged = ref(false);
function setFilteredData() {
  filterChanged.value = true;
  filteredRows.value = categoryData.value.filter((row) =>
    row.name.toLowerCase().includes(filter.value.toLowerCase().trim())
  );
  setTimeout(() => {
    filterChanged.value = false;
  }, 200);
}
watch(filter, setFilteredData);
watch(categoryData, setFilteredData);
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
const handleManageClick = (id: number, name: string) => {
  router.push(`/category/${name}/${id}`);
};
const updateOrAddCategory = async (
  newName: string,
  action: string,
  callback: () => void
) => {
  if (action === 'Edit' && selectedRowData.value?.name === newName) {
    callback();
    isCategoryModalVisible.value = false;
    return;
  }
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
  if (filterChanged.value) return;
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
