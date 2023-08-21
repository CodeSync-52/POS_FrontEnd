<template>
  <div class="">
    <div class="text-xl text-center md:text-left font-medium mb-4">
      <span>Add New Receipt</span>
    </div>
    <q-card>
      <q-card-section class="q-gutter-y-md">
        <div class="row q-col-gutter-md">
          <!-- <div class="col-12 col-md-6 mt-auto">
            <span class="text-base">User Id</span>
            <q-input
              v-model="newReceipt.userId"
              min="1"
              type="number"
              label="User Id"
              dense
              outlined
            />
          </div> -->

          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-select
                :options="UserList"
                :loading="isLoading"
                dense
                map-options
                outlined
                @focus="getUserList"
                v-model="addNewReceipt.userId"
                @update:model-value="
                  addNewReceipt.userId = $event.userId;
                  console.log(addNewReceipt);
                "
                label="User ID"
                color="btn-primary"
                option-label="fullName"
                option-value="userId"
                ><template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template></q-select
              >
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="q-gutter-y-xs">
              <div class="row gap-6 items-center">
                <span class="text-base">Article</span>
                <q-btn icon="add" rounded dense @click="handleSelectArticle" />
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
        >
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div class="flex gap-2 flex-nowrap">
                <q-btn
                  size="sm"
                  flat
                  dense
                  unelevated
                  icon="delete"
                  color="bg-btn-secondary"
                  @click="onDeleteButtonClick(props.row)"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-quantity="props">
            <q-td :props="props">
              <div class="flex gap-2 flex-nowrap">
                <q-input
                  v-model="props.row.quantity"
                  type="number"
                  filled
                  style="max-width: 200px"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions class="row items-center justify-end">
        <q-btn label="Cancel" color="btn-secondary" @click="cancelNewReceipt" />
        <q-btn
          label="Save"
          @click="saveNewReceipt"
          :loading="isLoading"
          color="btn-primary"
        />
      </q-card-actions>
    </q-card>
    <q-dialog v-model="isArticleListModalVisible">
      <article-list-modal @selected-data="selectedData" />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ArticleListModal from 'src/components/receipt-management/ArticleListModal.vue';
import { getUserListApi } from 'src/services';
import {
  IAddNewReceipt,
  IProductList,
  IUserManagementData,
} from 'src/interfaces';
import { CanceledError } from 'axios';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
import { ISelectedArticleData } from 'src/interfaces';
import { selectedArticleColumn } from 'src/utils';
const router = useRouter();
const isLoading = ref(false);
const selectedArticleData = ref<ISelectedArticleData[]>([]);
const isArticleListModalVisible = ref(false);
const handleSelectArticle = () => {
  isArticleListModalVisible.value = true;
};
const selectedData = (payload: { productId: number; name: string }[]) => {
  selectedArticleData.value = payload;
  isArticleListModalVisible.value = false;
};

const onDeleteButtonClick = (row: ISelectedArticleData) => {
  const tempIndex = selectedArticleData.value.findIndex(
    (x) => x.productId === row.productId
  );
  if (tempIndex != -1) {
    selectedArticleData.value.splice(tempIndex, 1);
  }
};
const addNewReceipt = ref<IAddNewReceipt>({
  userId: null,
  productList: [] as IProductList[],
});
const $q = useQuasar();
const UserList = ref<IUserManagementData[]>([]);
const getUserList = async () => {
  isLoading.value = true;
  try {
    const res = await getUserListApi({
      pageNumber: 1,
      pageSize: 500,
    });
    if (res?.data) {
      UserList.value = res.data.items;
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
const newReceipt = ref({
  userId: null,
  selectedArticle: '',
  selectedArticleId: -1,
});
const cancelNewReceipt = () => {
  router.push('/receipt');
};
const saveNewReceipt = () => {
  const productList = selectedArticleData.value.map((item) => {
    const quantity = item.quantity !== undefined ? Number(item.quantity) : null; // Make quantity nullable

    return {
      productId: item.productId,
      quantity, // Use the modified quantity
    };
  });
  productList.forEach((element) => {
    addNewReceipt.value.productList.push(element);
  });
  console.log(addNewReceipt);
  // addNewReceipt.value.productList = productList;
};
</script>
