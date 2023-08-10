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
        :rows="categoryData"
        :columns="categoryColumn"
        row-key="name"
      >
        <template v-slot:body-cell-category="props">
          <q-td :props="props">
            <q-btn
              flat
              unelevated
              dense
              size="sm"
              @click="handleManageClick(props.row.group)"
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
              <q-btn
                size="sm"
                dense
                flat
                unelevated
                icon="delete"
                color="red"
                @click="handleDeleteCategory(props.row)"
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
        :selected-row="selectedRowData?.id"
        @delete-record="deletingCategory"
      />
    </q-dialog>
    <q-dialog v-model="isCategoryStatusModalVisible">
      <!-- <category-status-modal
        :selected-status="selectedStatus"
        @updated-status="updatingStatus"
      /> -->
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CategoryManagementModal from 'src/components/category-management/CategoryManagementModal.vue';
// import CategoryStatusModal from 'src/components/category-management/CategoryStatusModal.vue';
import { categoryColumn, categoryRows } from 'src/pages/category/utils';
import {
  EUserModules,
  ICategoryData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { useQuasar } from 'quasar';
// import { isPosError } from 'src/utils';
const router = useRouter();
const $q = useQuasar();
const selectedCategory = ref<string>('');
const selectedRowData = ref<ICategoryData | null>(null);
const isCategoryStatusModalVisible = ref(false);
const pageTitle = getRoleModuleDisplayName(EUserModules.CategoryManagement);
const isCategoryModalVisible = ref<boolean>(false);
const categoryData = ref(categoryRows);
const CategoryAction = ref<string>('');
const selectedStatus = ref('');
// const isLoading = ref(false)
const onEditButtonClick = (row: ICategoryData) => {
  selectedCategory.value = row.group;
  CategoryAction.value = 'Edit';
  isCategoryModalVisible.value = true;
};
const handleShowEditStatusPopup = (row: ICategoryData) => {
  selectedStatus.value = row.status;
  isCategoryStatusModalVisible.value = true;
};
const AddNewCategory = () => {
  selectedCategory.value = '';
  CategoryAction.value = 'Add';
  isCategoryModalVisible.value = true;
};
const handleManageClick = (id: string) => {
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
const handleDeleteCategory = (selectedRow: ICategoryData) => {
  CategoryAction.value = 'Delete';
  selectedRowData.value = selectedRow;
  isCategoryModalVisible.value = true;
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
// const updatingStatus = async (updatedStatus: string) => {
//   if(isLoading.value) return
//   isLoading.value = true
//   try{
//     const res = await
//     if (res.type === 'Success'){
//       $q.notify({
//         message:res.message,
//         color:'green'
//       })
//     }
//   }catch(e){
//     if(isPosError(e)){
//       $q.notify({
//         message:e.message,
//         color:'red'
//       })
//     }
//   }
//   isLoading.value = false
// };
</script>
