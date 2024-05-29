<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6 px-4"
    >
      <span class="text-xl font-medium">Article History Report</span>
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center min-h-[3.5rem] gap-4 px-4"
    >
      <q-select
        popup-content-class="!max-h-[200px]"
        class="min-w-[220px]"
        use-input
        dense
        map-options
        clearable
        outlined
        @filter="handleFilterArticles"
        :options="articleList"
        v-model="filterSearch.productId"
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
        :max="filterSearch.toDate"
        label="From"
        type="date"
        style="min-width: 200px"
        outlined
        dense
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.toDate"
        :min="filterSearch.fromDate"
        label="To"
        type="date"
        style="min-width: 200px"
        outlined
        color="btn-primary"
        dense
      />
      <div class="flex lg:justify-end sm:justify-center items-end gap-2">
        <q-btn
          unelevated
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="searchArticleHistoryReport()"
        />
        <q-btn
          unelevated
          color=""
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter()"
        />
      </div>
    </div>
    <div v-if="shouldShowReport">
      <div
        class="flex flex-col lg:flex-row items-center lg:items-baseline gap-2 md:gap-4 justify-center md:justify-between q-pa-md"
      >
        <div
          class="flex flex-col gap-2 md:min-w-[400px] md:gap-4 items-center md:items-start"
        >
          <div class="md:flex md:justify-between md:w-full items-center">
            <span class="font-medium md:text-lg"
              >Total Stock of Article Before
              {{
                filterSearch.fromDate
                  ? filterSearch.fromDate
                  : moment(timeStamp).format('YYYY-MM-DD')
              }}
              :</span
            >
            <span class="md:text-lg">
              {{ articleHistoryReportData.stock }}</span
            >
          </div>
          <div class="md:flex md:justify-between md:w-full items-center">
            <span class="font-medium md:text-lg">Article Retail :</span>
            <span class="md:text-lg">
              {{ articleHistoryReportData.retailPrice }}
            </span>
          </div>
        </div>
      </div>
      <div class="q-pa-md">
        <q-table
          bordered
          :loading="isLoading"
          :rows="articleHistoryReportData.purchaseInfo"
          :columns="purchaseInfoColumn"
          :rows-per-page-options="[0]"
          title="Article Purchase Info"
          row-key="id"
          :hide-bottom="articleHistoryReportData.purchaseInfo.length > 0"
        >
          <template
            v-if="articleHistoryReportData.purchaseInfo.length"
            v-slot:bottom-row
          >
            <q-tr class="sticky bottom-0 bg-white">
              <q-td colspan="1" class="text-bold"> Total </q-td>
              <q-td colspan="1" class="text-bold">
                {{ calculateArticlePurchaseQuantity('quantity') }}
              </q-td>
            </q-tr>
          </template>
          <template v-slot:no-data>
            <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
              <q-icon name="warning" size="xs" />
              <span class="text-md font-medium"> No data available. </span>
            </div>
          </template>
        </q-table>
      </div>
      <div class="q-pa-md">
        <q-table
          bordered
          :loading="isLoading"
          :rows="articleHistoryReportData.wholeSaleInfo"
          :columns="wholSaleInfoColumn"
          :rows-per-page-options="[0]"
          title="WholeSale Info"
          row-key="id"
          :hide-bottom="articleHistoryReportData.wholeSaleInfo.length > 0"
        >
          <template
            v-if="articleHistoryReportData.wholeSaleInfo.length"
            v-slot:bottom-row
          >
            <q-tr class="sticky bottom-0 bg-white">
              <q-td colspan="1" class="text-bold"> Total </q-td>
              <q-td colspan="1" class="text-bold">
                {{ calculateWholeSaleQuantity('quantity') }}
              </q-td>
            </q-tr>
          </template>
          <template v-slot:no-data>
            <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
              <q-icon name="warning" size="xs" />
              <span class="text-md font-medium"> No data available. </span>
            </div>
          </template>
        </q-table>
      </div>
      <div class="q-pa-md">
        <q-table
          bordered
          :loading="isLoading"
          :rows="articleHistoryReportData.grnInfo"
          :columns="hoGrnMeaningfulDetailColumn"
          :rows-per-page-options="[0]"
          title="HO To HO GRN Detail"
          row-key="id"
          :hide-bottom="articleHistoryReportData.grnInfo.length > 0"
        >
          <template
            v-if="articleHistoryReportData.grnInfo.length"
            v-slot:bottom-row
          >
            <q-tr class="sticky bottom-0 bg-white">
              <q-td colspan="1" class="text-bold"> Total </q-td>
              <q-td colspan="1" class="text-bold">
                {{ calculategrnInfoQuantity('quantity') }}
              </q-td>
            </q-tr>
          </template>
          <template v-slot:no-data>
            <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
              <q-icon name="warning" size="xs" />
              <span class="text-md font-medium"> No data available. </span>
            </div>
          </template>
        </q-table>
      </div>
      <div class="q-pa-md">
        <q-table
          bordered
          :loading="isLoading"
          :rows="articleHistoryReportData.strInfo"
          :columns="strDetailColumn"
          :rows-per-page-options="[0]"
          title="STR Detail"
          row-key="id"
          :hide-bottom="articleHistoryReportData.strInfo.length > 0"
        >
          <template
            v-if="articleHistoryReportData.strInfo.length"
            v-slot:bottom-row
          >
            <q-tr class="sticky bottom-0 bg-white">
              <q-td colspan="2" class="text-bold"> Total </q-td>
              <q-td colspan="1" class="text-bold">
                {{ calculateStrInfoQuantity('quantity') }}
              </q-td>
            </q-tr>
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
  </div>
