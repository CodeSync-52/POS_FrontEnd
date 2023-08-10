<template>
  <q-card class="q-pa-md min-w-[400px]">
    <q-card-section class="q-pa-none">
      <div class="row items-center q-mb-md justify-between">
        <div class="text-h6">
          <span> {{ categoryAction }} Category</span>
        </div>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div v-if="categoryAction !== 'Delete'" class="row q-col-gutter-x-md">
        <div class="col-6">
          <div>
            <q-input
              v-model="categoryData.label"
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
              v-model="categoryData.fullName"
              label="Full Name"
              color="btn-primary"
              dense
              outlined
            />
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <span>Are you sure you want to delete the selected category?</span>
      </div>
    </q-card-section>
    <q-card-actions class="q-pb-none q-px-none" align="right">
      <div v-if="categoryAction !== 'Delete'" class="row justify-end gap-4">
        <q-btn
          label="Cancel"
          flat
          unelevated
          color="signature"
          class="bg-btn-cancel hover:bg-btn-cancel-hover"
          v-close-popup
        />
        <q-btn
          :label="categoryAction === 'Edit' ? 'Save' : 'Add'"
          flat
          :loading="isLoading"
          :disable="!categoryData.label || !categoryData.fullName"
          unelevated
          color="signature"
          class="bg-btn-primary hover:bg-btn-primary-hover"
          @click="saveNewCategory"
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
          @click="deleteCategory"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
const isLoading = ref<boolean>(false);
interface IProps {
  category: ICategoryProps;
  categoryAction: string;
}
interface ICategoryProps {
  fullName: string;
  label: string;
  id: string;
}
const props = withDefaults(defineProps<IProps>(), {
  category: () => ({
    fullName: '',
    label: '',
    id: '',
  }),
  categoryAction: 'add',
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
const categoryData = ref<{ fullName: string; label: string; id: string }>({
  fullName: '',
  label: '',
  id: '',
});
onMounted(() => {
  categoryData.value.fullName = props.category.fullName;
  categoryData.value.label = props.category.label;
  categoryData.value.id = props.category.id;
});
async function saveNewCategory() {
  if (isLoading.value) return;
  isLoading.value = true;
  await emit(
    'name-changed',
    props.category.fullName,
    props.category.label,
    () => (isLoading.value = false)
  );
}
async function deleteCategory() {
  if (isLoading.value) return;
  isLoading.value = true;
  await emit(
    'delete-record',
    props.category.id,
    () => (isLoading.value = false)
  );
}
</script>
