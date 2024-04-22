<template>
  <q-card class="min-w-[310px] md:min-w-[400px]">
    <q-card-section>
      <div class="text-lg font-medium mb-2 row justify-between items-center">
        <span> Change Status </span>
        <q-btn v-close-popup flat unelevated dense icon="close" />
      </div>

      <div class="column">
        <q-radio
          v-model="statusVal"
          val="Active"
          label="Active"
          color="btn-primary"
        />
        <q-radio
          v-model="statusVal"
          val="InActive"
          label="InActive"
          color="btn-primary"
        />
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
        label="Save"
        flat
        :loading="isLoading"
        unelevated
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="savingEditedStatus"
      />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
interface IProps {
  selectedStatus: string;
}

const isLoading = ref<boolean>(false);
const emit = defineEmits(['updated-status']);
const statusVal = ref<string>('');
const props = withDefaults(defineProps<IProps>(), {
  selectedStatus: '',
});
async function savingEditedStatus() {
  isLoading.value = true;
  await emit(
    'updated-status',
    statusVal.value,
    () => (isLoading.value = false)
  );
}
onMounted(() => {
  statusVal.value = props.selectedStatus;
});
</script>
