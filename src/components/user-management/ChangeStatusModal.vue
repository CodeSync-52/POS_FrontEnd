<template>
  <q-card class="min-w-[400px]">
    <q-card-section>
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-medium"> {{ action }}</span>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <div class="column">
        <q-radio
          v-model="statusVal"
          val="Active"
          color="btn-primary"
          label="Active"
        />
        <q-radio
          v-model="statusVal"
          color="btn-primary"
          val="InActive"
          label="InActive"
        />
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        label="Cancel"
        color="white"
        v-close-popup

        class="bg-btn-cancel"

      />
      <q-btn
        flat
        label="Save"
        color="white"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="handleChangeStatus()"
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
interface Iprops {
  action: string;
  selectedData: {
    customerId: number;
    status: string;
  };
}
const props = withDefaults(defineProps<Iprops>(), {
  action: '',
  selectedData: () => ({
    customerId: -1,
    status: '',
  }),
});
onMounted(() => {
  statusVal.value = props.selectedData.status;
});
const statusVal = ref<string>('');
const emit = defineEmits<{
  (event: 'change-status', id: number, updatedStatus: string): void;
}>();

const handleChangeStatus = () => {
  emit('change-status', props.selectedData.customerId, statusVal.value);
};
</script>
