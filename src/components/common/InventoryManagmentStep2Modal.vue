<template>
  <q-card class="min-w-[310px] md:min-w-[750px] h-[600px]">
    <q-card-section class="h-[calc(100%-52px)]">
      <div>
        <div class="row items-center q-mb-md justify-between">
          <div class="text-h6">
            <span>Additional Details</span>
          </div>
          <q-btn icon="close" flat unelevated dense v-close-popup />
        </div>
        <div class="row items-center q-col-gutter-x-md q-col-gutter-y-lg">
          <div class="col-6 q-gutter-y-xs">
            <span class="text-base font-medium"
              >Select First Variant Group</span
            >
            <q-select
              :options="optionData"
              :loading="isLoading"
              use-input
              dense
              map-options
              clearable
              outlined
              @filter="filterFn"
              v-model="variantGroup.firstVariant"
              label="Select First Variant Group"
              color="btn-primary"
              option-label="name"
              option-value="variantGroupId"
              @update:model-value="getSelectedVariantDetails($event, false)"
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template></q-select
            >
          </div>
          <div class="col-6 q-gutter-y-xs">
            <span v-if="variantGroup.firstVariant" class="text-base font-medium"
              >Select First Variant</span
            >
            <q-select
              multiple
              outlined
              clearable
              dense
              map-options
              option-label="name"
              option-value="variantId"
              color="btn-primary"
              label="Select First Variant"
              v-if="variantGroup.firstVariant"
              :options="selectedVariantOptions.firstVariantOptions"
              v-model="selectedDetailsData.firstVariantSelection"
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template></q-select
            >
          </div>
          <div class="col-6 q-gutter-y-xs">
            <span class="text-base font-medium"
              >Select Second Variant Group</span
            >
            <q-select
              :options="optionData"
              :loading="isLoading"
              use-input
              clearable
              dense
              map-options
              outlined
              @filter="filterFn"
              v-model="variantGroup.secondVariant"
              label="Select Second Variant Group"
              color="btn-primary"
              option-label="name"
              option-value="variantGroupId"
              @update:model-value="getSelectedVariantDetails($event, true)"
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template></q-select
            >
          </div>
          <div class="col-6 q-gutter-y-xs">
            <span
              v-if="variantGroup.secondVariant"
              class="text-base font-medium"
              >Select Second Variant</span
            >
            <q-select
              outlined
              dense
              map-options
              option-label="name"
              option-value="variantId"
              color="btn-primary"
              label="Select Second Variant"
              multiple
              clearable
              v-if="variantGroup.secondVariant"
              :options="selectedVariantOptions.secondVariantOptions"
              v-model="selectedDetailsData.secondVariantSelection"
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
        <!-- <div>
          <q-table
            class="max-h-[400px] h-full"
            :rows="filteredRows"
            :columns="variantDetails"
            :loading="isLoading"
            row-key="name"
            :filter="filter"
            v-model:pagination="pagination"
            @request="getVariantList"
            selection="multiple"
            @update:selected="console.log(selected, 'sd')"
            v-model:selected="selected"
          >
            <template v-slot:top>
              <div
                class="flex md:flex-row md:gap-0 md:justify-between sm:justify-center sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4 w-full"
              >
                <div class="font-medium text-lg"><span>Variant</span></div>
                <q-input
                  maxlength="250"
                  outlined
                  dense
                  debounce="300"
                  color="btn-primary"
                  label="Name"
                  v-model="filter"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
            <template v-slot:no-data>
              <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
                <q-icon name="warning" size="xs" />
                <span class="text-md font-medium"> No data available. </span>
              </div>
            </template>
          </q-table>
        </div> -->
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <div class="row justify-end gap-2">
        <q-btn
          label="Cancel"
          flat
          unelevated
          color="signature"
          class="bg-btn-cancel hover:bg-btn-cancel-hover"
          v-close-popup
        />
        <q-btn
          flat
          label="Add"
          unelevated
          color="signature"
          class="bg-btn-primary hover:bg-btn-primary-hover"
          @click="handleShowVariantDetails"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import {
  IVariantData,
  IVariantDetailsData,
  IVariantGroup,
} from 'src/interfaces';
import {
  variantGroupListApi,
  variantListApi,
  variantListByIdApi,
} from 'src/services';
import { isPosError } from 'src/utils';
import { computed, onMounted, ref, watch } from 'vue';
import { CanceledError } from 'axios';
const variantDetailsRecord = ref<IVariantDetailsData[]>([]);
const filteredRows = ref<IVariantDetailsData[]>([]);
const variantGroup = ref<{
  firstVariant: null | IVariantGroup;
  secondVariant: null | IVariantGroup;
}>({ firstVariant: null, secondVariant: null });
// const selected = ref<any>([]);

