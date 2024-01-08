<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-center sm:flex-col sm:gap-2 md:items-center sm:items-center mb-4"
  >
    <span class="text-lg font-semibold">All Bills Details</span>
  </div>
  <div
    class="row flex lg:justify-end sm:justify-center items-center min-h-[3.5rem] gap-4"
  >
    <q-select
      dense
      style="min-width: 200px"
      outlined
      v-model="statusInput"
      map-options
      popup-content-class="!max-h-[200px]"
      label="Status"
      option-label="name"
      option-value="customerGroupId"
      color="btn-primary"
    >
    </q-select>
    <q-select
      dense
      style="min-width: 200px"
      outlined
      map-options
      v-model="shopId"
      popup-content-class="!max-h-[200px]"
      label="Shop ID"
      color="btn-primary"
    />
    <q-input
      dense
      style="min-width: 200px"
      outlined
      v-model="shopBoyCode"
      label="Shop Boy Code"
      color="btn-primary"
    />
    <q-input
      v-model="startDate"
      label="From"
      type="date"
      style="min-width: 200px"
      outlined
      dense
      color="btn-primary"
    />
    <q-input
      v-model="endDate"
      label="To"
      type="date"
      style="min-width: 200px"
      outlined
      color="btn-primary"
      dense
    />
    <div class="flex lg:justify-end sm:justify-center items-end gap-2">
      <q-btn
        unelevated
        color=""
        class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
        icon="search"
        label="Search"
      />
      <q-btn
        unelevated
        color=""
        class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
        label="Clear"
      />
    </div>
  </div>
  <div class="py-4">
    <q-table
      flat
      bordered
      title="Bills"
      :columns="shopAllBillsTableColumn"
      row-key="id"
    >
      <template v-slot:no-data>
        <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
          <q-icon name="warning" size="xs" />
          <span class="text-md font-medium"> No data available. </span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusInput = ref('');
const shopId = ref('');
const shopBoyCode = ref('');
const startDate = ref('');
const endDate = ref('');
import { shopAllBillsTableColumn } from './utils';
</script>
