<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-xl font-medium">New Article Sale And Stock Report</span>
      <q-btn-dropdown
        dropdown-icon="arrow_downward"
        label="Download Report"
        class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover text-white"
      >
        <q-list>
          <q-item
            clickable
            v-close-popup
            @click="downloadPdf(newArticleSaleAndStockrResponse)"
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
        style="min-width: 200px"
        outlined
        map-options
        :options="shopData"
        :disable="
          authStore.loggedInUser?.rolePermissions.roleName ===
            EUserRoles.ShopManager.toLowerCase() ||
          authStore.loggedInUser?.rolePermissions.roleName ===
            EUserRoles.ShopOfficer.toLowerCase()
        "
        v-model="selectedShop"
        popup-content-class="!max-h-[200px]"
        label="Select Shop"
        color="btn-primary"
        multiple
        clearable
        option-label="name"
        option-value="shopId"
      />
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
      <div class="flex gap-6">
        <div class="q-gutter-sm">
          <q-radio
            v-model="filterSearch.sortBySale"
            color="btn-primary"
            val="true"
            label="Sort by Sale"
          />
          <q-radio
            v-model="filterSearch.sortBySale"
            color="btn-primary"
            val="false"
            label="Sort by Stock"
          />
        </div>
      </div>
      <div class="flex lg:justify-end sm:justify-center items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          unelevated
          @click="searchShopwiseStockTransferReport()"
        />
        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter()"
        />
      </div>
    </div>
    <div id="shop-article-quantity-sale" class="container mx-auto mt-2">
      <div class="text-[24px] font-bold text-btn-primary mb-1 mx-1">
        Grand Total Sale : {{ overallTotalSale }}
      </div>
      <div class="text-[24px] font-bold text-btn-primary mb-3 mx-1">
        Grand Total Stock : {{ overallTotalStock }}
      </div>
      <div>
        <div
          v-for="item in newArticleSaleAndStockrResponse"
          :key="item.article"
          class="mb-8 border p-2"
        >
          <div
            class="my-4 flex flex-row items-center justify-between gap-2 px-1"
          >
            <div class="text-lg font-bold">
              <div>{{ item.article }}</div>
              <div>Retail Price: {{ item.retailPrice }}</div>
            </div>
            <div class="text-lg font-bold">
              <div>Total Sale : {{ item.totalSale }}</div>
              <div>Total Stock : {{ item.totalStock }}</div>
            </div>
          </div>
          <table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                  Color (Sale)
                </th>
                <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="colorDetails in item.colorDetails"
                :key="colorDetails.variantId_2"
              >
                <td class="border border-gray-300 px-4 py-2 text-center">
                  {{ colorDetails.variant2_Name }} ({{
                    colorDetails.saleQuantity
                  }})
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  {{ colorDetails.stockQuantity }}
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
import { ref, onMounted, computed } from 'vue';
import {
  IShopResponse,
  EUserRoles,
  INewArticleSaleAndStockReportData,
} from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError } from 'src/utils';
import { useAuthStore } from 'src/stores';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import { GetNewArticleSaleAndStockReport } from 'src/services/reports';
import pdfMake from 'pdfmake/build/pdfmake';
const $q = useQuasar();
const authStore = useAuthStore();
const isLoading = ref(false);
const timeStamp = Date.now();
const isFetchingShopList = ref(false);
const shopData = ref<IShopResponse[]>([]);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past1Month = date.subtractFromDate(timeStamp, { month: 1 });
const formattedFromDate = date.formatDate(past1Month, 'YYYY-MM-DD');
const selectedShop = ref<IShopResponse[]>([]);
const newArticleSaleAndStockrResponse = ref<
  INewArticleSaleAndStockReportData[]
>([]);
const filterSearch = ref<{
  fromDate: string;
  toDate: string;
  shopIds: [];
  sortBySale: string;
}>({
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  shopIds: [],
  sortBySale: 'true',
});
onMounted(async () => {
  await getShopList();
  const defaultShop = shopData.value.find(
    (shop) =>
      shop.shopId === (authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1)
  );
  selectedShop.value = defaultShop ? [defaultShop] : [];
});
const getShopList = async () => {
  isFetchingShopList.value = true;
  try {
    const response = await GetShopList({
      PageNumber: 1,
      PageSize: 25,
    });
    if (response.data) {
      shopData.value = response.data.items;
    }
  } catch (error) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  } finally {
    isFetchingShopList.value = false;
  }
};
const searchShopwiseStockTransferReport = async () => {
  isLoading.value = true;
  if (!filterSearch.value.shopIds) {
    isLoading.value = false;
    $q.notify({
      message: 'Please Select Shop',
      icon: 'error',
      color: 'red',
    });
    return;
  } else if (!filterSearch.value.fromDate || !filterSearch.value.toDate) {
    isLoading.value = false;
    $q.notify({
      message: 'Please Select From and To Date',
      icon: 'error',
      color: 'red',
    });
    return;
  }
  try {
    const res = await GetNewArticleSaleAndStockReport({
      shopIds: selectedShop.value?.map((shop) => shop.shopId).join(','),
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
      sortBySale: filterSearch.value.sortBySale === 'true' ? true : false,
    });
    if (res.data) {
      newArticleSaleAndStockrResponse.value = res.data;
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
  } finally {
    isLoading.value = false;
  }
};
const handleResetFilter = () => {
  if (
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopManager.toLowerCase() ||
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopOfficer.toLowerCase()
  ) {
    selectedShop.value = [];
  }
  newArticleSaleAndStockrResponse.value = [];
  filterSearch.value.fromDate = '';
  filterSearch.value.toDate = '';
};
const overallTotalSale = computed(() => {
  return newArticleSaleAndStockrResponse.value.reduce(
    (total, item) => total + item.totalSale,
    0
  );
});
const overallTotalStock = computed(() => {
  return newArticleSaleAndStockrResponse.value.reduce(
    (total, item) => total + item.totalStock,
    0
  );
});
const downloadPdf = (data: INewArticleSaleAndStockReportData[]) => {
  const content: any[] = [
    {
      text: `Grand Total Sale: ${overallTotalSale.value}`,
      style: 'subHeading',
    },
    {
      text: `Grand Total Stock: ${overallTotalStock.value}`,
      style: 'subHeading',
    },
    { text: '\n' },
  ];
  data.forEach((item) => {
    content.push({
      columns: [
        { text: `Article: ${item.article}`, style: 'sectionHeading' },
        { text: `Retail Price: ${item.retailPrice}`, style: 'sectionHeading' },
        { text: `Total Sale: ${item.totalSale}`, style: 'sectionHeading' },
        { text: `Total Stock: ${item.totalStock}`, style: 'sectionHeading' },
      ],
    });
    const tableBody = [
      [
        { text: 'Color (Sale)', style: 'tableHeader' },
        { text: 'Stock', style: 'tableHeader' },
      ],
    ];
    item.colorDetails.forEach((color) => {
      tableBody.push([
        {
          text: `${color.variant2_Name} (${color.saleQuantity})`,
          style: 'tableCell',
        },
        { text: color.stockQuantity.toString(), style: 'tableCell' },
      ]);
    });
    content.push(
      {
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: tableBody,
        },
        layout: 'lightHorizontalLines',
      },
      { text: '\n' }
    );
  });
  const documentDefinition = {
    content,
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
      sectionHeading: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        fillColor: '#F4F5F4',
        alignment: 'center',
      },
      tableCell: {
        fontSize: 10,
        alignment: 'center',
      },
    },
  };
  pdfMake
    .createPdf(documentDefinition)
    .download('new_article_sale_and_report.pdf');
};
</script>
