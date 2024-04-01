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
const isLoading = ref(false);
const emit = defineEmits(['downloadPdfData', 'downloadCSVData']);
const downloadPdf = async () => {
  isLoading.value = true;
  emit('downloadPdfData');
  isLoading.value = false;
};
const excelPdfNotif = () => {
  isLoading.value = true;
  emit('downloadCSVData');
  isLoading.value = false;
};
</script>
