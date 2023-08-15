<template>
  <div class="p-4">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6 mt-auto">
            <span class="text-base">Article Name</span>
            <q-input v-model="newArticle.name" label="Name" dense outlined />
          </div>
          <div class="col-12 col-md-6 q-gutter-y-sm">
            <div class="row justify-between items-end">
              <span class="text-base">Category</span>
              <q-btn icon="add" rounded dense @click="addCategory" />
            </div>
            <q-input
              v-model="newArticle.category"
              label="category"
              dense
              readonly
              outlined
            />
          </div>
          <div class="col-12 col-md-6">
            <span class="text-base">Image</span>
            <q-input type="file" v-model="newArticle.image" dense outlined />
          </div>
          <div class="col-12 col-md-6">
            <span class="text-base">Description</span>
            <q-input
              type="textarea"
              autogrow
              v-model="newArticle.description"
              dense
              label="Description"
              outlined
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="row items-center justify-end">
        <q-btn label="Cancel" color="btn-secondary" @click="cancelNewArticle" />
        <q-btn
          label="Save"
          :loading="isLoading"
          :disable="!newArticle.name || !newArticle.category"
          color="btn-primary"
          @click="handleAddNewArticle"
        />
      </q-card-actions>
    </q-card>
    <q-dialog v-model="isCategoryModalVisible">
      <article-category-modal
        :category="newArticle.category"
        @category-selected="handleSelectedCategory"
      />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import { isPosError } from 'src/utils';
// import { useQuasar } from 'quasar';
import ArticleCategoryModal from 'src/components/article-management/ArticleCategoryModal.vue';
const router = useRouter();
// const $q = useQuasar()
const isCategoryModalVisible = ref(false);
const isLoading = ref(false);
const defaultArticleValue = {
  name: '',
  category: 'f',
  image: '',
  description: '',
};
const newArticle = ref(defaultArticleValue);
const addCategory = () => {
  isCategoryModalVisible.value = true;
};
const cancelNewArticle = () => {
  newArticle.value = defaultArticleValue;
  router.push('/article');
};
const handleAddNewArticle = () => {
  console.log(newArticle.value);
};
const handleSelectedCategory = (
  selectedCategory: { category: string; categoryID: number },
  parentCategoryID: number
) => {
  console.log(selectedCategory, parentCategoryID);
  newArticle.value.category = selectedCategory.category;
  isCategoryModalVisible.value = false;
};
// async addNewArticle(){
//   if(isLoading.value) return
//   isLoading.value = true
//   try{
//     const res = await
//     if(res.type ==='Success'){
//       $q.notify({
//         message:res.message,
//         color:'green'
//       })
//     router.push('/article')
//     }
//   }
//   catch(e){
//     let message = 'Unexpected Error Occurred'
//     if(isPosError(e)){
//       message = e.message
//     }
//     $q.notify({
//       message,
//       color:'red',
//       icon:'error'
//   })
//   }
//   isLoading.value = false
// }
</script>
