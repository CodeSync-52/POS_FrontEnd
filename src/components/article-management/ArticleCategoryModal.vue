<template>
  <q-card class="min-w-[320px] md:min-w-[400px] h-[500px]">
    <q-card-section class="q-pa-none h-[calc(100%-55px)]">
      <div class="q-pa-md row items-center q-mb-md justify-between">
        <div class="text-lg font-medium">
          <span>Select Category</span>
        </div>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div class="q-px-md q-py-sm">
        <q-table
          class="max-h-[350px] h-full"
          virtual-scroll
          :columns="categoryTreeColumn"
          :loading="isFetching"
          row-key="categoryId"
          :rows="articleCategory"
          align="left"
          hide-bottom
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />

              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-checkbox
                  dense
                  size="sm"
                  :model-value="isCategoryChecked(props.row.categoryId)"
                  @update:model-value="
                    updateCategoryChecked(props.row.categoryId, props.row.name)
                  "
                  :val="props.row.categoryId"
                  color="btn-primary"
                />
              </q-td>

              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <div class="row items-center justify-between">
                  <span>
                    {{ col.value }}
                  </span>
                  <q-btn
                    v-if="props.row.subCategories.length"
                    dense
                    size="sm"
                    rounded
                    @click="props.expand = !props.expand"
                    :icon="props.expand ? 'remove' : 'add'"
                    class="bg-btn-primary"
                    color="Sgnature"
                  />
                </div>
              </q-td>
            </q-tr>
            <q-tr
              v-show="props.expand"
              :props="props"
              v-for="subCategory in props.row.subCategories"
              :key="subCategory.categoryId"
            >
              <q-td colspan="100%">
                <div class="pl-5">
                  <q-checkbox
                    dense
                    size="sm"
                    :label="subCategory.name"
                    :model-value="isCategoryChecked(subCategory.categoryId)"
                    @update:model-value="
                      updateCategoryChecked(
                        subCategory.categoryId,
                        subCategory.name
                      )
                    "
                    :val="props.row.categoryId"
                    color="btn-primary"
                  />
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
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
import { categoryTreeColumn, isPosError } from 'src/utils';
import { onMounted, ref } from 'vue';
import { categoryTreeList } from 'src/services/category-management';
import { IArticleCategory } from 'src/interfaces';
const selectedCategory = ref<{ categoryId: number; categoryName: string }>({
  categoryId: -1,
  categoryName: '',
});
const $q = useQuasar();
const isLoading = ref(false);
const isFetching = ref(false);
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
