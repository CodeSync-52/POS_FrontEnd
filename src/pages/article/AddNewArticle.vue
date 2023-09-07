<template>
  <div>
    <div
      class="mb-2"
      :class="
        isUpdate ? 'grid grid-cols-1 q-gutter-md md:grid-cols-2' : 'grid-cols-1'
      "
    >
      <div class="font-medium text-lg">
        <span>{{ isUpdate ? 'Edit' : 'Add New' }} Article</span>
      </div>
      <div v-if="isUpdate" class="font-medium text-lg">
        <span>Previous Billing History</span>
      </div>
    </div>
    <div v-if="isFetching" class="flex justify-center">
      <q-spinner color="btn-primary" size="5rem" />
    </div>
    <div
      v-else
      class="q-gutter-md grid"
      :class="isUpdate ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'"
    >
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6 mt-auto">
              <span class="text-base">Article Name</span>
              <q-input
                maxlength="250"
                v-model="newArticle.name"
                label="Name"
                dense
                outlined
                color="btn-primary"
              />
            </div>
            <div class="col-12 col-md-6 q-gutter-y-sm">
              <div class="row justify-between items-end">
                <span class="text-base">Category</span>
                <q-btn
                  icon="add"
                  rounded
                  dense
                  @click="addCategory"
                  color="btn-primary"
                />
              </div>
              <q-input
                maxlength="250"
                v-model="newArticle.categoryName"
                label="category"
                dense
                readonly
                outlined
                color="btn-primary"
              />
            </div>
            <div v-if="isUpdate" class="col-12 col-md-6">
              <span class="text-base">Wholesale Price</span>
              <q-input
                v-model="newArticle.wholeSalePrice"
                dense
                :min="0"
                type="number"
                label="Wholesale Price"
                outlined
                color="btn-primary"
              />
            </div>
            <div v-if="isUpdate" class="col-12 col-md-6">
              <span class="text-base">Retail Price</span>
              <q-input
                v-model="newArticle.retailPrice"
                dense
                :min="0"
                type="number"
                label="Retail Price"
                outlined
                color="btn-primary"
              />
            </div>
            <div v-if="isUpdate" class="col-12 col-md-6">
              <span class="text-base">Cost Price</span>
              <q-input
                v-model="newArticle.costPrice"
                dense
                :min="0"
                type="number"
                label="Cost Price"
                outlined
                color="btn-primary"
              />
            </div>
            <div class="col-12 col-md-6">
              <span class="text-base">Image</span>
              <q-file
                @update:model-value="handleImageUpload"
                type="file"
                accept=".jpeg, .jpg , .png"
                dense
                :label="isUpdate ? 'Change Image' : 'Select Image'"
                outlined
                v-model="newArticle.productImage"
                :rules="[checkFile]"
                clearable
                color="btn-primary"
              />
              <div
                v-if="imagePreview"
                class="min-w-[120px] max-w-[120px] h-[120px] overflow-hidden relative rounded-full"
              >
                <q-btn
                  icon="close"
                  rounded
                  dense
                  flat
                  size="xs"
                  @click="removeImage"
                  class="absolute bg-signature top-0 end-0"
                />
                <img
                  class="w-full h-full object-cover"
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
                maxlength="250"
                v-model="newArticle.description"
                dense
                label="Description"
                outlined
                color="btn-primary"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="row items-center justify-end">
          <q-btn
            label="Cancel"
            color="Signature"
            class="bg-btn-cancel hover:bg-btn-cancel-hover"
            @click="cancelNewArticle"
          />
          <q-btn
            :label="isUpdate ? 'Save' : 'Add'"
            :loading="isLoading"
            :disable="
              !newArticle.name ||
              !newArticle.categoryName ||
              (isUpdate &&
                (newArticle.retailPrice < 0 ||
                  newArticle.wholeSalePrice < 0 ||
                  newArticle.costPrice < 0 ||
                  !newArticle.retailPrice ||
                  !newArticle.wholeSalePrice ||
                  !newArticle.costPrice)) ||
              isImageSizeGreater()
            "
            color="btn-primary"
            @click="isUpdate ? handleUpdateArticle() : addNewArticle()"
          />
        </q-card-actions>
      </q-card>
      <q-card v-if="isUpdate">
        <q-card-section>
          <q-table
            class="max-h-[400px] h-full"
            virtual-scroll
            v-if="billingHistoryRecord.length"
            :columns="billingHistoryColumn"
            hide-bottom
            :rows="billingHistoryRecord"
          >
            <template v-slot:body-cell-name="props">
              <q-td
                :props="props"
                class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
              >
                {{ props.row.fullName }}
              </q-td>
            </template>
          </q-table>
          <div v-else class="text-center">
            <span>There is nothing to show</span>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="isCategoryModalVisible">
      <article-category-modal @category-selected="handleSelectedCategory" />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  newArticleApi,
  articleDetailApi,
} from 'src/services/article-management';
import ArticleCategoryModal from 'src/components/article-management/ArticleCategoryModal.vue';
import { INewArticleData } from 'src/interfaces/article-management';
import { isPosError, billingHistoryColumn } from 'src/utils';
import { useQuasar } from 'quasar';
import { IBillingHistoryResponse } from 'src/interfaces';
import { updateProductApi, billingHistoryApi } from 'src/services';
const router = useRouter();
const isCategoryModalVisible = ref(false);
const isLoading = ref(false);
const checkFile = (value: File) => {
  if (value) {
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    const isValidFormat = allowedFormats.includes(value.type);
    if (!isValidFormat) {
      return 'Invalid file format. Only jpeg, jpg, and png allowed.';
    }
    const isValidSize = value.size <= 0.5 * 1024 * 1024;
    if (!isValidSize) {
      return 'Selected file must be less than or equal to 0.5MB';
    }
  }
  return true;
};
const $q = useQuasar();
const imagePreview = ref('');
const imageData = ref('');
const defaultArticleValue: INewArticleData = {
  categoryId: -1,
  categoryName: '',
  costPrice: 0,
  description: '',
  masterStock: 0,
  name: '',
  productId: -1,
  productImage: null,
  retailPrice: 0,
  status: 'InActive',
  wholeSalePrice: 0,
};
const isUpdate = ref(false);
const isFetching = ref(false);
const route = router.currentRoute.value;
const newArticle = ref(defaultArticleValue);
const billingHistoryRecord = ref<IBillingHistoryResponse[]>([]);
onMounted(() => {
  if (route.fullPath.includes('update')) {
    isUpdate.value = true;
    getArticleDetail(Number(route.params.id));
    getArticleBillingHistory(Number(route.params.id));
  } else {
    isUpdate.value = false;
  }
});
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
  newArticle.value.categoryName = selectedCategory.categoryName;
  newArticle.value.categoryId = selectedCategory.categoryId;
  isCategoryModalVisible.value = false;
};
const isImageSizeGreater = () => {
  if (newArticle.value.productImage) {
    if (newArticle.value.productImage.size > 0.5 * 1024 * 1024) {
      return true;
    }
  }
  return false;
};
const handleImageUpload = (file: File | null) => {
  if (imagePreview.value !== '') {
    URL.revokeObjectURL(imagePreview.value);
    if (isUpdate.value && imageData.value) {
      imagePreview.value = getImageUrl(imageData.value) || '';
    } else {
      imagePreview.value = '';
    }
  }
  if (file) {
    const url = URL.createObjectURL(file);
    imagePreview.value = url;
  }
};
const getImageUrl = (base64Image: string | null) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
};
async function addNewArticle() {
  if (isLoading.value) return;

  isLoading.value = true;
  let base64Image = '';
  try {
    const { productImage, categoryId, name, description } = newArticle.value;
    if (productImage) {
      base64Image = await convertToBase64(productImage);
    }
    const res = await newArticleApi({
      categoryId,
      name,
      description,
      image: base64Image,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      router.push('/article');
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
}
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result && typeof fileReader.result === 'string') {
        const resultParts = fileReader.result.split(',');
        if (resultParts.length === 2) {
          resolve(resultParts[1]);
        } else {
          reject(new Error('Invalid data URL format'));
        }
      }
    };

    fileReader.onerror = (error) => {
      reject(error);
    };

    fileReader.readAsDataURL(file);
  });
};
const getArticleDetail = async (productId: number) => {
  if (isFetching.value) return;
  isFetching.value = true;
  try {
    const res = await articleDetailApi(productId);
    if (res.type === 'Success') {
      newArticle.value = { ...res.data, productImage: null };
      const previewUrl = getImageUrl(res.data.productImage);
      if (res.data.productImage) {
        imageData.value = res.data.productImage;
      }
      if (previewUrl) {
        imagePreview.value = previewUrl;
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Fetching Article Details';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
  isFetching.value = false;
};
function removeImage() {
  imagePreview.value = '';
  imageData.value = '';
  newArticle.value.productImage = null;
}
const handleUpdateArticle = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let base64Image;
  const productId = Number(route.params.id);
  const {
    name,
    description,
    categoryId,
    productImage,
    wholeSalePrice,
    retailPrice,
    costPrice,
  } = newArticle.value;

  if (productImage) {
    base64Image = await convertToBase64(productImage);
  } else if (imageData.value) {
    base64Image = imageData.value;
  }
  try {
    const res = await updateProductApi({
      productId,
      description,
      categoryId,
      image: base64Image,
      wholeSalePrice,
      retailPrice,
      costPrice,
      name,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      router.push('/article');
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
const getArticleBillingHistory = async (productId: number) => {
  try {
    const res = await billingHistoryApi(productId);
    if (res.type === 'Success') {
      billingHistoryRecord.value = res.data;
    }
  } catch (e) {
    let message = 'Unexpected Error Fetching Billing History';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
};
</script>
