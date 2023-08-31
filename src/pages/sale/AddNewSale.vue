<template>
  <div>
    <div class="text-xl text-center md:text-left font-medium mb-4">
      <span>{{ action }} Sale</span>
    </div>
    <q-card>
      <q-card-section class="q-gutter-y-md">
        <div class="row q-col-gutter-md">
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
          <div v-if="action !== 'Preview'" class="col-12 col-md-6">
            <div class="q-gutter-y-xs"></div>
          </div>
        </div>
        <q-table
          v-if="action !== 'Add New'"
          :rows="selectedSaleRecord"
          :columns="salesManagementColumn"
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
          <template v-slot:body-cell-discount="props">
            <q-td :props="props">
              {{ props.row.discount }}
              <q-popup-edit
                :disable="router.currentRoute.value.path.includes('preview')"
                v-model="props.row.discount"
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
              <q-td colspan="7" />
              <q-td>
                <div>
                  Total:
                  {{ saleGenerationTotalAmount }}
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
import { ISalesManagementData } from 'src/interfaces';
import { EActionPermissions, EUserModules } from 'src/interfaces';
import { useAuthStore } from 'src/stores';
import { salesManagementColumn, salesManagementData } from 'src/utils';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
const selectedSaleRecord = ref(salesManagementData);
const action = ref('');
const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
onMounted(() => {
  const route = router.currentRoute.value;
  if (route.params.id) {
    if (route.fullPath.includes('preview')) {
      action.value = 'Preview';
    } else {
      action.value = 'Edit';
    }
  } else {
    action.value = 'Add New';
  }
});
const saleGenerationTotalAmount = computed(() => {
  return selectedSaleRecord.value.reduce(
    (total: number, row: ISalesManagementData) => {
      return total + row.totalAmount * row.totalQuantity - row.discount;
    },
    0
  );
});
</script>
