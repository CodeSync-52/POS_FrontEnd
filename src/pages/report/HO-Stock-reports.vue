<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">HO Stock Reports</span>
      <download-pdf-excel
        @downloadPdfData="downloadPdfData"
        @downloadCSVData="downloadCSVData"
      />
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
        v-model="filterSearch.userData"
        @update:model-value="filterSearch.userData"
        :options="options"
        map-options
        popup-content-class="!max-h-[200px]"
        option-label="fullName"
        option-value="userId"
        label="User"
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
      <q-select
        popup-content-class="!max-h-[200px]"
        class="min-w-[220px]"
        use-input
        dense
        map-options
        clearable
        multiple
        outlined
        :options="articleList"
        v-model="filterSearch.ProductId"
        @filter="handleFilterArticles"
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
          v-model="filterSearch.sortByStock"
          color="btn-primary"
          val="true"
          label="Sort by stock"
        />
        <q-radio
          v-model="filterSearch.sortByStock"
          color="btn-primary"
          val="false"
          label="Sort by article"
        />
      </div>
      <q-checkbox
        v-model="filterSearch.includeZeroStock"
        color="btn-primary"
        label="Include Zero Stock"
      />
      <q-checkbox
        v-model="filterSearch.showOnlyZeroStock"
        color="btn-primary"
        label="Show Only Zero Stock"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          unelevated
          :disable="
            filterSearch.userData !== null &&
            (filterSearch.userData?.userId ?? 0) < 0
          "
          @click="getReceiptList()"
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
    <div class="py-4">
      <q-table
        :loading="isLoading"
        tabindex="0"
        align="left"
        :rows="reportData"
        :columns="HOStockReportColumn"
        :pagination="{ rowsPerPage: 0 }"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-productImage="props">
          <q-td :props="props">
            <div
              class="h-[100px] w-[100px] min-w-[2rem] overflow-hidden"
              :class="props.row.productImage ? 'cursor-pointer' : ''"
            >
              <img
                class="w-full h-full object-cover"
                :src="props.row.productImage || 'assets/default-image.png'"
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
    <q-dialog v-model="isLoader" persistent>
      <q-spinner-ios size="78px" color="btn-primary" />
      <span class="ml-2 text-base font-[500]">Generating PDF...</span>
    </q-dialog>
    <q-dialog v-model="isLoadingExcel" persistent>
      <q-spinner-ios size="78px" color="btn-primary" />
      <span class="ml-2 text-base font-[500]">Generating Excel...</span>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { CanceledError } from 'axios';
import { exportFile, useQuasar } from 'quasar';
import {
  IArticleData,
  IHOStockReportData,
  IUserResponse,
} from 'src/interfaces';
import ArticleCategoryModal from 'src/components/article-management/Article-Category-Modal.vue';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { GetArticleList, GetUsers } from 'src/services';
import { GetHOStockReport, wrapCsvValue } from 'src/services/reports';
import { isPosError, IPdfHeaders, ITableItems, downloadPdf } from 'src/utils';
import { processTableItems } from 'src/utils/process-table-items';
import { HOStockReportColumn } from 'src/utils/reports';
import { onMounted, onUnmounted, ref } from 'vue';
const isLoader = ref(false);
const isLoading = ref(false);
const isLoadingExcel = ref(false);
const apiController = ref<AbortController | null>(null);
const tableItems = ref<ITableItems[][]>([]);
const UserList = ref<IUserResponse[]>([]);
const $q = useQuasar();
const options = ref<IUserResponse[]>([]);
const reportData = ref<IHOStockReportData[]>([]);
const isFetchingArticleList = ref(false);
const isCategoryModalVisible = ref(false);
const articleList = ref<IArticleData[]>([]);
const filterSearch = ref<{
  userData: null | IUserResponse;
  categoryId: number | null;
  categoryName: string;
  sortByStock: string;
  includeZeroStock: boolean;
  showOnlyZeroStock: boolean;
  ProductId: IArticleData[];
}>({
  userData: null,
  categoryId: null,
  categoryName: '',
  sortByStock: 'false',
  includeZeroStock: false,
  showOnlyZeroStock: false,
  ProductId: [],
});

