<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center sm:items-start mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }} Details</span>
      <q-btn
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary text-signature"
        @click="addNewCategory"
      />
    </div>
    <div class="py-4">
      <q-table
        tabindex="0"
        :loading="isLoading"
        :rows="categoryDetailsRecord"
        :columns="categoryDetailsColumn"
        row-key="name"
        v-model:pagination="pagination"
        @request="getCategoryDetailsList"
      >
        <template v-slot:body-cell-action="props">
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                icon="edit"
                @click="editCategory(props.row)"
              />
            </div>
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
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import CategoryDetailsModal from 'src/components/category-management/CategoryDetailsModal.vue';
import {
  EUserModules,
  ICategoryDetailsData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { categoryDetailsColumn } from 'src/pages/category/utils';
import { useQuasar } from 'quasar';
import { createSubcategory, subcategoryListApi } from 'src/services';
import { isPosError } from 'src/utils';
const pageTitle = getRoleModuleDisplayName(EUserModules.CategoryManagement);
const router = useRouter();
const $q = useQuasar();
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
const getCategoryDetailsList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
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
const isCategoryDetailsModalVisible = ref<boolean>(false);
const categoryDetailsRecord = ref<ICategoryDetailsData[]>([]);
const selectedGroupName = router.currentRoute.value.params.id;
const categoryAction = ref<string>('');
const category = ref<{ name: string; id: number }>({
  name: '',
  id: -1,
});
const selectedRowData = ref<ICategoryDetailsData | null>(null);
const addNewCategory = () => {
  categoryAction.value = 'Add';
  category.value.name = '';
  isCategoryDetailsModalVisible.value = true;
};
const editCategory = (selectedRow: ICategoryDetailsData) => {
  selectedRowData.value = selectedRow;
  category.value.name = selectedRow.name;
  categoryAction.value = 'Edit';
  isCategoryDetailsModalVisible.value = true;
};
const updateOrAddCategory = async (
  parentCategoryId: number,
  name: string,
  callback: () => void
) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await createSubcategory({
      name,
      parentCategoryId: Number(selectedGroupName),
    });
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
