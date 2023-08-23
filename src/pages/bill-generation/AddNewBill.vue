<template>
  <div>
    <div class="text-xl text-center md:text-left font-medium mb-4">
      <span>{{ billAction }} Bill</span>
    </div>
    <q-card>
      <q-card-section>
        <div class="row q-mb-md q-col-gutter-md">
          <div class="col-6">
            <q-input
              v-model="billInfo.billId"
              :disable="billAction === 'Preview'"
              dense
              label="Bill Id"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              v-model="billInfo.outstandingBalance"
              dense
              :disable="billAction === 'Preview'"
              label="Outstanding Balance"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              type="date"
              :disable="billAction === 'Preview'"
              v-model="billInfo.date"
              dense
              label="Date"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              v-model="billInfo.userName"
              :disable="billAction === 'Preview'"
              dense
              label="User Name"
              outlined
            />
          </div>
        </div>
        <q-table
          :rows="billGenerationRecords[0].productReceipt"
          :columns="editBillGenerationRecordsColumn"
          hide-bottom
        >
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <div v-if="props.row.image" class="w-12 h-8 overflow-hidden">
                <img
                  class="bg-contain h-full w-full"
                  src="src/assets/Images/loginBg.jpg"
                  alt="img"
                />
              </div>
              <span v-else>No Image</span>
            </q-td>
          </template>
          <template v-slot:body-cell-netTotal="props">
            <q-td :props="props">
              {{ props.row.quantity * props.row.amount }}
            </q-td>
          </template>
          <!-- <template v-slot:bottom-row="props">
            <q-tr :props='props'>
              <q-td colspan="4" />
              <q-td>
                <div>Total: {{props.cols}}</div>
              </q-td>
            </q-tr>
          </template> -->
        </q-table>
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn
          :label="billAction === 'Preview' ? 'Close' : 'Cancel'"
          color="btn-secondary"
          @click="router.push('/bill-generation')"
        />
        <q-btn
          v-if="billAction !== 'Preview'"
          :label="
            billAction === 'Edit'
              ? 'Save as Draft'
              : billAction === 'Add New'
              ? 'Add'
              : ''
          "
          color="btn-primary"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
// import { useQuasar } from 'quasar';
import {
  billGenerationRecords,
  editBillGenerationRecordsColumn,
} from 'src/utils';
// import { billListApi } from 'src/services';
// import { IBillGenerationData } from 'src/interfaces';
const billAction = ref('');
const router = useRouter();
// const isLoading = ref(false)
// const $q = useQuasar()
// const billGenerationData = ref<IBillGenerationData[]>(billGenerationRecords);
const selectedId = router.currentRoute.value.params.id;
const billInfo = ref({
  billId: 0,
  outstandingBalance: 0,
  date: '',
  userName: '',
});
onMounted(() => {
  if (selectedId) {
    if (router.currentRoute.value.fullPath.includes('preview')) {
      billAction.value = 'Preview';
    } else {
      billAction.value = 'Edit';
    }
  } else {
    billAction.value = 'Add New';
  }
});
// getBillList()
// const getBillList = async () => {
//   if (isLoading.value) return;
//   isLoading.value = true;
//   try {
//     const res = await billListApi({
//       PageNumber: 1,
//       PageSize: 200,
//     });
//     if (res.data) {
//       billGenerationData.value = res.data.items;
//     }
//   } catch (e) {
//     let message = 'Unexpected Error Occurred';
//     if (isPosError(e)) {
//       message = e.message;
//     }
//     $q.notify({
//       message,
//       color: 'red',
//       icon: 'error',
//     });
//   }
//   isLoading.value = false;
// };
</script>
