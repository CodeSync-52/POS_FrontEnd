<template>
  <div class="">
    <div class="text-xl text-center md:text-left font-medium mb-4">
      <span>Add New Receipt</span>
    </div>
    <q-card>
      <q-card-section class="q-gutter-y-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6 mt-auto">
            <span class="text-base">User Id</span>
            <q-input
              v-model="newReceipt.userId"
              min="1"
              type="number"
              label="User Id"
              dense
              outlined
            />
          </div>
          <div class="col-12 col-md-6">
            <div class="q-gutter-y-xs">
              <div class="row justify-between items-end">
                <span class="text-base">Article</span>
                <q-btn icon="add" rounded dense @click="handleSelectArticle" />
              </div>
              <q-input
                v-model="newReceipt.selectedArticle"
                readonly
                label="Article"
                dense
                outlined
              />
            </div>
          </div>
        </div>
        <!-- <q-table
          tabindex="0"
          :row="selectedArticleData"
          row-key="articleId"
          :columns="selectedArticleColumn"
        /> -->
      </q-card-section>
      <q-card-actions class="row items-center justify-end">
        <q-btn label="Cancel" color="btn-secondary" @click="cancelNewReceipt" />
        <q-btn label="Save" :loading="isLoading" color="btn-primary" />
      </q-card-actions>
    </q-card>
    <q-dialog v-model="isArticleListModalVisible">
      <article-list-modal />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ArticleListModal from 'src/components/receipt-management/ArticleListModal.vue';
// import { ISelectedArticleData } from 'src/interfaces';
// import { selectedArticleColumn } from 'src/utils';
// import { isPosError } from 'src/utils';
// import { useQuasar } from 'quasar';
const router = useRouter();
const isLoading = ref(false);
const isArticleListModalVisible = ref(false);
const handleSelectArticle = () => {
  isArticleListModalVisible.value = true;
};
// const selectedArticleData = ref<ISelectedArticleData[]>([]);
// const $q = useQuasar();
const newReceipt = ref({
  userId: null,
  selectedArticle: '',
  selectedArticleId: -1,
});
const cancelNewReceipt = () => {
  router.push('/receipt');
};
</script>
