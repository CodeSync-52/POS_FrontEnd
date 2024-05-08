<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">Shop Sale Stock Report</span>
      <q-btn-dropdown
        dropdown-icon="arrow_downward"
        label="Download Report"
        class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover text-white"
      >
        <q-list>
          <q-item
            clickable
            @click="downloadPdf(shopSaleStockReportData, grandTotal)"
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
        popup-content-class="!max-h-[200px]"
        class="min-w-[220px]"
        ref="productSelectInputRef"
        dense
        autofocus
        use-input
        map-options
        outlined
        @filter="handleFilterArticles"
        :options="articleList"
        :loading="isFetchingArticleList"
        v-model="filterSearch.productId"
        @update:model-value="filterSearch.productId = $event.productId"
        label="Select Product"
        color="btn-primary"
        option-label="name"
        option-value="productId"
        ><template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template></q-select
      >

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
          @click="getSaleStockReport()"
        />
        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter"
        />
      </div>
    </div>
    <div class="container mx-auto mt-2">
      <div class="text-[16px] font-bold text-btn-primary pb-1 pr-4">
        Grand Total Sale: {{ grandTotal }}
      </div>
      <div>
        <div v-for="item in shopSaleStockReportData" :key="item.variant2_Id">
          <h2 class="text-lg font-bold mt-4">
            {{ item.variant2_Name }} - COLOR
          </h2>
          <table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th class="border border-gray-300 bg-gray-100 px-4 py-2"></th>
                <th
                  v-for="variant in item.shopQty[0].list"
                  :key="variant.variant1_Id"
                  class="border border-gray-300 bg-gray-100 px-4 py-2"
                >
                  {{ variant.variant1_Name }}
                </th>
                <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                  Total Sale Qty.
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="shopQty in item.shopQty" :key="shopQty.shop">
                <td class="border border-gray-300 px-4 py-2">
                  {{ shopQty.shop }}
                </td>
                <td
                  v-for="variant in shopQty.list"
                  :key="variant.variant1_Id"
                  class="border border-gray-300 px-4 py-2 text-center"
                >
                  {{ variant.stockQuantity }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  {{ shopQty.totalSaleQuantity }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { date, QSelect, useQuasar } from 'quasar';
import {
  IArticleData,
  IShopQuantity,
  IShopSaleStockReportData,
} from 'src/interfaces';
import { GetArticleList } from 'src/services';
import { GetShopSaleStockReport } from 'src/services/reports';
import { isPosError } from 'src/utils';
import pdfMake from 'pdfmake/build/pdfmake';
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const $q = useQuasar();
const articleList = ref<IArticleData[]>([]);
const timeStamp = Date.now();
const isFetchingArticleList = ref(false);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past30Date = date.subtractFromDate(timeStamp, { year: 1 });
const formattedFromDate = date.formatDate(past30Date, 'YYYY-MM-DD');
const productSelectInputRef = ref<QSelect | null>(null);
const shopSaleStockReportData = ref<IShopSaleStockReportData[]>([]);
let grandTotal = ref<number>(0);
const filterSearch = ref<{
  productId: number | null;
  fromDate: string;
  toDate: string;
}>({
  productId: null,
  fromDate: formattedFromDate,
  toDate: formattedToDate,
});

onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});

const handleFilterArticles = (value: any, update: CallableFunction) => {
  update(() => {
    getArticleList(value);
  });
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
    });
    if (res.type === 'Success') {
      if (res.data) {
        articleList.value = res.data.items;
      }
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
  isFetchingArticleList.value = false;
};

const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    productId: null,
    fromDate: '',
    toDate: '',
  };
  grandTotal.value = 0;
};

const getSaleStockReport = async () => {
  if (isLoading.value) return;
  if (
    !filterSearch.value.productId ||
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
    const res = await GetShopSaleStockReport(
      {
        toDate: filterSearch.value.toDate,
        fromDate: filterSearch.value.fromDate,
        productId: filterSearch.value.productId,
      },
      apiController.value
    );
    shopSaleStockReportData.value = res.data;

    grandTotal.value = 0;
    shopSaleStockReportData.value.forEach((item: IShopSaleStockReportData) => {
      if (item && item.shopQty) {
        item.shopQty.forEach((shpqty: IShopQuantity) => {
          if (shpqty && shpqty.totalSaleQuantity) {
            grandTotal.value += shpqty.totalSaleQuantity;
          }
        });
      }
    });
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
const downloadPdf = (data: IShopSaleStockReportData[], grandTotal: number) => {
  const content = [
    { text: 'Shop Sale Stock Report', style: 'mainHeading' },
    { text: `Grand Total Sale: ${grandTotal}`, style: 'subHeading' },
    { text: '' }, // Add some space
    ...data.flatMap((item: IShopSaleStockReportData) => {
      const itemContent = [
        { text: `${item.variant2_Name} - COLOR\n`, style: 'subheader' },
        {
          table: {
            widths: ['auto', ...item.shopQty[0].list.map(() => 'auto'), 'auto'],
            style: 'tableStyle',
            body: [
              [
                { text: 'Shop', style: 'tableHeader' },
                ...item.shopQty[0].list.map((variant) => ({
                  text: variant.variant1_Name,
                  style: 'tableHeader',
                })),
                { text: 'Total Sale Qty.', style: 'tableHeader' },
              ],
              ...item.shopQty.map((shopQty: IShopQuantity) => [
                { text: shopQty.shop, alignment: 'center' }, // Align shop name to the center
                ...shopQty.list.map((variant) => ({
                  text: variant.stockQuantity.toString(),
                  alignment: 'center',
                })),
                {
                  text: shopQty.totalSaleQuantity.toString(),
                  alignment: 'center',
                }, // Align total sale quantity to the center
              ]),
            ],
          },
        },
      ];
      return itemContent;
    }),
  ];

  const documentDefinition = {
    content: content,
    styles: {
      mainHeading: {
        fontSize: 20,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      subHeading: { fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      tableStyle: { margin: [0, 5, 0, 15], alignment: 'center' }, // Align table content to the center
      tableHeader: { bold: true, fillColor: '#CCCCCC', alignment: 'center' }, // Header cell style
    },
  };
  // Generate and download PDF
  pdfMake.createPdf(documentDefinition).download('shop_sale_stock_report.pdf');
};
</script>
