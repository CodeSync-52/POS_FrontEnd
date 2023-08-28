<template>
  <q-card class="min-w-[400px]">
    <q-card-section>
      <div class="text-lg font-medium mb-2 row justify-between items-center">
        <span> {{ variantAction }} Variant Group </span>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <q-input
        dense
        v-model="variantName"
        outlined
        label="Name"
        color="btn-primary"
      />
    </q-card-section>
    <q-card-actions align="right">
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
