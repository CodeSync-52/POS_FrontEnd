<template>
  <div>
    <q-btn-dropdown
      dropdown-icon="arrow_downward"
      label="Download Report"
      class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover text-white"
    >
      <q-list>
        <q-item clickable @click="downloadPdf" v-close-popup>
          <q-item-section>
            <q-item-label>Download in PDF</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="excelPdfNotif()" v-close-popup>
          <q-item-section>
            <q-item-label>Download in Excel</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const isLoading = ref(false);
const emit = defineEmits<{ (event: 'downloadPdfData'): void }>();
const downloadPdf = async () => {
  isLoading.value = true;
  emit('downloadPdfData');
  isLoading.value = false;
};
const excelPdfNotif = () => {
  $q.notify({
    message:
      'Download in Excel is unavailable at the moment as work  is in progress',
    type: 'warning',
  });
};
</script>
