<template>
  <q-card class="q-pa-md min-w-[400px]">
    <q-card-section class="q-pa-none">
      <div class="row items-center q-mb-md justify-between">
        <div class="text-h6">
          <span> {{ categoryAction }} Subcategory</span>
        </div>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div class="row q-col-gutter-x-md mb-2">
        <div class="col-12">
          <div>
            <q-input
              v-model="categoryData.name"
              dense
              label="Name"
              color="btn-primary"
              outlined
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="q-pb-none q-px-none" align="right">
      <div class="row justify-end gap-4">
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
          :disable="!categoryData.name"
          unelevated
          color="signature"
          class="bg-btn-primary hover:bg-btn-primary-hover"
          @click="saveNewCategory"
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
  name: string;
  id: number;
}
const props = withDefaults(defineProps<IProps>(), {
  category: () => ({
    name: '',
    id: -1,
  }),
  categoryAction: 'add',
});
const emit = defineEmits<{
  (
    event: 'name-changed',
    parentId: number,
    newName: string,
    callback: () => void
  ): Promise<void>;
}>();
const categoryData = ref<{ name: string; id: number }>({
  name: '',
  id: -1,
});
onMounted(() => {
  categoryData.value.name = props.category.name;
  categoryData.value.id = props.category.id;
});
async function saveNewCategory() {
  if (isLoading.value) return;
  isLoading.value = true;
  await emit(
    'name-changed',
    categoryData.value.id,
    categoryData.value.name,
    () => (isLoading.value = false)
  );
}
</script>
