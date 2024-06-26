<template>
  <div>
    <div
      class="text-lg text-center md:text-left font-medium mb-4 row justify-between items-center"
    >
      <span>{{
        isEdit
          ? 'Update Receipt'
          : isReceiptPreview
          ? 'Preview Receipt'
          : 'Add New Receipt'
      }}</span>
      <q-btn
        v-if="isReceiptPreview"
        color="btn-primary"
        class="mb-2"
        unelevated
        label="Download PDF"
        @click="downloadPdfData"
      />
    </div>
    <q-card>
      <q-card-section class="q-gutter-y-md">
        <div class="row q-col-gutter-md items-center">
          <div class="col-md-4 w-full col-sm-12">
            <outside-click-container @outside-click="handleOutsideClick">
              <div>
                <q-select
                  :options="options"
                  :loading="isLoading"
                  use-input
                  dense
                  map-options
                  outlined
                  popup-content-class="!max-h-[200px]"
                  @filter="filterFn"
                  v-model="addNewReceipt.userId"
                  @update:model-value="addNewReceipt.userId = $event.userId"
                  label="Select User"
                  autofocus
                  color="btn-primary"
                  option-label="fullName"
                  option-value="userId"
                  :disable="isEdit || isReceiptPreview"
                  @keydown="dialoagClose"
                  ><template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template></q-select
                >
              </div>
            </outside-click-container>
          </div>
          <div v-if="!isReceiptPreview" class="col-12 col-md-4">
            <div class="q-gutter-y-xs">
              <div class="row gap-6 items-center">
                <span class="text-base">Article</span>
                <q-btn
                  icon="add"
                  rounded
                  unelevated
                  dense
                  @click="isArticleListModalVisible = true"
                  color="btn-primary"
                />
              </div>
            </div>
          </div>
        </div>
        <q-table
          v-if="selectedArticleData.length > 0"
          :loading="isLoading"
          tabindex="0"
          :rows="selectedArticleData"
          align="left"
          :columns="selectedArticleColumn"
          row-key="name"
          v-model:pagination="pagination"
          hide-pagination
        >
          <template v-slot:body-cell-image="props">
            <q-td :props="props" class="!h-[71px]">
              <div
                @click="handlePreviewImage(props.row.productImage)"
                class="w-[100px] h-[100px] min-w-[2rem] overflow-hidden"
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

          <template v-slot:body-cell-action="props" v-if="!isReceiptPreview">
            <q-td :props="props">
              <div class="flex gap-2 flex-nowrap">
                <q-btn
                  @click="saveUpdatedData(props.row)"
                  v-if="
                    isEdit &&
                    authStore.checkUserHasPermission(
                      EUserModules.ReceiptManagement,
                      EActionPermissions.Update
                    )
                  "
                  size="sm"
                  flat
                  dense
                  unelevated
                  :disable="props.row.quantity < 1"
                  icon="check"
                  color="green"
                />
                <q-btn
                  v-if="
                    !isEdit ||
                    (isEdit &&
                      authStore.checkUserHasPermission(
                        EUserModules.ReceiptManagement,
                        EActionPermissions.Update
                      ))
                  "
                  size="sm"
                  flat
                  dense
                  unelevated
                  icon="delete"
                  color="red"
                  @click="onDeleteButtonClick(props.row)"
                />
              </div>
            </q-td>
          </template>

          <template v-slot:header-cell-action v-if="isReceiptPreview">
            <q-th> </q-th>
          </template>

          <template v-slot:body-cell-quantity="props">
            <q-td :props="props">
              <div class="flex gap-2 flex-nowrap">
                <q-input
                  :class="'row-' + props.rowIndex"
                  :disable="
                    (isEdit &&
                      !authStore.checkUserHasPermission(
                        EUserModules.ReceiptManagement,
                        EActionPermissions.Update
                      )) ||
                    isReceiptPreview
                  "
                  v-model="props.row.quantity"
                  type="number"
                  @update:model-value="
                    handleUpdateQuantity(Number($event) ?? 0, props.row)
                  "
                  filled
                  :min="1"
                  color="btn-primary"
                  style="max-width: 200px; min-width: 200px"
                />
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td
              :props="props"
              class="whitespace-nowrap max-w-[160px] text-ellipsis overflow-hidden"
            >
              {{ props.row.productName }}
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
              <q-icon name="warning" size="xs" />
              <span class="text-md font-medium"> No data available. </span>
            </div>
          </template>

          <template v-slot:bottom-row="props">
            <q-tr :props="props">
              <q-td colspan="3" />
              <q-td>
                <div class="font-bold">
                  Total:
                  {{ addNewReceiptTotalQuantity }}
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions class="row px-[16px] items-center justify-between w-full">
        <q-input
          v-model="addNewReceipt.comments"
          label="Comments"
          dense
          outlined
          color="btn-primary"
          type="text"
          class="w-[32%]"
          :readonly="isReceiptPreview"
        />
        <div class="flex items-center gap-2">
          <q-btn
            v-if="isEdit && isCommentEntered"
            unelevated
            label="Update Comment"
            color="btn-primary hover:bg-btn-primary-hover"
            @click="updateReceiptComment"
          />

          <q-btn
            unelevated
            :label="isReceiptPreview ? 'Close' : 'Go Back'"
            color="btn-cancel hover:bg-btn-cancel-hover"
            @click="cancelNewReceipt"
          />
          <q-btn
            v-if="!isReceiptPreview && !isEdit"
            :disable="
              addNewReceipt.userId === null ||
              selectedArticleData.length === 0 ||
              !selectedArticleData.every((item) => item.quantity) ||
              selectedArticleData.some(
                (item) => item.quantity && item.quantity < 0
              )
            "
            label="Save"
            unelevated
            @click="saveNewReceipt"
            :loading="isAddingPurchase"
            color="btn-primary"
          />
        </div>
      </q-card-actions>
    </q-card>
    <q-dialog v-model="isArticleListModalVisible">
      <article-list-modal
        @handle-pagination="handlePagination"
        @selected-data="selectedData"
        @filtered-rows="handleFilterRows"
        :article-list="articleListComputed"
        :pagination="pagination"
        :current-data="
          selectedArticleData.map((item) => ({
            productId: item.productId !== null ? item.productId : -1,
            productName: item?.productName || '',
            productImage: item.productImage || '',
            masterStock: item.masterStock ?? 0,
            retailPrice: item.retailPrice ?? 0,
          }))
        "
        :is-fetching-article-list="isFetchingArticleList"
      />
    </q-dialog>
    <q-dialog v-model="isPreviewImageModalVisible">
      <q-card class="min-w-[400px]">
        <q-card-section>
          <div class="w-full max-h-[350px] overflow-hidden">
            <img :src="selectedPreviewImage" alt="image" class="mx-auto" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isLoader" persistent>
      <q-spinner-ios size="78px" color="btn-primary" />
      <span class="ml-2 text-base font-[500]">Generating PDF...</span>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ArticleListModal from 'src/components/common/Article-List-Modal.vue';
