<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }} Details</span>
      <q-btn
        label="Add New"
        unelevated
        icon="add"
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary text-signature"
        @click="addNewCategory"
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.CategoryManagement,
            EActionPermissions.Create
          )
        "
      />
    </div>
    <div class="py-4">
      <q-table
        tabindex="0"
        :loading="isLoading"
        :rows="filteredRows"
        :columns="categoryDetailsColumn"
        :filter="filter"
        row-key="name"
        v-model:pagination="pagination"
        @request="getCategoryDetailsList"
      >
        <template v-slot:top>
          <div class="font-medium text-lg"><span>Category Details</span></div>
          <q-space />
          <q-input
            maxlength="250"
            outlined
            dense
            debounce="300"
            color="btn-primary"
            label="Name"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
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
                class="hover:text-btn-primary"
                @click="editCategory(props.row)"
                ><q-tooltip class="bg-black" :offset="[10, 10]">
                  Edit Category Details
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
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
          <q-th> </q-th>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn
              unelevated
              flat
              :label="props.row.status"
              dense
              size="sm"
              class="hover:text-btn-primary"
              @click="handleStatusModalPopup(props.row)"
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
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.CategoryManagement,
              EActionPermissions.Delete
            )
          "
        >
          <q-th> </q-th>
        </template>
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
        <template v-slot:body-cell-name="props">
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
      v-model="isCategoryDetailsModalVisible"
    >
      <category-details-modal
        :category="category"
        :category-action="categoryAction"
        @name-changed="updateOrAddCategory"
      />
    </q-dialog>

    <q-dialog v-model="isCategoryDetailsStatusModalVisible">
      <category-status-modal
        :selected-status="selectedStatus"
        @updated-status="updatingStatus"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import CategoryDetailsModal from 'src/components/category-management/CategoryDetailsModal.vue';
import CategoryStatusModal from 'src/components/category-management/CategoryStatusModal.vue';
import {
  EActionPermissions,
  EUserModules,
  ICategoryDetailsData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { categoryDetailsColumn } from 'src/pages/category/utils';
import {
  createSubcategory,
  subcategoryListApi,
  changeCategoryStatus,
  updateCategory,
} from 'src/services';
import { isPosError } from 'src/utils';
import { useAuthStore } from 'src/stores';
const pageTitle = getRoleModuleDisplayName(EUserModules.CategoryManagement);
const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const filter = ref('');
onMounted(() => {
  getCategoryDetailsList();
});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const isLoading = ref(false);
const isCategoryDetailsStatusModalVisible = ref(false);
const selectedStatus = ref('');
const isCategoryDetailsModalVisible = ref<boolean>(false);
const categoryDetailsRecord = ref<ICategoryDetailsData[]>([]);
const selectedGroupName = router.currentRoute.value.params.id;
const categoryAction = ref<string>('');
const category = ref<{ name: string; id: number }>({
  name: '',
  id: -1,
});
const selectedRowData = ref<ICategoryDetailsData | null>(null);
const filteredRows = ref<ICategoryDetailsData[]>([]);
const filterChanged = ref(false);
function setFilteredData() {
  filterChanged.value = true;
  filteredRows.value = categoryDetailsRecord.value.filter((row) =>
    row.name.toLowerCase().includes(filter.value.toLowerCase().trim())
  );
  setTimeout(() => {
    filterChanged.value = false;
  }, 200);
}
watch(filter, setFilteredData);
watch(categoryDetailsRecord, setFilteredData);
const getCategoryDetailsList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (filterChanged.value) return;
  if (isLoading.value) return;
  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await subcategoryListApi({
      parentCategory: Number(selectedGroupName),
      pageNumber: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    });
    if (res?.data) {
      categoryDetailsRecord.value = res.data.items;
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
const handleStatusModalPopup = (selectedRow: ICategoryDetailsData) => {
  selectedRowData.value = selectedRow;
  selectedStatus.value = selectedRow.status;
  isCategoryDetailsStatusModalVisible.value = true;
};
const updatingStatus = async (updatedStatus: string, callback: () => void) => {
  if (updatedStatus === selectedRowData.value?.status) {
    isCategoryDetailsStatusModalVisible.value = false;
    return;
  }
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await changeCategoryStatus(
      selectedRowData.value?.categoryId ?? -1
    );
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      if (selectedRowData.value) {
        selectedRowData.value.status = updatedStatus;
        if (categoryDetailsRecord.value) {
          const matchingRows = categoryDetailsRecord.value.findIndex(
            (row) => selectedRowData.value?.categoryId === row.categoryId
          );
          if (matchingRows !== -1) {
            const newList = [...categoryDetailsRecord.value];
            newList[matchingRows].status = updatedStatus;
            categoryDetailsRecord.value = newList;
          }
        }
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message: message,
      color: 'red',
      icon: 'error',
    });
  }
  callback();
  isLoading.value = false;
  isCategoryDetailsStatusModalVisible.value = false;
};
const addNewCategory = () => {
  categoryAction.value = 'Add';
  category.value.name = '';
  category.value.id = -1;
  isCategoryDetailsModalVisible.value = true;
};
const editCategory = (selectedRow: ICategoryDetailsData) => {
  selectedRowData.value = selectedRow;
  category.value.name = selectedRow.name;
  category.value.id = selectedRow.categoryId;
  categoryAction.value = 'Edit';
  isCategoryDetailsModalVisible.value = true;
};
const updateOrAddCategory = async (
  name: string,
  categoryId: number,
  callback: () => void
) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    let res;
    if (categoryId != -1 && isCategoryDetailsModalVisible) {
      if (name === selectedRowData.value?.name) {
        callback();
        isCategoryDetailsModalVisible.value = false;
        isLoading.value = false;
        return;
      }
      res = await updateCategory({
        categoryId,
        name,
      });
    } else {
      res = await createSubcategory({
        name,
        parentCategoryId: Number(selectedGroupName),
      });
    }

    if (res.type === 'Success') {
      $q.notify({ message: res.message, color: 'green' });
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
  selectedRowData.value = null;
  callback();
  isLoading.value = false;
  isCategoryDetailsModalVisible.value = false;
  getCategoryDetailsList();
};
</script>
