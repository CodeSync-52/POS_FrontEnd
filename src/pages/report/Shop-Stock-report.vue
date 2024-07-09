<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">Shop Stock Report</span>
      <q-btn-dropdown
        dropdown-icon="arrow_downward"
        label="Download Report"
        class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover text-white"
      >
        <q-list>
          <q-item
            clickable
            @click="download(stockResponse, grandTotal)"
            v-close-popup
          >
            <q-item-section>
              <q-item-label>Download in PDF</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="downloadExcel(stockResponse, grandTotal)"
            v-close-popup
          >
            <q-item-section>
              <q-item-label>Download in Excel</q-item-label>
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
        style="min-width: 200px"
        outlined
        map-options
        @filter="filterFn"
        use-input
        :options="shopListRecords"
        v-model="selectedShop"
        :disable="
          authStore.loggedInUser?.rolePermissions.roleName ===
            EUserRoles.ShopManager.toLowerCase() ||
          authStore.loggedInUser?.rolePermissions.roleName ===
            EUserRoles.ShopOfficer.toLowerCase()
        "
        popup-content-class="!max-h-[200px]"
        label="Select Shop"
        color="btn-primary"
        multiple
        clearable
        option-label="name"
        option-value="shopId"
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
      <q-checkbox
        v-model="filterSearch.excludeZeroStock"
        color="btn-primary"
        label="Exclude Zero Stock"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          unelevated
          @click="getShopStock()"
        />
        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter"
        />
      </div>

      <div class="container mx-auto mt-6">
        <div class="text-[24px] font-bold text-btn-primary pb-1 pr-4">
          Grand Total: {{ grandTotal }}
        </div>
        <!-- Article and Image -->
        <div
          v-for="(item, itemIndex) in stockResponse"
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
              <div class="flex flex-col">
                <div class="text-bold">{{ item.article }}</div>
                <div class="text-bold">{{ item.retailPrice }}</div>
              </div>
            </div>
            <div>
              <div class="text-bold text-[24px] flex justify-end">
                Total: {{ item.grandTotal }}
              </div>
            </div>
          </div>
          <!-- Table -->
          <div class="flex flex-col mt-4">
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
import { useAuthStore } from 'src/stores';
import { useQuasar } from 'quasar';
import { GetShopStockReport } from 'src/services/reports';
import { isPosError } from 'src/utils';
import { ref, onMounted } from 'vue';
import pdfMake from 'pdfmake/build/pdfmake';
const authStore = useAuthStore();
const isLoading = ref(false);
const isLoader = ref(false);
const $q = useQuasar();
const isFetchingArticleList = ref(false);
const articleList = ref<IArticleData[]>([]);
const isCategoryModalVisible = ref(false);
const apiController = ref<AbortController | null>(null);
const shopListRecords = ref<IShopResponse[]>([]);
const selectedShop = ref<IShopResponse[]>([]);
const stockResponse = ref<IShopStockReportData[]>([]);
let grandTotal = ref<number>(0);
onMounted(async () => {
  await getShopList();
  const defaultShop = shopListRecords.value.find(
    (shop) =>
      shop.shopId === (authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1)
  );
  selectedShop.value = defaultShop ? [defaultShop] : [];
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
  shopIds: [];
  excludeZeroStock: boolean;
  ProductId: IArticleData[];
  sortByArticle: string;
}>({
  categoryId: null,
  shopIds: [],
  categoryName: '',
  excludeZeroStock: true,
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
    filterSearch.value.shopIds = [];
  }
  filterSearch.value.categoryName = '';
  filterSearch.value.shopIds = [];
  filterSearch.value.categoryId = null;
  filterSearch.value.excludeZeroStock = true;
  filterSearch.value.sortByArticle = 'true';
  filterSearch.value.ProductId = [];
  stockResponse.value = [];
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
const getShopStock = async () => {
  if (!filterSearch.value.shopIds) {
    $q.notify({
      message: 'Please select a shop.',
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
    const res = await GetShopStockReport(
      {
        shopIds: selectedShop.value?.map((shop) => shop.shopId).join(','),
        categoryId: filterSearch.value.categoryId ?? 0,
        productIds: filterSearch.value.ProductId?.map(
          (product) => product.productId
        ).join(','),
        excludeZeroStock: filterSearch.value.excludeZeroStock,
        sortByArticle:
          filterSearch.value.sortByArticle === 'true' ? true : false,
      },
      apiController.value
    );
    stockResponse.value = res.data;
    grandTotal.value = 0;
    stockResponse.value.forEach((item: IShopStockReportData) => {
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
const downloadPdf = async (
  data: IShopStockReportData[],
  grandTotal: number
) => {
  const content = [];
  content.push({ text: 'Grand Total: ' + grandTotal, style: 'subHeading' });

  data.forEach((item) => {
    const tableBody = [];
    const headerRow = [
      'Article (Total)',
      'R.Price',
      'Color',
      ...getUniqueSizes(item.variant2List),
      'Total',
    ];
    tableBody.push(
      headerRow.map((header) => ({ text: header, style: 'tableHeader' }))
    );

    let isFirstRow = true;
    item.variant2List.forEach((variant) => {
      const row = [
        {
          text: isFirstRow ? item.article + ' (' + item.grandTotal + ')' : '',
          rowSpan: isFirstRow ? item.variant2List.length : undefined,
          style: isFirstRow ? 'tableCellCentered' : 'tableCell',
        },
        {
          text: isFirstRow ? item.retailPrice.toString() : '',
          style: 'tableCell',
        },
        { text: variant.variant2_Name, style: 'tableCell' },
      ];
      getUniqueSizes(item.variant2List).forEach((size: string) => {
        const v1 = variant.variant1List.find((v) => v.variant1_Name === size);
        const quantity = v1 ? v1.quantity : 0;
        row.push({
          text: quantity.toString(),
          style: 'tableCell',
        });
      });
      row.push({
        text: variant.totalQuantity.toString(),
        style: 'tableCell',
      });
      tableBody.push(row);
      isFirstRow = false;
    });

    const table = {
      table: {
        widths: Array(headerRow.length).fill('*'),
        headerRows: 1,
        body: tableBody,
        style: 'tableStyle',
      },
    };

    content.push(table);
    content.push({ text: '\n' });
  });

  const documentDefinition = {
    content: content,
    styles: {
      subHeading: { fontSize: 15, bold: true, margin: [0, 10, 0, 5] },
      tableStyle: { fontSize: 10, margin: [0, 5, 0, 15] },
      tableHeader: {
        fontSize: 10,
        bold: true,
        fillColor: '#CCCCCC',
        alignment: 'center',
      },
      tableCell: { fontSize: 10, allignment: 'center' },
      tableCellCentered: {
        fontSize: 10,
        alignment: 'center',
        verticalAlignment: 'middle',
      },
    },
  };

  const pdfDoc = pdfMake.createPdf(documentDefinition);
  pdfDoc.download('shop_stock_report.pdf');
};

const generateCSV = (data: IShopStockReportData[], grandTotal: number) => {
  const uniqueSizes = new Set<string>();
  data.forEach((item) => {
    item.variant2List.forEach((variant) => {
      variant.variant1List.forEach((v1) => {
        uniqueSizes.add(v1.variant1_Name);
      });
    });
  });

  const sortedSizes = Array.from(uniqueSizes).sort(
    (a, b) => Number(a) - Number(b)
  );

  const headers = [
    'Article',
    'Retail Price',
    'Color',
    ...sortedSizes,
    'Total',
    'Article Total',
  ];
  let csvContent = `Grand Total: ,${grandTotal}\n\n` + headers.join(',') + '\n';

  data.forEach((item) => {
    item.variant2List.forEach((variant, index) => {
      const row = [
        index === 0 ? item.article : '',
        index === 0 ? item.retailPrice.toString() : '',
        variant.variant2_Name,
        ...sortedSizes.map((size) => {
          const v1 = variant.variant1List.find((v) => v.variant1_Name === size);
          return v1 ? v1.quantity.toString() : '0';
        }),
        variant.totalQuantity.toString(),
        index === 0 ? item.grandTotal.toString() : '',
      ].join(',');
      csvContent += row + '\n';
    });
  });

  return csvContent;
};

const downloadExcel = (data: IShopStockReportData[], grandTotal: number) => {
  const csvContent = generateCSV(data, grandTotal);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'shop_stock_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert(
      'Your browser does not support downloading files. Please try again in a modern browser.'
    );
  }
};
</script>
