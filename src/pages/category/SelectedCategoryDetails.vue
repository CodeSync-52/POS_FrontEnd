<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-start mb-4"
    >
      <span class="text-xl font-medium"
        >{{ pageTitle }} : {{ selectedGroupName }}</span
      >
      <q-btn
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary text-signature"
        @click="addNewCategory"
      />
    </div>
    <div class="py-4">
      <q-table
        :loading="isLoading"
        :rows="categoryDetailsRecord"
        :columns="categoryDetailsColumn"
        row-key="name"
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
        :variant="category"
        :category-action="categoryAction"
        @name-changed="updateOrAddCategory"
        @delete-record="deletingCategory"
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
import { subcategoryListApi } from 'src/services';
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
    let message = 'There was an error fetching the Subcategory list';
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
const category = ref<{ fullName: string; label: string; id: string }>({
  fullName: '',
  label: '',
  id: '',
});
const selectedRowData = ref<ICategoryDetailsData | null>(null);
const addNewCategory = () => {
  categoryAction.value = 'Add';
  category.value.fullName = '';
  category.value.label = '';
  isCategoryDetailsModalVisible.value = true;
};
const editCategory = (selectedRow: ICategoryDetailsData) => {
  selectedRowData.value = selectedRow;
  category.value.fullName = selectedRow.name;
  // category.value.label = selectedRow.label;
  categoryAction.value = 'Edit';
  isCategoryDetailsModalVisible.value = true;
};
const updateOrAddCategory = async (
  newName: string,
  newLabel: string,
  callback: () => void
) => {
  if (selectedRowData.value) {
    await new Promise((res) => {
      setTimeout(() => res({ newName, newLabel }), 3000);
    });
  } else {
    await new Promise((res) => {
      setTimeout(() => res({ newName, newLabel }), 3000);
    });
  }
  selectedRowData.value = null;
  isCategoryDetailsModalVisible.value = false;
  callback();
};
const deletingCategory = async (id: string, callback: () => void) => {
  if (selectedRowData.value) {
    try {
      await new Promise((res) => {
        setTimeout(() => res(id), 3000);
        selectedRowData.value = null;
        isCategoryDetailsModalVisible.value = false;
        $q.notify({
          message: 'The selected variant is deleted successfully',
          color: 'green',
        });
      });
      callback();
    } catch (e) {
      $q.notify({
        message: 'Unexpected Error',
        color: 'red',
      });
    }
  }
};
</script>
