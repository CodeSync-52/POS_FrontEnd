<template>
  <q-card class="min-w-[400px]">
    <q-card-section>
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-medium">Copy STR</span>
        <q-btn
          class="font-medium"
          icon="close"
          flat
          unelevated
          dense
          v-close-popup
        />
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-select
            v-model="copyStrSelectedShop"
            :loading="isLoading"
            :options="shopRecords"
            class="w-full"
            dense
            popup-content-class="!max-h-[200px]"
            map-options
            outlined
            label="Select User"
            color="btn-primary"
            option-label="name"
            option-value="shopId"
            ><template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template></q-select
          >
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        label="Save"
        color="white"
        :disable="copyStrSelectedShop === null"
        :loading="isSaving"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="handleSaveCopyStr"
      />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { IGenericResponse, IShopResponse } from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError, makeApiCall } from 'src/utils';
import { ref, onMounted } from 'vue';
interface IProps {
  grnId: number;
}
const shopRecords = ref<IShopResponse[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);
const $q = useQuasar();
const copyStrSelectedShop = ref<null | IShopResponse>(null);
const props = withDefaults(defineProps<IProps>(), {
  grnId: -1,
});
const emit = defineEmits<{ (event: 'close-modal'): void }>();
onMounted(() => {
  getShopList();
});
const getShopList = async () => {
  isLoading.value = true;
  try {
    const response = await GetShopList({
      PageNumber: 1,
      PageSize: 25,
    });
    if (response.data) {
      shopRecords.value = response.data.items;
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
    isLoading.value = false;
  }
};

const handleSaveCopyStr = async () => {
  isSaving.value = true;
  try {
    const res = await makeApiCall<IGenericResponse<null>>({
      url: 'api/grn/copy',
      method: 'POST',
      data: {
        grnId: props.grnId,
        shopId: copyStrSelectedShop.value?.shopId,
      },
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      emit('close-modal');
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
  isSaving.value = false;
};
</script>
