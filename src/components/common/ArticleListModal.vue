<template>
  <q-card class="min-w-[310px] md:min-w-[750px] h-[600px]">
    <q-card-section class="h-[calc(100%-52px)]">
      <div>
        <div class="row items-center q-mb-md justify-between">
          <div class="text-h6">
            <span>Add Article</span>
          </div>
          <q-btn icon="close" flat unelevated dense v-close-popup />
        </div>
        <div>
          <q-table
            class="max-h-[450px] h-full"
            v-model:pagination="articlePagination"
            :rows="filteredRows"
            :columns="articleListColumn"
            :loading="isFetchingArticleList"
            virtual-scroll
            :filter="filter"
            row-key="productId"
            @request="handlePagination($event.pagination)"
            selection="multiple"
            v-model:selected="selected"
          >
            <template v-slot:top>
              <div
                class="flex flex-col md:flex-row justify-between items-center w-full"
              >
                <div class="text-lg font-medium"><span> Article </span></div>
                <q-space />
                <q-input
                  borderless
                  dense
                  maxlength="250"
                  outlined
                  label="search"
                  debounce="300"
                  color="btn-primary"
                  v-model="filter"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
            <template v-slot:body-cell-image="props">
              <q-td :props="props">
                <div
                  class="max-w-[2rem] h-[2rem] min-w-[2rem] overflow-hidden rounded-full"
                  :class="props.row.productImage ? 'cursor-pointer' : ''"
                >
                  <img
                    class="w-full h-full object-cover"
                    :src="
                      getImageUrl(props.row.productImage) ||
                      'assets/default-image.png'
                    "
                    alt="article"
                  />
                </div>
              </q-td>
            </template>
            <template v-slot:no-data>
              <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
                <q-icon name="warning" size="xs" />
                <span class="text-md font-medium"> No data available. </span>
              </div>
            </template>
          </q-table>
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
          :disabled="selected.length === 0"
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
import { onMounted, ref, watch } from 'vue';
import { articleListColumn } from 'src/utils';
interface propTypes {
  currentData: {
    productId: number;
    productName?: string;
    productImage: string;
  }[];
  articleList: IArticleData[];
  isFetchingArticleList: boolean;
  pagination: IPagination;
}
const articlePagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const props = withDefaults(defineProps<propTypes>(), {
  currentData: () => [],
  articleList: () => [],
  isFetchingArticleList: false,
});
const selectedArticles = ref<
  {
    productId: number;
    productName?: string;
    unitWholeSalePrice?: number;
    productImage: string | null;
  }[]
>([...props.currentData]);
const selected = ref<IArticleData[]>([]);
const filter = ref('');
const filteredRows = ref<IArticleData[]>([]);
const filterChanged = ref(false);

const emit = defineEmits<{
  (
    event: 'selected-data',
    data: {
      productId: number;
      productName?: string;
      productImage: string | null;
    }[]
  ): void;
  (event: 'handle-pagination', pagination: IPagination): void;
  (
    event: 'selected-data-cost',
    data: { productId: number; productWholeSaleCost: number }[]
  ): void;
  (event: 'filtered-rows', isFilterChanged: boolean): void;
}>();
watch(selected, (newSelected: IArticleData[]) => {
  selectedArticles.value = newSelected.map((article) => ({
    productId: article.productId,
    productName: article.name,
    unitWholeSalePrice: article.wholeSalePrice,
    productImage: article.productImage,
  }));
});
function setFilteredData() {
  filterChanged.value = true;
  if (filter.value) {
    filteredRows.value = props.articleList.filter((row) =>
      row.name.toLowerCase().includes(filter.value.toLowerCase().trim())
    );
  } else {
    filteredRows.value = props.articleList;
  }
  emit('filtered-rows', filterChanged.value);
  setTimeout(() => {
    filterChanged.value = false;
    emit('filtered-rows', filterChanged.value);
  }, 200);
}
onMounted(() => {
  if (props.currentData.length) {
    selected.value = [];
    props.currentData.forEach((item) => {
      const selectedItem = props.articleList.find(
        (filteredItem) => filteredItem.productId === item.productId
      );
      if (selectedItem) {
        selected.value.push(selectedItem);
      }
    });
  }
  if (props.currentData) {
    selectedArticles.value = [...props.currentData];
  }
  articlePagination.value = props.pagination;
  filteredRows.value = props.articleList;
});

watch(filter, setFilteredData);
watch(props, setFilteredData, {
  deep: true,
});
const handleSave = () => {
  emit('selected-data', selectedArticles.value);
};
const getImageUrl = (base64Image: string | null) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
};
const handlePagination = (newVal: Omit<IPagination, 'rowsNumber'>) => {
  const selectedPagination = {
    ...newVal,
    rowsNumber: articlePagination.value.rowsNumber,
  };
  articlePagination.value = selectedPagination;
  emit('handle-pagination', selectedPagination);
};
</script>
