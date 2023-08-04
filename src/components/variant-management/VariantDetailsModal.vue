<template>
  <q-card class="q-pa-md min-w-[400px]">
    <q-card-section class="q-pa-none">
      <div class="row items-center q-mb-md justify-between">
        <div class="text-h6">
          <span> {{ variantAction }} Variant</span>
        </div>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div v-if="variantAction !== 'Delete'" class="row q-col-gutter-x-md">
        <div class="col-6">
          <div>
            <q-input
              v-model="variantData.label"
              dense
              label="Label"
              color="btn-primary"
              outlined
            />
          </div>
        </div>
        <div class="col-6">
          <div>
            <q-input
              v-model="variantData.fullName"
              label="Full Name"
              color="btn-primary"
              dense
              outlined
            />
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <span>Are you sure you want to delete the selected variant?</span>
      </div>
    </q-card-section>
    <q-card-actions class="q-pb-none q-px-none" align="right">
      <div v-if="variantAction !== 'Delete'" class="row justify-end gap-4">
        <q-btn
          label="Cancel"
          flat
          unelevated
          color="signature"
          class="bg-btn-cancel hover:bg-btn-cancel-hover"
          v-close-popup
        />
        <q-btn
          :label="variantAction === 'Edit' ? 'Save' : 'Add'"
          flat
          :loading="isLoading"
          :disable="!variantData.label || !variantData.fullName"
          unelevated
          color="signature"
          class="bg-btn-primary hover:bg-btn-primary-hover"
          @click="saveNewVariant"
        />
      </div>
      <div v-else class="row justify-end">
        <q-btn label="Cancel" flat unelevated color="signature" v-close-popup />
        <q-btn
          label="Delete"
          flat
          unelevated
          color="signature"
          class="bg-btn-cancel hover:bg-btn-cancel-hover"
          :loading="isLoading"
          @click="deleteVariant"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
const isLoading = ref<boolean>(false);
interface IProps {
  variant: IVariantProps;
  variantAction: string;
}
interface IVariantProps {
  fullName: string;
  label: string;
  id: string;
}
const props = withDefaults(defineProps<IProps>(), {
  variant: () => ({
    fullName: '',
    label: '',
    id: '',
  }),
  variantAction: 'add',
});
const emit = defineEmits<{
  (
    event: 'name-changed',
    newName: string,
    newLabel: string,
    callback: () => void
  ): Promise<void>;
  (event: 'delete-record', id: string, callback: () => void): Promise<void>;
}>();
const variantData = ref<{ fullName: string; label: string; id: string }>({
  fullName: '',
  label: '',
  id: '',
});
onMounted(() => {
  variantData.value.fullName = props.variant.fullName;
  variantData.value.label = props.variant.label;
  variantData.value.id = props.variant.id;
});
async function saveNewVariant() {
  if (isLoading.value) return;
  isLoading.value = true;
  await emit(
    'name-changed',
    props.variant.fullName,
    props.variant.label,
    () => (isLoading.value = false)
  );
}
async function deleteVariant() {
  if (isLoading.value) return;
  isLoading.value = true;
  await emit(
    'delete-record',
    props.variant.id,
    () => (isLoading.value = false)
  );
}
</script>
<style scoped>
:deep(.q-icon) {
  background-color: rgba(255, 0, 0, 0.706);
  color: white;
  border: 2px solid !important;
  border-radius: 9999px !important;
}
</style>
