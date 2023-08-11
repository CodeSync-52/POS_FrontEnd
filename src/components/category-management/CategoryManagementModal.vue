<template>
  <q-card class="q-pa-md min-w-[400px]">
    <q-card-section class="q-pa-none">
      <div class="text-h6 q-mb-md">
        <span> {{ categoryAction }} Category</span>
      </div>
      <q-input
        dense
        v-model="categoryName"
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
          :label="categoryAction === 'Edit' ? 'Save' : 'Add'"
          flat
          :loading="isLoading"
          :disable="!categoryName"
          unelevated
          color="signature"
          class="bg-btn-primary"
          @click="saveNewCategory"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
const categoryName = ref('');
const isLoading = ref(false);
interface IProps {
  category?: string;
  categoryAction?: string;
  selectedRowId?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  category: '',
  categoryAction: '',
  selectedRowId: '-1',
});
const emit = defineEmits<{
  (
    event: 'name-changed',
    newName: string,
    action: string,
    callback: () => void
  ): Promise<void>;
}>();
onMounted(() => {
  categoryName.value = props.category;
});

async function saveNewCategory() {
  if (isLoading.value) return;
  isLoading.value = true;
  await emit(
    'name-changed',
    categoryName.value,
    props.categoryAction,
    () => (isLoading.value = false)
  );
}
</script>
