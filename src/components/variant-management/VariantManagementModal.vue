<template>
  <q-card class="!max-w-[650px]">
    <q-card-section class="q-pa-none">
      <div v-close-popup class="row justify-end items-center mb-2">
        <span><q-btn flat unelevated dense size="md" icon="close" /></span>
      </div>
      <div class="row px-2 q-col-gutter-y-md">
        <div class="col-12">
          <div class="row items-center q-gutter-x-md">
            <span>{{ variantData }}</span>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="justify-end">
      <q-btn flat label="Cancel" color="red" v-close-popup />
      <q-btn flat label="Save" color="signature" v-close-popup />
    </q-card-actions>
    <q-card-actions class="justify-end">
      <q-btn label="close" color="signature" flat unelevated v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { IVariantData } from '../../interfaces';
import { onMounted, ref } from 'vue';

interface IProps {
  variantManagementTableRows: IVariantData;
}
const variantData = ref<IVariantData>();
onMounted(() => {
  variantData.value = props.variantManagementTableRows;
  console.log(props.variantManagementTableRows);
});
const props = defineProps<IProps>();
</script>
