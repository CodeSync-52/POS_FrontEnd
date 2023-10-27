<template>
  <q-card class="min-w-[310px] md:min-w-[400px] !max-w-[700px]">
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-lg font-medium"> Preview Grn</span>
        <span
          ><q-btn
            class="close-modal"
            v-close-popup
            flat
            unelevated
            dense
            size="md"
            icon="close"
        /></span>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-4">
          <q-input
            dense
            outlined
            maxlength="250"
            disable
            v-model="selectedGrnData.fromShopName"
            label="From Shop"
            color="btn-primary"
          />
        </div>
        <div class="col-4">
          <q-input
            dense
            outlined
            maxlength="250"
            disable
            v-model="selectedGrnData.toShopName"
            label="To Shop"
            color="btn-primary"
          />
        </div>
        <div class="col-4">
          <q-input
            dense
            disable
            outlined
            maxlength="250px"
            v-model="selectedGrnData.quantity"
            label="Quantity"
            lazy-rules
            color="btn-primary"
          />
        </div>
        <div class="col-4">
          <q-input
            dense
            disable
            outlined
            maxlength="250"
            v-model="selectedGrnData.grnStatus"
            label="Status"
            color="btn-primary"
          />
        </div>
        <div class="col-4">
          <q-input
            dense
            disable
            outlined
            maxlength="250"
            v-model="selectedGrnData.addedDate"
            label="Added Date"
            color="btn-primary"
          />
        </div>
      </div>
      <div class="py-4">
        <q-table
          :rows="selectedGrnData.grnDetails"
          :columns="PreviewGrnTableColumn"
        >
          <template v-slot:no-data>
            <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
              <q-icon name="warning" size="xs" />
              <span class="text-md font-medium"> No data available. </span>
            </div>
          </template>
          <template v-slot:body-cell-productImage="props">
            <q-td :props="props">
              <div
                @click="handlePreviewImage(props.row.productImage)"
                class="h-[50px] w-[50px] min-w-[2rem] overflow-hidden rounded-full"
                :class="props.row.productImage ? 'cursor-pointer' : ''"
              >
                <img
                  class="w-full h-full object-cover"
                  :src="
                    getImageUrl(props.row.productImage) ||
                    'assets/default-image.png'
                  "
                  alt="img"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        label="Close"
        color="signature"
        v-close-popup
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
      />
    </q-card-actions>
  </q-card>
  <q-dialog v-model="isPreviewImageModalVisible">
    <q-card class="max-w-[400px]">
      <q-card-section>
        <div class="min-w-[2rem]">
          <img
            class="w-full h-full object-cover"
            :src="selectedPreviewImage"
            alt="img"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import moment from 'moment';
import { IGrnPreviewResponse } from 'src/interfaces';
import { PreviewGrnTableColumn } from 'src/utils';
import { onMounted, ref } from 'vue';
type PropType = {
  previewData: IGrnPreviewResponse;
};
const props = defineProps<PropType>();
const selectedGrnData = ref<IGrnPreviewResponse>({
  grnId: 0,
  fromShopId: 0,
  toShopId: 0,
  fromShopName: '',
  toShopName: '',
  quantity: 0,
  grnStatus: '',
  addedDate: '',
  grnDetails: [],
});
const selectedPreviewImage = ref('');
const isPreviewImageModalVisible = ref(false);
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = `data:image/png;base64,${selectedImage}`;
    isPreviewImageModalVisible.value = true;
  }
};
const getImageUrl = (base64Image: string) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
};
onMounted(() => {
  selectedGrnData.value = props.previewData;
  selectedGrnData.value.addedDate = moment(props.previewData.addedDate).format(
    'YYYY-MM-DD'
  );
});
</script>
