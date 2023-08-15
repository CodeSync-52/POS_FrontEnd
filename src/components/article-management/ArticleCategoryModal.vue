<template>
  <q-card class="min-w-[320px] md:min-w-[400px]">
    <q-card-section class="q-pa-none">
      <div class="q-pa-md row items-center q-mb-md justify-between">
        <div class="text-h6">
          <span>Select Category</span>
        </div>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div class="overflow-y-auto h-[300px] q-px-md">
        <div v-for="category in articleCategory" :key="category.categoryId">
          <div v-if="category.subCategories.length">
            <q-expansion-item
              group="articleCategory"
              expand-icon-class="pr-0"
              :caption="category.name"
            >
              <template v-slot:header>
                <div class="row w-full items-center">
                  <div>{{ category.name }}</div>
                  <div><q-icon /></div>
                </div>
              </template>
              <div
                v-for="subCategory in category.subCategories"
                :key="subCategory.categoryId"
                class="pl-5 q-mb-md"
              >
                <q-checkbox
                  dense
                  size="sm"
                  :model-value="isCategoryChecked(subCategory.categoryId)"
                  @update:model-value="
                    updateCategoryChecked(subCategory.categoryId, category.name)
                  "
                  :label="subCategory.name"
                  :val="subCategory.categoryId"
                  color="btn-primary"
                />
              </div>
            </q-expansion-item>
          </div>
          <div v-else>
            <q-checkbox
              size="sm"
              :model-value="isCategoryChecked(category.categoryId)"
              @update:model-value="
                updateCategoryChecked(category.categoryId, category.name)
              "
              :label="category.name"
              color="btn-primary"
              :val="category.categoryId"
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { isPosError } from 'src/utils';
import { onMounted, ref } from 'vue';
import { categoryTreeList } from 'src/services/category-management';
import { IArticleCategory } from 'src/interfaces';
const selectedCategory = ref<{ categoryId: number; categoryName: string }>({
  categoryId: -1,
  categoryName: '',
});
// interface IProps{
//   selectedArticleCategory:string
// }
const $q = useQuasar();
onMounted(() => {
  getCategoryTreeList();
});
const isCategoryChecked = (categoryId: number) => {
  if (selectedCategory.value.categoryId === categoryId) {
    return true;
  }
  return false;
};
const updateCategoryChecked = (id: number, name: string) => {
  if (selectedCategory.value && selectedCategory.value.categoryId === id) {
    selectedCategory.value = { categoryId: -1, categoryName: '' };
  } else {
    selectedCategory.value = { categoryId: id, categoryName: name };
  }
};
const articleCategory = ref<IArticleCategory[]>([]);
// const emit = defineEmits<{
//   (event: 'category-selected',category:{category:string,categoryID:number},parentCategoryID:number):void,
// }>();
// const props = withDefaults(defineProps<IProps>(),{
//   selectedArticleCategory:''
// })
const getCategoryTreeList = async () => {
  try {
    const res = await categoryTreeList();
    if (res.type === 'Success') {
      articleCategory.value = res.data.categoryTree;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
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
