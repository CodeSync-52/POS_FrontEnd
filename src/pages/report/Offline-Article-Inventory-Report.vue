<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
  >
    <span class="text-xl font-medium"
      >Offline Shop Article Inventory Report</span
    >
    <download-pdf-excel
      @downloadPdfData="downloadPdfData"
      @downloadCSVData="downloadCSVData"
    />
  </div>
  <div
    class="row flex lg:justify-end sm:justify-center items-center min-h-[3.5rem] gap-4"
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
      v-model="selectedCategoryName"
      dense
      readonly
      label="Select Category"
      outlined
      @click="addCategory"
      color="btn-primary"
    />
    <q-select
      dense
      style="min-width: 200px"
      outlined
      v-model="filterSearch.showZeroStock"
      :options="showOnlyZeros"
      map-options
      popup-content-class="!max-h-[200px]"
      label="Show Zero"
      color="btn-primary"
    >
    </q-select>
    <div class="flex gap-6">
      <div class="flex justify-between items-center">
        <span class="text-lg">Sort By :</span>
        <div class="q-gutter-sm">
          <q-radio
            v-model="filterSearch.sortBy"
            color="btn-primary"
            :val="1"
            label="Article"
          />
          <q-radio
            v-model="filterSearch.sortBy"
            color="btn-primary"
            :val="2"
            label="Retial Price"
          />
          <q-radio
            v-model="filterSearch.sortBy"
            color="btn-primary"
            :val="3"
            label="Stock"
          />
          <q-radio
            v-model="filterSearch.sortBy"
            color="btn-primary"
            :val="4"
            label="Commission"
          />
        </div>
      </div>
      <div class="flex lg:justify-end sm:justify-center items-end gap-2">
        <q-btn
          unelevated
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="offlineShopArticelInventoryReport()"
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
  </div>

  <div class="py-4">
    <q-table
      :loading="isLoading"
      tabindex="0"
      :rows="reportData"
      align="left"
      :columns="offlinesShopArticleInventoryReport"
      row-key="id"
      :rows-per-page-options="[0]"
      @request="offlineShopArticelInventoryReport()"
      :pagination="{ rowsPerPage: 0 }"
      :hide-bottom="reportData.length > 0"
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <div
            class="h-[100px] w-[100px] min-w-[2rem] overflow-hidden"
            :class="props.row.image"
          >
            <img
              class="w-full h-full object-cover"
              :src="props.row.image || 'assets/default-image.png'"
              alt="img"
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

  <q-dialog v-model="isCategoryModalVisible">
    <article-category-modal @category-selected="handleSelectedCategory" />
  </q-dialog>

  <q-dialog v-model="isPdfLoading" persistent>
    <q-spinner-ios size="78px" color="btn-primary" />
    <span class="ml-2 text-base font-[500]">Generating PDF...</span>
  </q-dialog>
  <q-dialog v-model="isExcelLoading" persistent>
    <q-spinner-ios size="78px" color="btn-primary" />
    <span class="ml-2 text-base font-[500]">Generating Excel...</span>
  </q-dialog>
