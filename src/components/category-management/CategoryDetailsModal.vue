<template>
  <q-card class="min-w-[310px] md:min-w-[400px]">
    <q-card-section>
      <div class="row items-center mb-2 justify-between">
        <div class="text-lg font-medium">
          <span> {{ categoryAction }} Subcategory</span>
        </div>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div class="row q-col-gutter-x-md mb-2">
        <div class="col-12">
          <div>
            <q-input
              maxlength="250"
              v-model="categoryData.name"
              dense
              label="Name"
              autofocus
              color="btn-primary"
              outlined
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
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
    newName: string,
    categoryId: number,
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
    categoryData.value.name,
    categoryData.value.id,
    () => (isLoading.value = false)
  );
}
</script>