const filterChanged = ref(false);
const $q = useQuasar();
const filter = ref('');
const options = ref<IVariantData[]>([]);
const selectedDetailsData = ref<{
  firstVariantSelection: IVariantDetailsData | null;
  secondVariantSelection: IVariantDetailsData | null;
}>({
  firstVariantSelection: null,
  secondVariantSelection: null,
});
const selectedVariantOptions = ref<{
  firstVariantOptions: IVariantDetailsData[];
  secondVariantOptions: IVariantDetailsData[];
}>({
  firstVariantOptions: [],
  secondVariantOptions: [],
});
const variantData = ref<IVariantData[]>([]);
const isLoading = ref(false);
const optionData = computed(() => {
  let idList: number[] = [];
  if (variantGroup.value.firstVariant) {
    idList.push(variantGroup.value.firstVariant.variantGroupId);
  }
  if (variantGroup.value.secondVariant) {
    idList.push(variantGroup.value.secondVariant.variantGroupId);
  }
  if (idList.length > 0) {
    return options.value.filter(
      (option) => !idList.includes(option.variantGroupId)
    );
  }
  return options.value;
});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
onMounted(() => {
  getVariantList();
  getVariantGroupList();
});
const getSelectedVariantDetails = async (
  selectedVariantGroup: {
    status: string;
    variantGroupId: number;
    name: string;
  },
  isSecond: boolean
) => {
  try {
    const res = await variantListByIdApi({
      status: selectedVariantGroup?.status,
      variantGroupId: selectedVariantGroup?.variantGroupId,
    });
    if (res.type === 'Success') {
      if (isSecond) {
        selectedDetailsData.value.secondVariantSelection = null;
        selectedVariantOptions.value.secondVariantOptions = res.data;
      } else {
        selectedVariantOptions.value.firstVariantOptions = res.data;
        selectedDetailsData.value.firstVariantSelection = null;
      }
    }
  } catch (e) {
    let message = 'Error Occurred During Fetching variant Group Details';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
};
const getVariantList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (filterChanged.value) return;
  if (isLoading.value) return;
  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await variantListApi({
      pageNumber: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    });
    if (res.data) {
      variantDetailsRecord.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
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
function setFilteredData() {
  filterChanged.value = true;
  filteredRows.value = variantDetailsRecord.value.filter((row) =>
    row.name.toLowerCase().includes(filter.value.toLowerCase().trim())
  );
  setTimeout(() => {
    filterChanged.value = false;
  }, 200);
}
watch(filter, setFilteredData);
watch(variantDetailsRecord, setFilteredData);
const getVariantGroupList = async () => {
  isLoading.value = true;
  try {
    const res = await variantGroupListApi({
      pageNumber: 1,
      pageSize: 500,
    });
    if (res?.data) {
      variantData.value = res.data.items.filter(
        (item) => item.status === 'Active'
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

const filterFn = (val: string, update: any) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = variantData.value.filter((v) =>
      v.name.toLowerCase().includes(needle)
    );
  });
};
const handleShowVariantDetails = () => {
  console.log(variantGroup.value, selectedDetailsData.value);
};
</script>