onMounted(() => {
  getUserList();
});
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
const getUserList = async () => {
  isLoading.value = true;
  try {
    const res = await GetUsers({
      pageNumber: 1,
      pageSize: 5000,
    });
    if (res?.data) {
      UserList.value = res.data.items.filter(
        (user) => user.status === 'Active' && user.roleName === 'Customer'
      );
      options.value = res.data.items.filter((x) => x.roleName === 'Customer');
    }
  } catch (e) {
    if (e instanceof CanceledError) return;
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
const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = UserList.value.filter((v) =>
      v.fullName?.toLowerCase().includes(needle)
    );
  });
};
const addCategory = () => {
  isCategoryModalVisible.value = true;
};
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    userData: null,
    categoryId: null,
    categoryName: '',
    sortByStock: 'false',
    includeZeroStock: true,
    showOnlyZeroStock: true,
    ProductId: [],
  };
  getReceiptList();
};

const getReceiptList = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await GetHOStockReport(
      {
        userId: filterSearch.value.userData?.userId ?? null,
        categoryId: filterSearch.value.categoryId,
        productIds: filterSearch.value.ProductId.map(
          (product) => product.productId
        ).join(','),
        includeZeroStock: filterSearch.value.includeZeroStock,
        showOnlyZeroStock: filterSearch.value.showOnlyZeroStock,
        sortByStock: filterSearch.value.sortByStock === 'true' ? true : false,
      },
      apiController.value
    );
    if (res?.data) {
      reportData.value = res.data?.list;
      tableItems.value = await convertArrayToPdfData(res.data?.list);
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
  isLoading.value = false;
};
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
      CategoryId: null,
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

const handleSelectedCategory = (selectedCategory: {
  categoryName: string;
  categoryId: number;
}) => {
  filterSearch.value.categoryName = selectedCategory.categoryName;
  filterSearch.value.categoryId = selectedCategory.categoryId;
  isCategoryModalVisible.value = false;
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
const defaultImage = ref<string | null>(null);
async function convertArrayToPdfData(array: IHOStockReportData[]) {
  if (!defaultImage.value) {
    defaultImage.value = await fetch('/assets/default-image.png')
      .then((res) => res.blob())
      .then((fileBlob) => {
        const imageFile = new File([fileBlob], 'default-image.png');
        return convertToBase64(imageFile);
      });
  }
  const tableStuff = [];
  const headerRow = ['Article', 'Image', 'Master Stock'];
  tableStuff.push(headerRow);

  array.forEach((item: IHOStockReportData) => {
    const row = [
      { text: item.productName },
      {
        image: item.productImage || defaultImage.value,
        width: 50,
        height: 50,
      },
      { text: item.masterStock },
    ];
    tableStuff.push(row);
  });
  return tableStuff;
}
async function downloadPdfData() {
  isLoader.value = true;
  const headers: IPdfHeaders[] = [
    {
      heading: '',
      content: '',
    },
    {
      heading: '',
      content: '',
    },
    {
      heading: 'User',
      content: filterSearch.value.userData?.fullName,
    },
    {
      heading: 'Category',
      content: filterSearch.value.categoryName,
    },
    {
      heading: 'Article',
      content:
        filterSearch.value.ProductId && filterSearch.value.ProductId.length > 0
          ? filterSearch.value.ProductId[0].name
          : '',
    },
  ];
  const myFileName = 'HO-Stock-reports.pdf';
  const tableDataWithImage: ITableItems[][] = await processTableItems(
    tableItems.value
  );
  downloadPdf({
    filename: myFileName,
    tableData: JSON.parse(JSON.stringify(tableDataWithImage)),
    pdfHeaders: headers,
    title: 'HO-Stock-Report',
  });
  isLoader.value = false;
}

const downloadCSVData = () => {
  isLoadingExcel.value = true;
  const selectedColumnsData = HOStockReportColumn.filter(
    (col) => col.name !== 'productImage'
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

  const status = exportFile('HO-Stock-reports.csv', content, 'text/csv');

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning',
    });
  }
  isLoadingExcel.value = false;
};
</script>
