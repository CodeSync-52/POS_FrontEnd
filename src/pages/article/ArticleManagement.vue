<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.ArticleManagement,
            EActionPermissions.Create
          )
        "
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary text-signature hover:bg-btn-secondary"
        @click="AddNewArticle"
      />
    </div>
    <div class="py-4">
      <q-table
        tabindex="0"
        :loading="isLoading"
        :rows="ArticleData"
        :columns="ArticleColumn"
        row-key="name"
        v-model:pagination="pagination"
      >
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.ArticleManagement,
              EActionPermissions.Update
            ) &&
            authStore.checkUserHasPermission(
              EUserModules.ArticleManagement,
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
              @click="handleEditStatePopup(props.row)"
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
              EUserModules.ArticleManagement,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.ArticleManagement,
              EActionPermissions.Delete
            )
          "
        >
          <q-th></q-th>
        </template>
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.ArticleManagement,
              EActionPermissions.Update
            ) &&
            authStore.checkUserHasPermission(
              EUserModules.ArticleManagement,
              EActionPermissions.Delete
            )
          "
          v-slot:body-cell-action="props"
        >
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn size="sm" flat unelevated dense icon="edit" />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
  <!-- <q-dialog v-model="isArticleStatusModalVisible">
  <article-status-modal
    :selected-status="selectedStatus"
    @updated-status="updatingStatus"
  />
</q-dialog> -->
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import {
  EActionPermissions,
  EUserModules,
  getRoleModuleDisplayName,
} from 'src/interfaces';
// import ArticleStatusModal from 'src/components/article-management/ArticleStatusModal.vue'
import { useAuthStore } from 'src/stores';
import { IArticleData } from 'src/interfaces';
import { ArticleColumn, ArticleRow } from 'src/utils';
const authStore = useAuthStore();
const router = useRouter();
const selectedStatus = ref('');
const selectedRowData = ref<IArticleData | null>(null);
const isArticleStatusModalVisible = ref(false);
const pageTitle = getRoleModuleDisplayName(EUserModules.ArticleManagement);
const ArticleData = ref<IArticleData[]>(ArticleRow);
const isLoading = ref(false);
const handleEditStatePopup = (row: IArticleData) => {
  selectedStatus.value = row.status;
  selectedRowData.value = row;
  isArticleStatusModalVisible.value = true;
};
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const AddNewArticle = () => {
  router.push('/article/1');
};
// const updatingStatus = async (updatedStatus: string, callback: () => void) => {
//   if (updatedStatus === selectedStatus.value) {
//     isArticleStatusModalVisible.value = false;
//     return;
//   }
//   if (isLoading.value) return;
//   isLoading.value = true;
// }
</script>