import {
  GetUsers,
  CreatePurchase,
  UpdatePurchaseLineItem,
  GetArticleList,
  CreatePurchaseLineItem,
  DeletePurchaseLineItem,
  GetPurchaseDetail,
  updateReceiptCommentApi,
} from 'src/services';
import {
  EActionPermissions,
  EUserModules,
  IAddNewReceipt,
  IArticleData,
  IPagination,
  IUserResponse,
} from 'src/interfaces';
import { CanceledError } from 'axios';
import {
  IPdfFooters,
  IPdfHeaders,
  ITableItems,
  downloadPdf,
  isPosError,
} from 'src/utils';
import { useQuasar } from 'quasar';
import { ISelectedArticleData } from 'src/interfaces';
import { selectedArticleColumn } from 'src/utils';
import OutsideClickContainer from 'src/components/common/Outside-Click-Container.vue';
import { useAuthStore } from 'src/stores';
import moment from 'moment';
import { processTableItems } from 'src/utils/process-table-items';
const isCommentEntered = computed(() => {
  return addNewReceipt.value.comments.trim() !== '';
});

const authStore = useAuthStore();
const route = useRoute();
const options = ref<IUserResponse[]>([]);
const router = useRouter();
const isLoading = ref(false);
const isAddingPurchase = ref(false);
const isReceiptPreview = ref(false);
const selectedArticleData = ref<ISelectedArticleData[]>([]);
const isArticleListModalVisible = ref(false);
const isFilterChanged = ref(false);
const isLoader = ref(false);
const selectedPreviewImage = ref('');
const isPreviewImageModalVisible = ref(false);
const handleUpdateQuantity = (data: number, row: ISelectedArticleData) => {
  if (!data || data <= 0) {
    row.quantity = 0;
  }
};
const pagination = ref<IPagination>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100000,
  rowsNumber: 0,
});
const handleOutsideClick = () => {
  window.addEventListener('keypress', handleKeyPress);
};
const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === '+') {
    isArticleListModalVisible.value = true;
  }
};
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Tab' && !e.shiftKey) {
    window.addEventListener('keypress', handleKeyPress);
  } else if (e.key === 'Tab' && e.shiftKey) {
    window.removeEventListener('keypress', handleKeyPress);
  }
};
const dialoagClose = (e: KeyboardEvent) => {
  if (e.key === '+') {
    window.removeEventListener('keypress', handleKeyPress);
  }
};
const handlePagination = (selectedPagination: IPagination) => {
  pagination.value = selectedPagination;
  getArticleList();
};
const addNewReceiptTotalQuantity = computed(() => {
  const row = selectedArticleData.value;
  return row.reduce((total: number, row: ISelectedArticleData) => {
    if (row.quantity) {
      return total + Number(row.quantity);
    }
    return total;
  }, 0);
});
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = selectedImage;
    isPreviewImageModalVisible.value = true;
  }
};
const selectedData = (
  payload: {
    productId: number;
    productName?: string;
    productImage: string | null;
    masterStock: number;
    retailPrice: number;
  }[]
) => {
  if (!isEdit.value) {
    const newIdList = payload.map((item) => item.productId);
    selectedArticleData.value = selectedArticleData.value.filter(
      (item) => item.productId && newIdList.includes(item.productId)
    );
  }
  const oldIdList = selectedArticleData.value.map((item) => item.productId);
  payload.forEach((item) => {
    if (!oldIdList.includes(item.productId)) {
      selectedArticleData.value.unshift({
        ...item,
        quantity: 0,
        productImage: item.productImage ?? '',
      });
      nextTick(() => {
        const firstRow = document.getElementsByClassName('row-0');
        firstRow[0].querySelector('input')?.focus();
      });
      if (isEdit.value) {
        CreatePurchaseLineItem({
          productId: item.productId,
          quantity: 0,
          purchaseId: selectedId.value,
        })
          .then((res) => {
            $q.notify({
              message: 'Row added successfully',
              type: 'positive',
            });
            const index = selectedArticleData.value.findIndex(
              (art) => art.productId === item.productId
            );
            if (index !== -1) {
              selectedArticleData.value[index].purchaseDetailId = res.data;
            }
            getReceiptDataFromApi(selectedId.value);
          })
          .catch((e) => {
            console.error(e);
            $q.notify({
              message: 'There was an error adding row',
              type: 'negative',
            });
            getReceiptDataFromApi(selectedId.value);
          });
      }
    }
  });

  isArticleListModalVisible.value = false;
};
const onDeleteButtonClick = async (row: ISelectedArticleData) => {
  const tempIndex = selectedArticleData.value.findIndex(
    (x) => x.productId === row.productId
  );
  if (tempIndex != -1 && row.productId !== null) {
    selectedArticleData.value.splice(tempIndex, 1);
    if (isEdit.value && row.purchaseDetailId !== undefined) {
      try {
        await DeletePurchaseLineItem({
          purchaseDetailId: row.purchaseDetailId,
          purchaseId: selectedId.value,
        });
        $q.notify({
          type: 'positive',
          message: 'Row deleted successfully',
        });
      } catch (e) {
        $q.notify({
          message: 'There was an error deleting row',
          type: 'negative',
        });
      }
    }
  }
};
const addNewReceipt = ref<IAddNewReceipt>({
  userId: null,
  userOutstandingBalance: 0,
  userDiscount: 0,
  productList: [],
  createdDate: '',
  userName: '',
  purchaseStatus: '',
  comments: '',
});

