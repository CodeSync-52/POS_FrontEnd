<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">Article Sale Report</span>

      <q-btn-dropdown
        dropdown-icon="arrow_downward"
        label="Download Report"
        class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover text-white"
      >
        <q-list>
          <q-item
            clickable
            @click="download(articlquantitySaleResponse, grandTotal)"
            v-close-popup
          >
            <q-item-section>
              <q-item-label>Download in PDF</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        dense
        outlined
        style="min-width: 200px; max-width: 200px"
        use-input
        @filter="filterFn"
        v-model="filterSearch.shopId"
        @update:model-value="filterSearch.shopId = $event.shopId"
        :options="shopListRecords"
        :disable="
          authStore.loggedInUser?.rolePermissions.roleName ===
            EUserRoles.ShopManager.toLowerCase() ||
          authStore.loggedInUser?.rolePermissions.roleName ===
            EUserRoles.ShopOfficer.toLowerCase()
        "
        map-options
        option-value="shopId"
        popup-content-class="!max-h-[200px]"
        option-label="name"
        label="Select Shop"
        color="btn-primary"
      />
      <q-input
        maxlength="250"
        v-model="filterSearch.categoryName"
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
      <q-select
        popup-content-class="!max-h-[200px]"
        class="min-w-[220px]"
        use-input
        dense
        map-options
        clearable
        multiple
        outlined
        @filter="handleFilterArticles"
        :options="articleList"
        v-model="filterSearch.ProductId"
        :loading="isFetchingArticleList"
        label="Select Product"
        color="btn-primary"
        option-label="name"
        option-value="productId"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

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
      <div class="q-gutter-sm">
        <q-radio
          v-model="filterSearch.sortByArticle"
          color="btn-primary"
          val="false"
          label="Sort by Qty"
        />
        <q-radio
          v-model="filterSearch.sortByArticle"
          color="btn-primary"
          val="true"
          label="Sort by article"
        />
      </div>
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          unelevated
          @click="getArticleQuantitySale()"
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
        <!-- Article and Image -->
        <div
          v-for="(item, itemIndex) in articlquantitySaleResponse"
          :key="itemIndex"
          class="mb-8 border p-2"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="flex flex-col">
                <img
                  :src="item.image ?? ''"
                  alt="Product Image"
                  class="w-16 h-16 mt-2 mb-4"
                />
              </div>

              <div class="text-bold">{{ item.article }}</div>

              <div class="text-bold">Retail Price: {{ item.retailPrice }}</div>
            </div>
            <div>
              <div class="text-bold text-[24px] flex justify-end">
                Total: {{ item.grandTotal }}
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="flex flex-col mt-2">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th class="border border-gray-300 bg-gray-200 p-2"></th>
                  <th
                    v-for="(size, sizeIndex) in getUniqueSizes(
                      item.variant2List
                    )"
                    :key="sizeIndex"
                    class="border border-gray-300 bg-gray-200 p-2"
                  >
                    {{ size }}
                  </th>
                  <th class="border border-gray-300 bg-gray-200 p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(variant, variantIndex) in item.variant2List"
                  :key="variantIndex"
                  class="border border-gray-300"
                >
                  <td class="border border-gray-300 p-2 font-semibold">
                    {{ variant.variant2_Name }}
                  </td>
                  <td
                    v-for="(v1, v1Index) in variant.variant1List"
                    :key="v1Index"
                    class="border border-gray-300 p-2 text-center"
                  >
                    {{ v1.quantity }}
                  </td>
                  <td class="border border-gray-300 p-2 text-center">
                    {{ variant.totalQuantity }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="isLoader" persistent>
      <q-spinner-ios size="78px" color="btn-primary" />
      <span class="ml-2 text-base font-[500]">Generating PDF...</span>
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import ArticleCategoryModal from 'src/components/article-management/Article-Category-Modal.vue';
import {
  IArticleData,
  IShopResponse,
  IShopStockReportData,
  IVariant2Info,
  EUserRoles,
} from 'src/interfaces';
import { GetArticleList, GetShopList } from 'src/services';
import { date, useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
import { GetShopArticleQuantitySaleReport } from 'src/services/reports';
import { isPosError } from 'src/utils';
import { ref, onMounted } from 'vue';
import pdfMake from 'pdfmake/build/pdfmake';
const isLoading = ref(false);
const $q = useQuasar();
const authStore = useAuthStore();
const isFetchingArticleList = ref(false);
const articleList = ref<IArticleData[]>([]);
const isCategoryModalVisible = ref(false);
const apiController = ref<AbortController | null>(null);
const shopListRecords = ref<IShopResponse[]>([]);
const isLoader = ref(false);
const articlquantitySaleResponse = ref<IShopStockReportData[]>([]);
const timeStamp = Date.now();
const next1Day = date.subtractFromDate(timeStamp, { day: -1 });
const formattedToDate = date.formatDate(next1Day, 'YYYY-MM-DD');
const past30Date = date.subtractFromDate(timeStamp, { days: 30 });
const formattedFromDate = date.formatDate(past30Date, 'YYYY-MM-DD');
let grandTotal = ref<number>(0);
onMounted(async () => {
  await getShopList();
  filterSearch.value.shopId =
    authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1;
});
const addCategory = () => {
  isCategoryModalVisible.value = true;
};
const handleSelectedCategory = (selectedCategory: {
  categoryName: string;
  categoryId: number;
}) => {
  filterSearch.value.categoryName = selectedCategory.categoryName;
  filterSearch.value.categoryId = selectedCategory.categoryId;
  isCategoryModalVisible.value = false;
};
const filterSearch = ref<{
  categoryId: number | null;
  categoryName: string;
  shopId: number | null;
  fromDate: string;
  toDate: string;
  sortByArticle: string;
  ProductId: IArticleData[];
}>({
  categoryId: null,
  shopId: null,
  categoryName: '',
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  sortByArticle: 'true',
  ProductId: [],
});
const handleFilterArticles = (value: any, update: CallableFunction) => {
  update(() => {
    getArticleList(value);
  });
};
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  if (
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopManager.toLowerCase() ||
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopOfficer.toLowerCase()
  ) {
    filterSearch.value.shopId = null;
  }
  (filterSearch.value.categoryName = ''),
    (filterSearch.value.categoryId = null),
    (filterSearch.value.fromDate = ''),
    (filterSearch.value.toDate = ''),
    (filterSearch.value.sortByArticle = 'true'),
    (filterSearch.value.ProductId = []),
    (articlquantitySaleResponse.value = []);
  grandTotal.value = 0;
};

const getArticleList = async (productName?: string) => {
  if (isFetchingArticleList.value) return;
  isFetchingArticleList.value = true;
  try {
    const res = await GetArticleList({
      PageNumber: 1,
      PageSize: 1000000,
      Status: 'Active',
      Name: productName,
      CategoryId: null,
    });
    if (res.type === 'Success') {
      if (res.data) {
        articleList.value = res.data.items;
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred while fetching articles';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
  isFetchingArticleList.value = false;
};
const getArticleQuantitySale = async () => {
  if (!filterSearch.value.shopId) {
    $q.notify({
      message: 'Please select a shop.',
      icon: 'error',
      color: 'red',
    });
    return;
  }
  if (!filterSearch.value.fromDate || !filterSearch.value.toDate) {
    $q.notify({
      message: 'Please select date range.',
      icon: 'error',
      color: 'red',
    });
    return;
  }

  if (isLoading.value) return;
  isLoading.value = true;
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await GetShopArticleQuantitySaleReport(
      {
        shopId: filterSearch.value.shopId,
        categoryId: filterSearch.value.categoryId ?? 0,
        productIds: filterSearch.value.ProductId?.map(
          (product) => product.productId
        ).join(','),
        fromDate: filterSearch.value.fromDate,
        sortByArticle:
          filterSearch.value.sortByArticle === 'true' ? true : false,
        toDate: filterSearch.value.toDate,
      },
      apiController.value
    );
    articlquantitySaleResponse.value = res.data;
    grandTotal.value = 0;
    articlquantitySaleResponse.value.forEach((item: IShopStockReportData) => {
      if (item && item.variant2List) {
        item.variant2List.forEach((variant2: IVariant2Info) => {
          if (variant2 && variant2.totalQuantity) {
            grandTotal.value += variant2.totalQuantity;
          }
        });
      }
    });
  } catch (e) {
    let message = 'Unexpected Error Occurred while fetching shop stock';
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
const getUniqueSizes = (variant2List: any) => {
  let uniqueSizes: any = [];
  variant2List.forEach((variant: any) => {
    variant.variant1List.forEach((v1: any) => {
      if (!uniqueSizes.includes(v1.variant1_Name)) {
        uniqueSizes.push(v1.variant1_Name);
      }
    });
  });
  return uniqueSizes;
};
const getShopList = async () => {
  isLoading.value = true;
  try {
    const response = await GetShopList({
      PageNumber: 1,
      PageSize: 25,
    });
    if (response.data) {
      shopListRecords.value = response.data.items;
    }
  } catch (error) {
    let message = 'Unexpected Error Occurred while fetching shop list';
    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  } finally {
    isLoading.value = false;
  }
};
const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    shopListRecords.value = shopListRecords.value.filter((v) =>
      v.name?.toLowerCase().includes(needle)
    );
  });
};

const download = async (data: IShopStockReportData[], grandTotal: number) => {
  isLoader.value = true;
  for (const item of data) {
    if (item.image) {
      try {
        const response = await fetch(item.image, { mode: 'cors' });
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          item.imageDataUrl = reader.result as string;
        };
      } catch (error) {
        console.error(`Error fetching image from URL ${item.image}: ${error}`);
      }
    }
  }
  downloadPdf(data, grandTotal);
  isLoader.value = false;
};
const downloadPdf = (data: IShopStockReportData[], grandTotal: number) => {
  const content = [];
  const header = [
    { text: 'Article', style: 'tableHeader' },
    { text: 'Image', style: 'tableHeader', alignment: 'center' },
    { text: 'Retail Price', style: 'tableHeader' },
    { text: 'Total', style: 'tableHeader', alignment: 'right' },
  ];
  content.push(header);
  data.forEach((item) => {
    const rowData = [
      { text: item.article, fontSize: 10 },
      item.imageDataUrl
        ? {
            image: item.imageDataUrl,
            fit: [70, 70],
            alignment: 'center',
          }
        : { text: '', fontSize: 10 },
      { text: item.retailPrice.toString(), fontSize: 10 },
      { text: item.grandTotal.toString(), alignment: 'right', fontSize: 10 },
    ];
    content.push(rowData);
  });
  const documentDefinition = {
    content: [
      { text: 'Article Sale Report', style: 'mainHeading' },
      { text: '\n' },
      { text: 'Grand Total: ' + grandTotal, style: 'subHeading' },
      { text: '\n\n' },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto'],
          body: content,
          style: 'tableStyle',
        },
      },
    ],
    styles: {
      mainHeading: {
        fontSize: 20,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      subHeading: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        fillColor: '#CCCCCC',
        alignment: 'center',
      },
      tableStyle: {
        fontSize: 10,
      },
    },
  };

  pdfMake.createPdf(documentDefinition).download('article_sale_report.pdf');
};
</script>
