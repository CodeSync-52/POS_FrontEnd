<template>
  <q-card class="min-w-[310px] md:min-w-[750px]">
    <q-card-section>
      <div v-if="isFetchingArticleList">
        <q-spinner color="btn-primary" size="3rem" class="mx-auto" />
      </div>
      <div v-else>
        <div class="row items-center q-mb-md justify-between">
          <div class="text-h6">
            <span>Add Article</span>
          </div>
          <q-btn icon="close" flat unelevated dense v-close-popup />
        </div>
        <div v-if="articleList.length">
          <!-- <div v-for="article in articleList" :key="article.productId">
            <q-checkbox
              size="sm"
              :model-value="isArtickeChecked(article.productId)"
              @update:model-value="
                updateArticleChecked(article.productId, article.name)
              "
              :label="article.name"
              color="btn-primary"
              :val="article.productId"
            />
          </div> -->
          <q-table
            v-model:pagination="pagination"
            :rows="articleList"
            :columns="articleListColumn"
            selection="multiple"
            v-model:selected="selected"
            :filter="filter"
            @request="handlePagination($event.pagination)"
            :selected-rows-label="getSelectedString"
          >
            <template v-slot:top>
              <div class="text-lg font-medium"><span> Article </span></div>
              <q-space />
              <q-input
                borderless
                dense
                outlined
                label="search"
                debounce="300"
                color="primary"
                v-model="filter"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:body-cell-image="props">
              <q-td :props="props">
                <div
                  class="max-w-[2rem] h-[32px] min-w-[2rem] overflow-hidden rounded-full"
                >
                  <img
                    class="w-full h-full object-cover"
                    :src="
                      getImageUrl(props.row.productImage) ??
                      'assets/default-image.png'
                    "
                    alt=""
                  />
                </div>
              </q-td>
            </template>
          </q-table>
        </div>

        <div v-else class="text-center">
          <span>No Article Available</span>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right" v-if="articleList.length">
      <div class="row justify-end gap-4">
        <q-btn
          label="Cancel"
          flat
          unelevated
          color="signature"
          class="bg-btn-cancel hover:bg-btn-cancel-hover"
          v-close-popup
        />
        <q-btn
          flat
          :disabled="selectedArticles.length === 0"
          label="Save"
          @click="handleSave"
          unelevated
          color="signature"
          class="bg-btn-primary hover:bg-btn-primary-hover"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { IArticleData, IPagination } from 'src/interfaces';
import { onMounted, ref } from 'vue';
import { articleListColumn } from 'src/utils';
onMounted(() => {
  if (props.currentData) {
    selectedArticles.value = [...props.currentData];
  }
});
const pagination = ref<IPagination>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const emit = defineEmits<{
  (
    event: 'selected-data',
    data: { productId: number; productName?: string }[]
  ): void;
  (event: 'handle-pagination', pagination: IPagination): void;
}>();
const props = withDefaults(defineProps<propTypes>(), {
  currentData: () => [],
  articleList: () => [],
  isFetchingArticleList: false,
});
const selectedArticles = ref<{ productId: number; productName?: string }[]>([]);
const selected = ref([]);
interface propTypes {
  currentData: { productId: number; productName?: string }[];
  articleList: IArticleData[];
  isFetchingArticleList: boolean;
}
const filter = ref('');
// const filteredRows = ref<IArticleData[]>([]);
// const filterChanged = ref(false);
// function setFilteredData() {
//   filterChanged.value = true;
//   filteredRows.value = props.articleList.filter((row) =>
//     row.name.toLowerCase().includes(filter.value.toLowerCase())
//   );
//   setTimeout(() => {
//     filterChanged.value = false;
//   }, 200);
// }
// watch(filter, setFilteredData);
// watch(props.articleList, setFilteredData);
const handleSave = () => {
  emit('selected-data', selectedArticles.value);
};
const getImageUrl = (base64Image: string | null) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
};
const handlePagination = (newVal: { pagination: IPagination }) => {
  pagination.value = newVal.pagination;
  emit('handle-pagination', newVal.pagination);
};
const getSelectedString = () => {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} record${
        selected.value.length > 1 ? 's' : ''
      } selected of ${props.articleList.length}`;
};
// const updateArticleChecked = (id: number, productName: string) => {
//   const existingArticleIndex = selectedArticles.value.findIndex(
//     (x) => x.productId === id
//   );

//   if (existingArticleIndex !== -1) {
//     // If the article already exists, remove it
//     selectedArticles.value.splice(existingArticleIndex, 1);
//   } else {
//     // If the article doesn't exist, add it
//     selectedArticles.value.push({ productId: id, productName });
//   }
// };
// const isArtickeChecked = (productId: number) => {
//   if (selectedArticles.value.find((x) => x.productId === productId)) {
//     return true;
//   }
//   return false;
// };
</script>
