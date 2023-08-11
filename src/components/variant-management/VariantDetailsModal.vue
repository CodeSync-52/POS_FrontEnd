<template>
  <q-card class="q-pa-md min-w-[400px]">
    <q-card-section class="q-pa-none">
      <div class="row items-center q-mb-md justify-between">
        <div class="text-h6">
          <span> {{ variantAction }} Variant</span>
        </div>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div class="row q-col-gutter-x-md">
        <div class="col-6">
          <div>
            <q-input
              v-model="variantData.name"
              dense
              label="Name"
              color="btn-primary"
              outlined
            />
          </div>
        </div>
        <div class="col-6">
          <div>
            <q-input
              v-model="variantData.displayName"
              label="Display Name"
              color="btn-primary"
              dense
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
          :label="variantAction === 'Edit' ? 'Save' : 'Add'"
          flat
          :loading="isLoading"
          :disable="!variantData.name || !variantData.displayName"
          unelevated
          color="signature"
          class="bg-btn-primary hover:bg-btn-primary-hover"
          @click="saveNewVariant"
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
  displayName: string;
  name: string;
  id: null | number;
}
const props = withDefaults(defineProps<IProps>(), {
  variant: () => ({
    displayName: '',
    name: '',
    id: null,
  }),
  variantAction: 'add',
});
const emit = defineEmits<{
  (
    event: 'name-changed',
    name: string,
    displayName: string,
    action: string,
    callback: () => void
  ): Promise<void>;
}>();
const variantData = ref<{
  displayName: string;
  name: string;
  id: number | null;
}>({
  displayName: '',
  name: '',
  id: null,
});
onMounted(() => {
  variantData.value.displayName = props.variant.displayName;
  variantData.value.name = props.variant.name;
  variantData.value.id = props.variant.id;
});
async function saveNewVariant() {
  if (isLoading.value) return;
  isLoading.value = true;
  await emit(
    'name-changed',
    variantData.value.name,
    variantData.value.displayName,
    props.variantAction,
    () => (isLoading.value = false)
  );
}
</script>
