<template>
  <q-card class="q-pa-md min-w-[400px]">
    <q-card-section class="q-pa-none">
      <div class="text-h6 q-mb-md">
        <span> {{ variantAction }} Variant</span>
      </div>
      <q-input
        v-if="variantAction !== 'Delete'"
        dense
        v-model="variantName"
        outlined
        label="Name"
      />
      <div v-else class="text-center">
        <span>Are you sure you want to delete the selected Record?</span>
      </div>
    </q-card-section>
    <q-card-actions class="q-pb-none q-px-none" align="right">
      <div v-if="variantAction !== 'Delete'" class="row justify-end">
        <q-btn label="Cancel" flat unelevated color="red" v-close-popup />
        <q-btn
          :label="variantAction === 'Edit' ? 'Save' : 'Add'"
          flat
          :loading="isLoading"
          :disable="!variantName"
          unelevated
          color="signature"
          @click="saveNewVariant"
        />
      </div>
      <div v-else class="row justify-end">
        <q-btn label="Cancel" flat unelevated color="signature" v-close-popup />
        <q-btn
          label="Delete"
          flat
          unelevated
          color="red"
          :loading="isLoading"
          @click="deleteVariant"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
const variantName = ref('');
const isLoading = ref(false);
interface IProps {
  variant?: string;
  variantAction?: string;
  selectedRowId?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  variant: '',
  variantAction: '',
  selectedRowId: '-1',
});
const emit = defineEmits<{
  (event: 'name-changed', newName: string, callback: () => void): Promise<void>;
  (event: 'delete-record', id: string, callback: () => void): Promise<void>;
}>();
onMounted(() => {
  variantName.value = props.variant;
});

async function saveNewVariant() {
  if (isLoading.value) return;
  isLoading.value = true;
  await emit(
    'name-changed',
    variantName.value,
    () => (isLoading.value = false)
  );
}
async function deleteVariant() {
  if (isLoading.value) return;
  isLoading.value = true;
  await emit(
    'delete-record',
    props.selectedRowId,
    () => (isLoading.value = false)
  );
}
</script>