watch(addNewReceipt.value, (newVal: IAddNewReceipt) => {
  const selectedUser = UserList.value.find(
    (row) => newVal.userId === row.userId
  );
  if (selectedUser) {
    addNewReceipt.value.userOutstandingBalance =
      selectedUser.outStandingBalance ?? 0;
    addNewReceipt.value.userDiscount = selectedUser.discount ?? 0;
  }
});
const $q = useQuasar();
const UserList = ref<IUserResponse[]>([]);
const getUserList = async () => {
  isLoading.value = true;
  try {
    const res = await GetUsers({
      pageNumber: 1,
      pageSize: 5000,
    });
    if (res?.data) {
      UserList.value = res.data.items.filter(
        (user) =>
          user.status === 'Active' &&
          user.roleName === 'Customer' &&
          user.customerGroup !== 'Shop Account' &&
          user.customerGroup !== 'Cash Account'
      );
      options.value = res.data.items;
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
const cancelNewReceipt = () => {
  router.push('/receipt');
};
const saveNewReceipt = async () => {
  if (isAddingPurchase.value) return;
  isAddingPurchase.value = true;
  const productList = selectedArticleData.value.map((item) => {
    return {
      productId: item.productId,
      quantity: item.quantity || 0,
    };
  });
  addNewReceipt.value.productList = productList;

  try {
    const res = await CreatePurchase({
      data: addNewReceipt.value,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        type: 'positive',
      });
    }
    router.push('/receipt');
  } catch (e) {
    let message = 'There was an unexpected error';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      type: 'negative',
      message,
    });
  }
  isAddingPurchase.value = false;
};
const updateReceiptComment = async () => {
  try {
    const res = await updateReceiptCommentApi({
      purchaseId: Number(selectedId.value),
      comments: addNewReceipt.value.comments,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: 'Comment updated successfully',
        type: 'positive',
      });
    }
  } catch (error) {
    let message = 'Unexpected Error Updating Comments';
    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
};

