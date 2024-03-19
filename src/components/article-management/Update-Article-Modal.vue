<template>
  <q-card class="min-w-[310px] md:min-w-[400px]">
    <q-card-section>
      <div class="text-lg font-medium row justify-between mb-2">
        <span> Edit Article</span>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-input
            maxlength="250"
            v-model="articleInfo.name"
            dense
            label="Name"
            outlined
            color="btn-primary"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            maxlength="250"
            v-model="articleInfo.description"
            dense
            label="Description"
            outlined
            color="btn-primary"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-file
            @update:model-value="handleImageUpload"
            v-model="articleInfo.productImage"
            accept=".jpeg, .jpg , .png"
            dense
            label="Select Image"
            clearable
            outlined
            :rules="[checkFile]"
            color="btn-primary"
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
            color="btn-primary"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="articleInfo.retailPrice"
            type="number"
            dense
            label="Retail Price"
            outlined
            color="btn-primary"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="articleInfo.costPrice"
            type="number"
            dense
            label="Cost Price"
            outlined
            color="btn-primary"
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
                unelevated
                @click="isCategoryModalVisible = true"
                color="btn-primary"
              />
            </div>
            <q-input
              maxlength="250"
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
    <q-card-actions align="right">
      <q-btn
        label="Close"
        color="Signature"
        unelevated
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
        v-close-popup
      />
      <q-btn
        label="Save"
        color="btn-primary"
        unelevated
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
import ArticleCategoryModal from './Article-Category-Modal.vue';
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
  if (props.selectedRow?.productImage) {
    const properBase64 = props.selectedRow?.productImage;
    if (properBase64) {
      imagePreview.value = properBase64;
    }
    const image = base64ToFile(properBase64, 'image.jpeg');
    articleInfo.value.productImage = image;
  }
});
function base64ToFile(
  base64String: string | undefined,
  fileName = 'image.jpeg'
) {
  // Split the base64 string to get content type and data
  if (base64String) {
    const parts = base64String.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const base64Data = parts[1];

    // Decode the base64 data
    const decodedData = atob(base64Data);

    // Create a Blob object from the decoded data
    const blob = new Blob([decodedData], { type: contentType });

    // Create a File object from the Blob
    const file = new File([blob], fileName, { type: contentType });

    return file;
  }
}
const isImageSizeGreater = () => {
  if (articleInfo.value.productImage) {
    if (articleInfo.value.productImage.size > 0.5 * 1024 * 1024) {
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
    const isValidSize = value.size <= 0.5 * 1024 * 1024;
    if (!isValidSize) {
      return 'Selected file must be less than or equal to 0.5MB';
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
