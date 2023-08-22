<template>
  <q-card class="">
    <q-card-section>
      <div class="text-h6 row justify-between q-mb-md">
        <span> Edit Article</span>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-input v-model="articleInfo.name" dense label="Name" outlined />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="articleInfo.description"
            dense
            label="Description"
            outlined
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-file
            @update:model-value="handleImageUpload"
            v-model="articleInfo.productImage"
            dense
            label="Select Image"
            clearable
            outlined
            :rules="[checkFile]"
          />
          <div
            v-if="imagePreview && articleInfo.productImage"
            class="w-[60px] h-[32px] mt-1 overflow-hidden"
          >
            <img
              class="w-100 h-100 object-cover"
              :src="imagePreview"
              alt="Image Preview"
            />
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="articleInfo.wholeSalePrice"
            type="number"
            dense
            label="Wholesale Price"
            outlined
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="articleInfo.retailPrice"
            type="number"
            dense
            label="Retail Price"
            outlined
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="articleInfo.costPrice"
            type="number"
            dense
            label="Cost Price"
            outlined
          />
        </div>
        <div class="col-12 col-sm-6">
          <div class="col-12 col-md-6 q-gutter-y-sm">
            <div class="row justify-between items-end">
              <span class="text-base">Category</span>
              <q-btn
                icon="add"
                rounded
                dense
                @click="isCategoryModalVisible = true"
              />
            </div>
            <q-input
              v-model="articleInfo.categoryName"
              label="category"
              dense
              readonly
              outlined
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="row justify-end">
      <q-btn label="Close" color="btn-secondary" v-close-popup />
      <q-btn
        label="Save"
        color="btn-primary"
        :disable="!articleInfo.name || isImageSizeGreater()"
        @click="handleUpdateArticle"
      />
    </q-card-actions>
    <q-dialog v-model="isCategoryModalVisible">
      <article-category-modal @category-selected="handleSelectedCategory" />
    </q-dialog>
  </q-card>
</template>
<script lang="ts" setup>
import ArticleCategoryModal from './ArticleCategoryModal.vue';
import { IArticleData, IArticleInfo } from 'src/interfaces';
import { ref, onMounted } from 'vue';
interface IProps {
  selectedRow: IArticleData | null;
}

const imagePreview = ref('');
const isLoading = ref(false);
const isCategoryModalVisible = ref(false);
const emit = defineEmits<{
  (
    event: 'update-article',
    updatedData: IArticleInfo,
    callback: () => void
  ): void;
}>();
const props = withDefaults(defineProps<IProps>(), {
  selectedRow: null,
});
const articleInfo = ref<IArticleInfo>({
  categoryName: '',
  categoryId: -1,
  costPrice: 0,
  description: '',
  name: '',
  productImage: null,
  retailPrice: 0,
  wholeSalePrice: 0,
});
onMounted(() => {
  if (props.selectedRow) {
    articleInfo.value.categoryName = props.selectedRow.categoryName;
    articleInfo.value.categoryId = props.selectedRow.categoryId;
    articleInfo.value.costPrice = props.selectedRow.costPrice;
    articleInfo.value.description = props.selectedRow.description;
    articleInfo.value.name = props.selectedRow.name;
    articleInfo.value.retailPrice = props.selectedRow.retailPrice;
    articleInfo.value.wholeSalePrice = props.selectedRow.wholeSalePrice;
  }
});
const isImageSizeGreater = () => {
  if (articleInfo.value.productImage) {
    if (articleInfo.value.productImage.size > 2 * 1024 * 1024) {
      return true;
    }
  }
  return false;
};
const handleImageUpload = (file: File | null) => {
  if (imagePreview.value !== '') {
    URL.revokeObjectURL(imagePreview.value);
  }
  if (file) {
    const url = URL.createObjectURL(file);
    imagePreview.value = url;
  }
};
const checkFile = (value: File) => {
  if (value) {
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    const isValidFormat = allowedFormats.includes(value.type);
    if (!isValidFormat) {
      return 'Invalid file format. Only jpeg, jpg, and png allowed.';
    }
    const isValidSize = value.size <= 2 * 1024 * 1024;
    if (!isValidSize) {
      return 'Selected file must be less than or equal to 2MB';
    }
  }
  return true;
};
const handleSelectedCategory = (selectedCategory: {
  categoryName: string;
  categoryId: number;
}) => {
  articleInfo.value.categoryName = selectedCategory.categoryName;
  articleInfo.value.categoryId = selectedCategory.categoryId;
  isCategoryModalVisible.value = false;
};
const handleUpdateArticle = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  emit('update-article', articleInfo.value, () => (isLoading.value = false));
};
</script>
