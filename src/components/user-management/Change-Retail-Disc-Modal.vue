<template>
    <q-card class="min-w-[310px] md:min-w-[400px]">
      <q-card-section>
        <div class="flex justify-between items-center mb-2">
          <span class="text-lg font-medium">Retail Discount</span>
          <q-btn
            class="font-medium"
            icon="close"
            flat
            unelevated
            dense
            v-close-popup
          />
        </div>
        <div class="text-center px-4">
          <span>Are you sure you want to change the retail discount permission?</span>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="white"
          v-close-popup
          class="bg-btn-cancel hover:bg-btn-cancel-hover"
        />
        <q-btn
          flat
          label="Confirm"
          color="white"
          class="bg-btn-primary hover:bg-btn-primary-hover"
          @click="handleChangeRetailDisc"
        />
      </q-card-actions>
    </q-card>
  </template>
  <script setup lang="ts">
  interface Iprops {
    selectedData: {
      customerId: number;
      status: string;
    };
  }
  const props = withDefaults(defineProps<Iprops>(), {
    selectedData: () => ({
      customerId: -1,
      status: '',
    }),
  });
  const emit = defineEmits<{
    (event: 'retail-disc', id: number): void;
  }>();
  const handleChangeRetailDisc = () => {
    emit('retail-disc', props.selectedData.customerId);
  };
  </script>
  