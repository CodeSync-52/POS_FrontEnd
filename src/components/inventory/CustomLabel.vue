<template>
  <q-card class="min-w-[310px] md:min-w-[750px] h-[600px]">
    <q-card-section class="h-[calc(100%-52px)]">
      <div class="px-4">
        <div class="row items-center q-mb-lg justify-between">
          <div class="text-h6">Custom Label</div>
          <q-btn icon="close" flat unelevated dense v-close-popup />
        </div>
        <div class="row items-center q-col-gutter-x-md q-col-gutter-y-lg">
          <div class="col-12 q-gutter-y-xs">
            <span class="text-base font-medium">Select Product</span>
            <q-select
              popup-content-class="!max-h-[200px]"
              :options="optionsProduct"
              :loading="isLoading"
              use-input
              dense
              map-options
              outlined
              @filter="filterProduct"
              v-model="selectedProduct.productLabel"
              @update:model-value="handleSelectProduct($event)"
              label="Select Product"
              autofocus
              color="btn-primary"
              option-label="name"
              option-value="productId"
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
            <span class="text-base font-medium">Select Variant Group</span>
            <q-select
              :options="optionData"
              :loading="isLoading"
              use-input
              dense
              popup-content-class="!max-h-[200px]"
              map-options
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
              >Select Variant</span
            >
            <q-select
              outlined
              clearable
              popup-content-class="!max-h-[200px]"
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
            <span class="text-base font-medium">Select Variant Group</span>
            <q-select
              :options="optionData"
              :loading="isLoading"
              use-input
              popup-content-class="!max-h-[200px]"
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
              >Select Variant</span
            >
            <q-select
              outlined
              dense
              popup-content-class="!max-h-[200px]"
              map-options
              option-label="name"
              option-value="variantId"
              color="btn-primary"
              label="Select Second Variant"
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
          <div class="col-6 q-gutter-y-xs">
            <div
              class="flex text-base font-medium justify-between items-center"
            >
              <span>Select Quantity</span>
              <span
                >Available Quantity: {{ selectedProductAvailableStock }}</span
              >
            </div>
            <q-input
              v-model="selectedProduct.quantity"
              :max="selectedProductAvailableStock"
              outlined
              dense
              color="btn-primary"
              type="number"
              @update:model-value="handleUpdateQuantity($event)"
            />
          </div>
        </div>
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
          :disable="isButtonDisabled"
          color="signature"
          :loading="isPrintingBarcode"
          class="bg-btn-primary hover:bg-btn-primary-hover"
          @click="handleAddVariantDetails"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import {
  IArticleData,
  IPagination,
  ISelectedArticle,
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

interface propTypes {
  selectedArticle: ISelectedArticle[];
}
interface propTypes {
  articleList: IArticleData[];
  pagination: IPagination;
  selectedArticle: ISelectedArticle[];
}

const emit = defineEmits<{
  (
    event: 'selected-custom',
    payload: {
      productLabel: string | null;
      productBarcode: string | null;
      quantity: number | null;
    },
    callback: () => void
  ): void;
}>();
const selectedProductAvailableStock = ref(0);
const props = withDefaults(defineProps<propTypes>(), {
  selectedArticle: () => [],
  articleList: () => [],
});
const selectedProduct = ref<{
  productLabel: string | null;
  productBarcode: string | null;
  quantity: number | null;
}>({
  productLabel: null,
  productBarcode: null,
  quantity: null,
});
const variantDetailsRecord = ref<IVariantDetailsData[]>([]);
const filteredRows = ref<IVariantDetailsData[]>([]);
const variantGroup = ref<{
  firstVariant: null | IVariantGroup;
  secondVariant: null | IVariantGroup;
}>({ firstVariant: null, secondVariant: null });
const filterChanged = ref(false);
const $q = useQuasar();
const filter = ref('');
const options = ref<IVariantData[]>([]);
const optionsProduct = ref<IArticleData[]>([]);
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
const handleSelectProduct = (newArticle: IArticleData) => {
  if (newArticle) {
    selectedProduct.value.productLabel = newArticle.name;
    selectedProductAvailableStock.value = newArticle.masterStock ?? 0;
    selectedProduct.value.quantity = 0;
  } else {
    selectedProductAvailableStock.value = 0;
  }
};
const isButtonDisabled = computed(() => {
  const validations = [
    Object.values(variantGroup.value).some((variant) => variant === null),
    Object.values(selectedDetailsData.value).some(
      (variant) => variant === null || Object.values(variant).length === 0
    ),
    selectedProduct.value.quantity === null,
    selectedProduct.value.quantity === 0,
    selectedProduct.value.quantity !== null &&
      selectedProduct.value.quantity < 0,
    selectedProduct.value.productLabel === null,
  ];
  return validations.some((validation) => validation === true);
});
const handleUpdateQuantity = (newVal: number | string | null) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (!val || val < 0) {
      selectedProduct.value.quantity = 0;
    } else if (val > selectedProductAvailableStock.value) {
      selectedProduct.value.quantity = selectedProductAvailableStock.value;
    } else {
      selectedProduct.value.quantity = val;
    }
  }
};
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
  optionsProduct.value = props.articleList;
});
const isPrintingBarcode = ref(false);
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
const handleAddVariantDetails = () => {
  selectedProduct.value.productBarcode = `${selectedProduct.value.productLabel}-${selectedDetailsData.value.firstVariantSelection?.displayName}-${selectedDetailsData.value.secondVariantSelection?.displayName}`;
  isPrintingBarcode.value = true;
  setTimeout(() => {
    emit(
      'selected-custom',
      selectedProduct.value,
      () => (isPrintingBarcode.value = false)
    );
  }, 300);
};

const filterProduct = (val: string, update: any) => {
  update(() => {
    const needle = val.toLowerCase();
    optionsProduct.value = props.articleList.filter((v) =>
      v.name.toLowerCase().includes(needle)
    );
  });
};
</script>
