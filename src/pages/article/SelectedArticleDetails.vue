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
            <q-input
              type="file"
              v-model="newArticle.image"
              accept=".jpeg, .jpg , .png"
              dense
              outlined
              :rules="[checkFile]"
            />
            <div class="w-[20px] h-[20px]">
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Image Preview"
              />
            </div>
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
        />
        <!-- @click="addNewArticle" -->
      </q-card-actions>
    </q-card>
    <q-dialog v-model="isCategoryModalVisible">
      <article-category-modal @category-selected="handleSelectedCategory" />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import { isPosError } from 'src/utils';
// import { useQuasar } from 'quasar';
// import { newArticleApi } from 'src/services/article-management';
import ArticleCategoryModal from 'src/components/article-management/ArticleCategoryModal.vue';
const router = useRouter();
// const $q = useQuasar();
const isCategoryModalVisible = ref(false);
const isLoading = ref(false);
const defaultArticleValue = {
  name: 'f',
  category: 'f',
  image: '',
  description: '',
  categoryId: -1,
};
// interface IImage{
//   file:IImageFileInfo,
//   length:number
// }
// interface IImageFileInfo{
//   name:string,
//   lastModified:number,
//   size:number,
//   type:string,
//   webkitRelativePath:string,
//   lastModifiedDate:()=>void
// }
const checkFile = (value: any) => {
  if (value[0]) {
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    const isValidFormat = allowedFormats.includes(value[0].type);
    if (!isValidFormat) {
      return 'Invalid file format. Only jpeg, jpg, and png allowed.';
    }
    const isValidSize = value[0].size <= 2 * 1024 * 1024;
    if (!isValidSize) {
      return 'Selected file must be less than or equal to 2MB';
    }
  }
  return true;
};
interface INewArticleData {
  name: string;
  category: string;
  image: any;
  description: string;
  categoryId: number;
}
const imagePreview = ref('');
const newArticle = ref<INewArticleData>(defaultArticleValue);
const addCategory = () => {
  isCategoryModalVisible.value = true;
};
const cancelNewArticle = () => {
  newArticle.value = defaultArticleValue;
  router.push('/article');
};
const handleSelectedCategory = (selectedCategory: {
  categoryName: string;
  categoryId: number;
}) => {
  newArticle.value.category = selectedCategory.categoryName;
  newArticle.value.categoryId = selectedCategory.categoryId;
  isCategoryModalVisible.value = false;
};
// watch(newArticle.value.image,(newImage)=>{
//   debugger
//   if(newImage && newImage[0]){
//     imagePreview.value = URL.createObjectURL(newImage[0])
//   }else{
//     imagePreview.value = ''
//   }
// })
// async function addNewArticle() {
//   if (isLoading.value) return;
//   isLoading.value = true;
//   try {
//     const { image, categoryId, name, description } = newArticle.value;
//     const base64Image = await convertToBase64(image[0]);
//     const res = await newArticleApi({
//       categoryId,
//       name,
//       description,
//       image: base64Image,
//     });
//     if (res.type === 'Success') {
//       $q.notify({
//         message: res.message,
//         color: 'green',
//       });
//       router.push('/article');
//     }
//   } catch (e) {
//     let message = 'Unexpected Error Occurred';
//     if (isPosError(e)) {
//       message = e.message;
//     }
//     $q.notify({
//       message,
//       color: 'red',
//       icon: 'error',
//     });
//   }
//   isLoading.value = false;
// }
// const convertToBase64 = (file: any) => {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.onload = () => {
//       if (fileReader.result) {
//         resolve(fileReader.result.split(',')[1]);
//       }
//     };
//     fileReader.onerror = reject;
//     fileReader.readAsDataURL(file);
//   });
// };
</script>