</template>
<script setup lang="ts">
import { IArticleData, IArticleHistoryReport } from 'src/interfaces';
import { GetArticleList } from 'src/services';
import { date, useQuasar } from 'quasar';
import {
  purchaseInfoColumn,
  wholSaleInfoColumn,
  hoGrnMeaningfulDetailColumn,
  strDetailColumn,
} from 'src/utils/reports';
import { GetArticleHistoryReport } from 'src/services/reports';
import { isPosError } from 'src/utils';
import { ref, computed } from 'vue';
import moment from 'moment';
const isLoading = ref(false);
const $q = useQuasar();
const isFetchingArticleList = ref(false);
const articleList = ref<IArticleData[]>([]);
const timeStamp = Date.now();
const next1Day = date.subtractFromDate(timeStamp, { day: -1 });
const formattedToDate = date.formatDate(next1Day, 'YYYY-MM-DD');
const past1Month = date.subtractFromDate(timeStamp, { month: 1 });
const formattedFromDate = date.formatDate(past1Month, 'YYYY-MM-DD');
const filterSearch = ref<{
  fromDate: string;
  toDate: string;
  productId: IArticleData | null;
}>({
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  productId: null,
});
const articleHistoryReportData = ref<IArticleHistoryReport>({
  stock: null,
  retailPrice: null,
  purchaseInfo: [],
  wholeSaleInfo: [],
  grnInfo: [],
  strInfo: [],
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
  filterSearch.value.fromDate = '';
  filterSearch.value.toDate = '';
  filterSearch.value.productId = null;
  articleHistoryReportData.value = {
    stock: null,
    retailPrice: null,
    purchaseInfo: [],
    wholeSaleInfo: [],
    grnInfo: [],
    strInfo: [],
  };
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
const searchArticleHistoryReport = async () => {
  if (!filterSearch.value.productId) {
    $q.notify({
      message: 'Please Select Product',
      icon: 'error',
      color: 'red',
    });
    return;
  } else if (!filterSearch.value.fromDate || !filterSearch.value.toDate) {
    $q.notify({
      message: 'Please Select From and To Date',
      icon: 'error',
      color: 'red',
    });
    return;
  }
  isLoading.value = true;
  try {
    const res = await GetArticleHistoryReport({
      productId: filterSearch.value.productId.productId,
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
    });
    if (res.data) {
      articleHistoryReportData.value = res.data;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  isLoading.value = false;
};
const calculateArticlePurchaseQuantity = (
  columnName: keyof (typeof articleHistoryReportData.value.purchaseInfo)[0]
) => {
  return articleHistoryReportData.value.purchaseInfo.reduce(
    (total, row) => total + Number(row[columnName]),
    0
  );
};
const calculateWholeSaleQuantity = (
  columnName: keyof (typeof articleHistoryReportData.value.wholeSaleInfo)[0]
) => {
  return articleHistoryReportData.value.wholeSaleInfo.reduce(
    (total, row) => total + Number(row[columnName]),
    0
  );
};
const calculategrnInfoQuantity = (
  columnName: keyof (typeof articleHistoryReportData.value.grnInfo)[0]
) => {
  return articleHistoryReportData.value.grnInfo.reduce(
    (total, row) => total + Number(row[columnName]),
    0
  );
};
const calculateStrInfoQuantity = (
  columnName: keyof (typeof articleHistoryReportData.value.strInfo)[0]
) => {
  return articleHistoryReportData.value.strInfo.reduce(
    (total, row) => total + Number(row[columnName]),
    0
  );
};
const shouldShowReport = computed(() => {
  const data = articleHistoryReportData.value;
  return (
    data.stock !== null ||
    data.retailPrice !== null ||
    data.purchaseInfo.length > 0 ||
    data.wholeSaleInfo.length > 0 ||
    data.grnInfo.length > 0 ||
    data.strInfo.length > 0
  );
});
</script>
