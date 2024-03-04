<template>
  <q-card class="min-w-[310px] md:min-w-[400px]">
    <q-card-section>
      <div class="row items-center q-mb-md justify-between">
        <div class="text-lg font-medium">
          <span> {{ variantAction }} Variant</span>
        </div>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-md-6 col-12">
          <div>
            <q-input
              v-model="variantData.name"
              maxlength="250"
              dense
              label="Name"
              autofocus
              color="btn-primary"
              outlined
            />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div>
            <q-input
              maxlength="250"
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
        :label="variantAction === 'Edit' ? 'Save' : 'Add'"
        flat
        :loading="isLoading"
        :disable="!variantData.name || !variantData.displayName"
        unelevated
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="saveNewVariant"
      />
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