</template>
<script setup lang="ts">
import ArticleCategoryModal from 'src/components/article-management/Article-Category-Modal.vue';
import { ref, onMounted } from 'vue';
import {
  IShopResponse,
  EUserRoles,
  IOfflineShopArticleReportData,
} from 'src/interfaces';
import { GetShopList } from 'src/services';
import { ITableItems, downloadPdf, isPosError } from 'src/utils';
import { useAuthStore } from 'src/stores';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { offlinesShopArticleInventoryReport } from 'src/utils/reports';
import { exportFile, useQuasar } from 'quasar';
import {
  GetOfflineShopArticleInventoryReport,
  wrapCsvValue,
} from 'src/services/reports';
import { processTableItems } from 'src/utils/process-table-items';
const $q = useQuasar();
const authStore = useAuthStore();
const isLoading = ref(false);
const isCategoryModalVisible = ref(false);
const selectedCategoryName = ref('');
const isPdfLoading = ref(false);
const isExcelLoading = ref(false);
const defaultImage = ref<string | null>(null);
const isFetchingShopList = ref(false);
const tableItems = ref<ITableItems[][]>([]);
const shopListRecords = ref<IShopResponse[]>([]);
const selectedShop = ref<IShopResponse[]>([]);
const filterSearch = ref<{
  shopId: number | null;
  sortBy: number;
  categoryId: any;
  showZeroStock: string;
}>({
  shopId: null,
  sortBy: 1,
  categoryId: null,
  showZeroStock: 'false',
});
const reportData = ref<IOfflineShopArticleReportData[]>([]);
onMounted(async () => {
  await getShopList();
  filterSearch.value.shopId =
    authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1;
});
const getShopList = async () => {
  isFetchingShopList.value = true;
  try {
    const response = await GetShopList({
      PageNumber: 1,
      PageSize: 25,
    });
    if (response.data) {
      shopListRecords.value = response.data.items;
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
const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    shopListRecords.value = shopListRecords.value.filter((v) =>
      v.name?.toLowerCase().includes(needle)
    );
  });
};
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
const offlineShopArticelInventoryReport = async () => {
  isLoading.value = true;
  if (!filterSearch.value.shopId) {
    isLoading.value = false;
    $q.notify({
      message: 'Please Select Shop',
      icon: 'error',
      color: 'red',
    });
    return;
  }
  try {
    const res = await GetOfflineShopArticleInventoryReport({
      shopId: filterSearch.value.shopId,
      categoryId: filterSearch.value.categoryId ?? 0,
      sortBy: filterSearch.value.sortBy,
      showZeroStock: filterSearch.value.showZeroStock === 'true',
    });
    if (res?.data) {
      reportData.value = res.data;
      tableItems.value = await convertArrayToPdfData(res?.data);
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
const showOnlyZeros = ['false', 'true'];

const handleResetFilter = () => {
  if (
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopManager.toLowerCase() ||
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopOfficer.toLowerCase()
  ) {
    selectedShop.value = [];
  }
  reportData.value = [];
  filterSearch.value.categoryId = null;
  selectedCategoryName.value = '';
};

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result && typeof fileReader.result === 'string') {
        const resultParts = fileReader.result.split(',');
        if (resultParts.length === 2) {
          resolve(resultParts[1]);
        } else {
          reject(new Error('Invalid data URL format'));
        }
      }
    };

    fileReader.onerror = (error) => {
      reject(error);
    };

    fileReader.readAsDataURL(file);
  });
};
async function convertArrayToPdfData(array: IOfflineShopArticleReportData[]) {
  if (!defaultImage.value) {
    defaultImage.value = await fetch('/assets/default-image.png')
      .then((res) => res.blob())
      .then((fileBlob) => {
        const imageFile = new File([fileBlob], 'default-image.png');
        return convertToBase64(imageFile);
      });
  }
  const tableStuff = [];
  const headerRow = ['Article', 'Image', 'Price', 'Stock', 'Comission'];
  tableStuff.push(headerRow);

  array.forEach((item: IOfflineShopArticleReportData) => {
    const row = [
      { text: item.article },
      {
        image: item.image || defaultImage.value,
        width: 50,
        height: 50,
      },
      { text: item.retailPrice },
      { text: item.totalStock },
      { text: item.comission },
    ];
    tableStuff.push(row);
  });
  return tableStuff;
}

async function downloadPdfData() {
  isPdfLoading.value = true;

  const myFileName = 'Offline-Article-Inventory-Report.pdf';
  const tableDataWithImage: ITableItems[][] = await processTableItems(
    tableItems.value
  );
  downloadPdf({
    filename: myFileName,
    tableData: JSON.parse(JSON.stringify(tableDataWithImage)),
    title: 'Offline-Article-Inventory-Report',
  });
  isPdfLoading.value = false;
}

const downloadCSVData = () => {
  isExcelLoading.value = true;
  const selectedColumnsData = offlinesShopArticleInventoryReport.filter(
    (col) => col.name !== 'image'
  );
  const content = [selectedColumnsData.map((col) => wrapCsvValue(col.label))]
    .concat(
      reportData.value.map((row: any) =>
        selectedColumnsData
          .map((col) =>
            wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(',')
      )
    )
    .join('\r\n');

  const status = exportFile(
    'Offline-Articel-Inventory-Report.csv',
    content,
    'text/csv'
  );
  isExcelLoading.value = false;
  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning',
    });
  }
};
</script>
