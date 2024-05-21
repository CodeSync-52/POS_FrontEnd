<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-xl font-medium">Article Sale By Color Report</span>
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-input
        maxlength="250"
        v-model="selectedCategoryName"
        dense
        readonly
        label="Select Category"
        outlined
        @click="addCategory"
        color="btn-primary"
      />
      <q-dialog v-model="isCategoryModalVisible">
        <article-category-modal @category-selected="handleSelectedCategory" />
      </q-dialog>
      <q-input
        v-model="filterSearch.fromDate"
        label="From"
        :max="filterSearch.toDate"
        type="date"
        style="min-width: 200px"
        outlined
        dense
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.toDate"
        label="To"
        type="date"
        style="min-width: 200px"
        :min="filterSearch.fromDate"
        outlined
        color="btn-primary"
        dense
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          unelevated
          @click="getArticleSaleReportByColor()"
        />
        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter"
        />
      </div>
      <div id="shop-article-quantity-sale" class="container mx-auto mt-2">
        <div class="text-[24px] font-bold text-btn-primary pb-1 pr-4">
          Grand Total: {{ grandTotal }}
        </div>
        <div>
          <div
            v-for="item in articleSaleDistributionByColorReportData"
            :key="item.article"
          >
            <div
              class="text-lg font-bold my-4 flex justify-between flex-col md:flex-row px-1"
            >
              <span>{{ item.article }}</span>
              <span>Retail Price ({{ item.retailPrice }})</span>
            </div>
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                    Shop Name
                  </th>
                  <th
                    v-for="variant in item.articleSaleByShop[0].articleByColor"
                    :key="variant.variant2_Id"
                    class="border border-gray-300 bg-gray-100 px-4 py-2"
                  >
                    {{ variant.variant2_Name }}
                  </th>
                  <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                    Total Sale Qty.
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="shopDetail in item.articleSaleByShop"
                  :key="shopDetail.shop"
                >
                  <td class="border border-gray-300 px-4 py-2">
                    {{ shopDetail.shop }}
                  </td>
                  <td
                    v-for="variant in shopDetail.articleByColor"
                    :key="variant.variant2_Id"
                    class="border border-gray-300 px-4 py-2 text-center"
                  >
                    {{ variant.quantity }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    {{ shopDetail.totalSaleQuantity }}
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-bold">
                    Total
                  </td>
                  <td
                    v-for="variantTotal in calculateVariantTotals(
                      item.articleSaleByShop
                    )"
                    :key="variantTotal.variant2_Id"
                    class="border border-gray-300 px-4 py-2 text-center font-bold"
                  >
                    {{ variantTotal.totalQuantity }}
                  </td>
                  <td
                    class="border border-gray-300 px-4 py-2 text-center font-bold"
                  >
                    {{ calculateTotalSaleQuantity(item.articleSaleByShop) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ArticleCategoryModal from 'src/components/article-management/Article-Category-Modal.vue';
import {
  IArticleSaleDistributionByColorDetail,
  IArticleSaleByShop,
} from 'src/interfaces';
import { date, useQuasar } from 'quasar';
import { GetArticleSaleByColorDetailReport } from 'src/services/reports';
import { isPosError } from 'src/utils';
import { ref } from 'vue';
const isLoading = ref(false);
const $q = useQuasar();
const isCategoryModalVisible = ref(false);
const apiController = ref<AbortController | null>(null);
const timeStamp = Date.now();
const selectedCategoryName = ref('');
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past30Date = date.subtractFromDate(timeStamp, { days: 30 });
const formattedFromDate = date.formatDate(past30Date, 'YYYY-MM-DD');
const articleSaleDistributionByColorReportData = ref<
  IArticleSaleDistributionByColorDetail[]
>([]);
let grandTotal = ref<number>(0);
const addCategory = () => {
  isCategoryModalVisible.value = true;
};
const handleSelectedCategory = (selectedCategory: {
  categoryName: string;
  categoryId: number;
}) => {
  selectedCategoryName.value = selectedCategory.categoryName;
  filterSearch.value.categoryId = selectedCategory.categoryId;
  isCategoryModalVisible.value = false;
};
const filterSearch = ref<{
  categoryId: number | null;
  fromDate: string;
  toDate: string;
}>({
  categoryId: null,
  fromDate: formattedFromDate,
  toDate: formattedToDate,
});
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    categoryId: null,
    fromDate: '',
    toDate: '',
  };
  selectedCategoryName.value = '';
  grandTotal.value = 0;
  articleSaleDistributionByColorReportData.value = [];
};
const getArticleSaleReportByColor = async () => {
  if (isLoading.value) return;
  if (
    !filterSearch.value.categoryId ||
    !filterSearch.value.fromDate ||
    !filterSearch.value.toDate
  ) {
    let message = 'Please select product and date';
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
    return;
  }

  isLoading.value = true;
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await GetArticleSaleByColorDetailReport(
      {
        toDate: filterSearch.value.toDate,
        fromDate: filterSearch.value.fromDate,
        categoryId: filterSearch.value.categoryId,
      },
      apiController.value
    );
    articleSaleDistributionByColorReportData.value = res.data;

    grandTotal.value = 0;
    articleSaleDistributionByColorReportData.value.forEach(
      (item: IArticleSaleDistributionByColorDetail) => {
        if (item && item.grandSaleQuantity) {
          item.articleSaleByShop.forEach(
            (articleSaleByShop: IArticleSaleByShop) => {
              if (articleSaleByShop && articleSaleByShop.totalSaleQuantity) {
                grandTotal.value += articleSaleByShop.totalSaleQuantity;
              }
            }
          );
        }
      }
    );
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
  isLoading.value = false;
};
const calculateVariantTotals = (articleSaleByShop: IArticleSaleByShop[]) => {
  const variantTotals = articleSaleByShop[0].articleByColor.map((variant) => ({
    variant2_Id: variant.variant2_Id,
    totalQuantity: 0,
  }));
  articleSaleByShop.forEach((shopDetail) => {
    shopDetail.articleByColor.forEach((variant, index) => {
      variantTotals[index].totalQuantity += variant.quantity;
    });
  });
  return variantTotals;
};
const calculateTotalSaleQuantity = (
  articleSaleByShop: IArticleSaleByShop[]
) => {
  return articleSaleByShop.reduce(
    (total, shopDetail) => total + shopDetail.totalSaleQuantity,
    0
  );
};
</script>
