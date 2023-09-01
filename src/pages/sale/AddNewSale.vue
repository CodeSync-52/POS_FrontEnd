<template>
  <div>
    <div class="text-xl text-center md:text-left font-medium mb-4">
      <span>{{ action }} Sale</span>
    </div>
    <q-card>
      <q-card-section class="q-gutter-y-md">
        <div class="row q-col-gutter-md">
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              dense
              label="Created By"
              v-model="selectedSaleRecord.createdBy"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              outlined
              type="date"
              disable
              label="Created Date"
              dense
              v-model="selectedSaleRecord.createdDate"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              type="number"
              dense
              label="Discount"
              v-model="selectedSaleRecord.discount"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              type="number"
              dense
              label="Net Amount"
              v-model="selectedSaleRecord.netAmount"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              dense
              type="number"
              label="Outstanding Balance"
              v-model="selectedSaleRecord.outStandingBalance"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              dense
              type="number"
              label="Total Amount"
              v-model="selectedSaleRecord.totalAmount"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              dense
              label="Total Quantity"
              v-model="selectedSaleRecord.totalQuantity"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              dense
              label="Updated Date"
              v-model="selectedSaleRecord.updatedDate"
            />
          </div>
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <!-- <q-select
                      :options="UserList"
                      :loading="isLoading"
                      dense
                      map-options
                      outlined
                      v-model="addNewReceipt.userId"
                      @update:model-value="addNewReceipt.userId = $event.userId"
                      label="User ID"
                      color="btn-primary"
                      option-label="fullName"
                      option-value="userId"
                      :disable="action === 'Edit' || action === 'Preview'"
                      ><template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template></q-select
                    > -->
            </div>
          </div>
        </div>
        <q-table
          v-if="action !== 'Add New'"
          :rows="selectedSaleRecord?.wholeSaleDetails"
          :columns="salesDetailsColumn"
          :loading="isLoading"
          tabindex="0"
          align="left"
          row-key="name"
        >
          <template v-slot:body-cell-totalAmount="props">
            <q-td :props="props">
              {{ props.row.totalAmount }}
              <q-popup-edit
                :disable="router.currentRoute.value.path.includes('preview')"
                v-model="props.row.totalAmount"
                color="btn-primary"
                title="Update Amount"
                buttons
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model="scope.value"
                  @update:model-value="
                    scope.value = ($event as number) >= 0 ? Number($event) : 0
                  "
                  color="btn-primary"
                  min="0"
                  dense
                  autofocus
                />
              </q-popup-edit>
            </q-td>
          </template>
          <template v-slot:body-cell-quantity="props">
            <q-td :props="props">
              {{ props.row.discount }}
              <q-popup-edit
                :disable="router.currentRoute.value.path.includes('preview')"
                v-model="props.row.quantity"
                color="btn-primary"
                title="Update Amount"
                buttons
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model="scope.value"
                  @update:model-value="
                    scope.value = ($event as number) >= 0 ? Number($event) : 0
                  "
                  color="btn-primary"
                  min="0"
                  dense
                  autofocus
                />
              </q-popup-edit>
            </q-td>
          </template>
          <template v-slot:body-cell-action="props" v-if="action !== 'Preview'">
            <q-td :props="props">
              <div class="flex gap-2 flex-nowrap">
                <q-btn
                  v-if="
                    action === 'Edit' &&
                    authStore.checkUserHasPermission(
                      EUserModules.SalesManagement,
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
                    action !== 'Edit' ||
                    (action === 'Edit' &&
                      authStore.checkUserHasPermission(
                        EUserModules.SalesManagement,
                        EActionPermissions.Delete
                      ))
                  "
                  size="sm"
                  flat
                  dense
                  unelevated
                  icon="delete"
                  color="red"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:header-cell-action v-if="action === 'Preview'">
            <q-th> </q-th>
          </template>
          <template v-slot:bottom-row="props">
            <q-tr :props="props">
              <q-td colspan="4" />
              <q-td>
                <div>
                  Total:
                  <!-- {{ saleGenerationTotalAmount }} -->
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right" class="q-gutter-x-sm">
        <router-link to="/sale">
          <q-btn
            unelevated
            :label="action === 'Preview' ? 'Close' : 'Cancel'"
            color="btn-cancel hover:bg-btn-cancel-hover"
          />
        </router-link>
        <q-btn
          v-if="action !== 'Preview'"
          unelevated
          label="Save"
          color="btn-primary"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores';
import {
  EActionPermissions,
  EUserModules,
  ISelectedSalesDetailData,
} from 'src/interfaces';
import { isPosError, salesDetailsColumn } from 'src/utils';
import { ref, onMounted } from 'vue';
import { wholeSaleDetailApi } from 'src/services';
import moment from 'moment';
const selectedSaleRecord = ref<ISelectedSalesDetailData>({
  createdBy: '',
  createdById: 0,
  createdDate: '',
  discount: 0,
  fullName: '',
  netAmount: 0,
  outStandingBalance: 0,
  totalAmount: 0,
  totalQuantity: 1,
  updatedBy: null,
  updatedDate: '',
  userId: 0,
  wholeSaleDetails: [],
  wholeSaleStatus: '',
});
const action = ref('');
const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const $q = useQuasar();
onMounted(() => {
  const route = router.currentRoute.value;
  if (route.params.id) {
    if (route.fullPath.includes('preview')) {
      action.value = 'Preview';
    } else {
      action.value = 'Edit';
    }
    getSelectedWholesaleDetail(Number(route.params.id));
  } else {
    action.value = 'Add New';
  }
});
// const saleGenerationTotalAmount = computed(() => {
//   const row = selectedSaleRecord.value?.wholeSaleDetails
//   if (row){
//     return row.reduce(
//       (total: number, row: ISelectedSalesDetailData) => {
//         return total + row.totalAmount * row.totalQuantity - row.discount;
//       },
//       0
//     );
//   }
//   return 0
// });
const getSelectedWholesaleDetail = async (wholeSaleId: number) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await wholeSaleDetailApi(wholeSaleId);
    if (res.type === 'Success') {
      if (res.data) {
        selectedSaleRecord.value = res.data;
        selectedSaleRecord.value.createdDate = moment(
          res.data.createdDate
        ).format('YYYY-MM-DD');
        selectedSaleRecord.value.updatedDate = moment(
          res.data.updatedDate
        ).format('DD/MM/YYYY');
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred fetching Wholesale Details';
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
</script>
