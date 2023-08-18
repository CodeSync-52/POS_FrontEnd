<template>
  <q-card class="q-pa-md min-w-[400px]">
    <q-card-section class="q-pa-none">
      <div class="text-h6 q-mb-md">
        <span> {{ variantAction }} Variant Group</span>
      </div>
      <q-input
        dense
        v-model="variantName"
        outlined
        label="Name"
        color="btn-primary"
      />
    </q-card-section>
    <q-card-actions class="q-pb-none q-px-none" align="right">
      <div class="row justify-end gap-4">
        <q-btn
          label="Cancel"
          flat
          unelevated
          color="signature"
          v-close-popup
          class="bg-btn-cancel hover:bg-btn-cancel-hover"
        />
        <q-btn
          :label="variantAction === 'Edit' ? 'Save' : 'Add'"
          flat
          :loading="isLoading"
          :disable="!variantName"
          unelevated
          color="signature"
          class="bg-btn-primary"
          @click="saveNewVariant"
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
  (
    event: 'name-changed',
    name: string,
    variantAction: string,
    callback: () => void
  ): Promise<void>;
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
    props.variantAction,
    () => (isLoading.value = false)
  );
}
</script>
