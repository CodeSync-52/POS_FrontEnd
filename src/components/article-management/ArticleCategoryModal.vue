<template>
  <q-card class="min-w-[320px] md:min-w-[400px]">
    <q-card-section class="q-pa-none">
      <div class="q-pa-md row items-center q-mb-md justify-between">
        <div class="text-lg font-medium">
          <span>Select Category</span>
        </div>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div class="overflow-y-auto h-[300px] q-px-md">
        <div v-for="category in articleCategory" :key="category.categoryId">
          <div v-if="category.subCategories.length">
            <q-expansion-item
              group="articleCategory"
              :header-style="{ padding: '10px' }"
            >
              <template v-slot:header>
                <div class="row w-full items-center">
                  <q-checkbox
                    dense
                    size="sm"
                    :model-value="isCategoryChecked(category.categoryId)"
                    @update:model-value="
                      updateCategoryChecked(category.categoryId, category.name)
                    "
                    :label="category.name"
                    :val="category.categoryId"
                    color="btn-primary"
                  />
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
                    updateCategoryChecked(
                      subCategory.categoryId,
                      subCategory.name
                    )
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
    <q-card-actions align="right">
      <q-btn
        label="Cancel"
        flat
        unelevated
        color="signature"
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
        v-close-popup
      />
      <q-btn
        label="Save"
        flat
        :loading="isLoading"
        unelevated
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="handleSelectedCategory"
      />
    </q-card-actions>
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
const $q = useQuasar();
const isLoading = ref(false);
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
const handleSelectedCategory = () => {
  emit('category-selected', selectedCategory.value);
};
const articleCategory = ref<IArticleCategory[]>([]);
const emit = defineEmits<{
  (
    event: 'category-selected',
    category: { categoryName: string; categoryId: number }
  ): void;
}>();
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