const isEdit = ref(false);
const isFetchingArticleList = ref(false);
const articleList = ref<IArticleData[]>([]);
const handleFilterRows = (filterChanged: boolean) => {
  if (filterChanged) {
    isFilterChanged.value = filterChanged;
    setTimeout(() => {
      isFilterChanged.value = false;
    }, 200);
  }
};
const getArticleList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (isFilterChanged.value) return;
  if (isFetchingArticleList.value) return;
  isFetchingArticleList.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const rowsPerPage =
      pagination.value.rowsPerPage === 0
        ? 100000
        : pagination.value.rowsPerPage;
    const res = await GetArticleList({
      PageNumber: pagination.value.page,
      PageSize: rowsPerPage,
      Status: 'Active',
    });
    if (res.type === 'Success') {
      if (res.data) {
        articleList.value = res.data.items;
        pagination.value.rowsNumber = res.data.totalItemCount;
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
const selectedId = ref<number | string>(-1);
const tableItems = ref<ITableItems[][]>([]);
const getReceiptDataFromApi = async (selectedItemId: string | number) => {
  GetPurchaseDetail(selectedItemId).then(async (res) => {
    addNewReceipt.value.userId = res.data.userId;
    addNewReceipt.value.userName = res.data.fullName;
    addNewReceipt.value.userOutstandingBalance = res.data.outStandingBalance;
    addNewReceipt.value.createdDate = res.data.createdDate;
    addNewReceipt.value.purchaseStatus = res.data.purchaseStatus;
    selectedArticleData.value = res.data.purchaseDetails;
    tableItems.value = await convertArrayToPdfData(res.data.purchaseDetails);
    addNewReceipt.value.comments = res.data.comments ?? '';
  });
};
onMounted(() => {
  getUserList();
  window.addEventListener('keydown', handleKeyDown);
  const selectedItemId = route.params?.id;
  if (selectedItemId && typeof selectedItemId === 'string') {
    if (router.currentRoute.value.path.includes('preview')) {
      isEdit.value = false;
      isReceiptPreview.value = true;
    } else {
      isReceiptPreview.value = false;
      isEdit.value = true;
      getArticleList();
    }
    selectedId.value = selectedItemId;
    getReceiptDataFromApi(selectedItemId);
  } else {
    isReceiptPreview.value = false;
    isEdit.value = false;
    getArticleList();
  }
});
const articleListComputed = computed(() => {
  if (!isEdit.value) return articleList.value;
  return articleList.value.filter((item) => {
    const index = selectedArticleData.value.findIndex(
      (art) => art.productId === item.productId
    );
    return index === -1;
  });
});
async function saveUpdatedData(row: ISelectedArticleData) {
  try {
    if (
      !row.purchaseDetailId ||
      row.quantity === null ||
      row.quantity === undefined
    ) {
      $q.notify({
        message: 'There has been an unexpected error',
        type: 'negative',
      });
      return;
    }
    const res = await UpdatePurchaseLineItem({
      purchaseId: selectedId.value,
      purchaseDetailId: row.purchaseDetailId,
      quantity: row.quantity,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: 'Updated Row successfuly',
        type: 'positive',
      });
      tableItems.value = await convertArrayToPdfData(selectedArticleData.value);
    }
  } catch (e) {
    let message = 'There was an error updating row';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      type: 'negative',
      message,
    });
    getReceiptDataFromApi(selectedId.value);
  }
}
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
async function convertArrayToPdfData(array: ISelectedArticleData[]) {
  if (!defaultImage.value) {
    defaultImage.value = await fetch('/assets/default-image.png')
      .then((res) => res.blob())
      .then((fileBlob) => {
        const imageFile = new File([fileBlob], 'default-image.png');
        return convertToBase64(imageFile);
      });
  }
  const tableStuff = [];
  const headerRow = ['Row#', 'Image', 'Article', 'Quantity'];
  tableStuff.push(headerRow);
  const netQuantity = array.reduce(
    (total: number, row: ISelectedArticleData) => {
      if (row.quantity) {
        return total + row.quantity;
      }
      return total;
    },
    0
  );
  const footerRow = [
    '',
    '',
    '',
    { text: `Total Quantity: ${netQuantity}`, margin: 5 },
  ];
  array.forEach((item: ISelectedArticleData, index: number) => {
    const row = [
      {
        text: index + 1,
      },
      {
        image: item.productImage || defaultImage.value,
        width: 50,
        height: 50,
      },
      { text: item.productName, margin: [0, 20] },
      { text: item.quantity, bold: true, margin: [0, 20] },
    ];
    tableStuff.push(row);
  });
  tableStuff.push(footerRow);

  return tableStuff;
}
async function downloadPdfData() {
  isLoader.value = true;
  const headers: IPdfHeaders[] = [
    {
      heading: 'Receipt Id',
      content: Number(route.params.id),
    },
    {
      heading: 'Status',
      content: addNewReceipt.value.purchaseStatus,
    },
    {
      content: addNewReceipt.value.userName,
    },
    {
      heading: 'Date',
      content: moment(addNewReceipt.value.createdDate).format('DD-MM-YYYY'),
    },
  ];

  const tableDataWithImage: ITableItems[][] = await processTableItems(
    tableItems.value
  );

  const footers: IPdfFooters[] = [
    {
      heading: 'Comments',
      content: addNewReceipt.value.comments,
    },
  ];

  const myFileName = 'Receipt.pdf';
  downloadPdf({
    filename: myFileName,
    tableData: JSON.parse(JSON.stringify(tableDataWithImage)),
    pdfHeaders: headers,
    pdfFooters: footers,
    title: '',
  });
  isLoader.value = false;
}

const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = UserList.value.filter((v) =>
      v.fullName?.toLowerCase().includes(needle)
    );
  });
};
</script>
