<template>
  <div class="mx-auto max-w-[400px]">
    <div class="flex flex-col">
      <div style="margin-bottom: 0.5rem; text-align: center">
        <div style="margin-bottom: 1.3rem">
          <span style="font-size: 0.8rem"> Purchase Receipt </span>
        </div>
        <div class="font-bold" style="margin-bottom: 1rem; font-size: 1.3rem">
          <span> KITSHOES SKP </span>
        </div>
        <div style="margin-bottom: 1rem">
          <span>Address</span>
        </div>
      </div>
      <div
        style="
          margin-bottom: 0.5rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <span>Pos: </span>
          <span>006</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <span>Mop: </span>
          <span>Cash Sales</span>
        </div>
      </div>
      <div
        style="
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        "
      >
        <span>Receipt #: </span>
        <span>{{ receiptId }}</span>
      </div>
      <div
        style="
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        "
      >
        <span>Date: </span>
        <span>{{
          moment(receiptTime ?? Date.now()).format('MMMM Do YYYY h:mm:ss a')
        }}</span>
      </div>
      <div
        style="
          display: grid !important;
          gap: 0.5rem;
          border-style: dotted;
          border-color: rgba(0, 0, 0, 0.7);
          border-width: 0.5px 0;
        "
        :style="
          isFirstSample
            ? 'grid-template-columns: 1fr 1fr 1fr 1fr 1fr'
            : 'grid-template-columns: 1fr 1fr'
        "
      >
        <span
          v-for="header in filteredTableColumn"
          :key="header"
          style="font-weight: bold"
          :style="header === 'Amt' ? 'text-align:right' : 'text-align:left'"
        >
          {{ header }}
        </span>
      </div>
      <div
        v-for="product in receiptItems"
        :key="product.inventoryId"
        style="display: grid !important; gap: 0.5rem; padding: 0.3rem 0"
        :style="
          isFirstSample
            ? 'grid-template-columns: 1fr 1fr 1fr 1fr 1fr'
            : 'grid-template-columns: 1fr 1fr'
        "
      >
        <span class="text-base">{{ product.productName }}</span>
        <span v-if="isFirstSample" class="text-base">{{
          product.dispatchQuantity
        }}</span>
        <span v-if="isFirstSample" class="text-base">{{
          product.retailPrice
        }}</span>
        <span v-if="isFirstSample" class="text-base">{{
          product.discount
        }}</span>
        <span class="text-base" style="text-align: right">{{
          product.retailPrice * product.dispatchQuantity -
          product.dispatchQuantity * product.discount
        }}</span>
      </div>
      <div
        style="
          display: grid !important;
          gap: 0.5rem;
          padding: 0.3rem 0;
          border-style: dotted;
          border-color: rgba(0, 0, 0, 0.7);
          border-width: 0.5px 0;
        "
        :style="
          isFirstSample
            ? 'grid-template-columns: 1fr 1fr 1fr 1fr 1fr'
            : 'grid-template-columns: 1fr 1fr'
        "
      >
        <span>Total</span>
        <span v-if="isFirstSample">{{
          !isNaN(totalReceiptAmount(receiptItems, 'dispatchQuantity'))
            ? totalReceiptAmount(receiptItems, 'dispatchQuantity')
            : 0
        }}</span>
        <span v-if="isFirstSample"></span>
        <span v-if="isFirstSample">{{
          !isNaN(totalReceiptAmount(receiptItems, 'discount'))
            ? totalReceiptAmount(receiptItems, 'discount')
            : 0
        }}</span>
        <span style="text-align: right">{{
          !isNaN(totalReceiptAmount(receiptItems, 'retailPrice'))
            ? totalReceiptAmount(receiptItems, 'retailPrice')
            : 0
        }}</span>
      </div>
      <div
        style="
          display: grid !important;
          gap: 0.5rem;
          padding: 0.3rem 0;
          border-style: dotted;
          border-color: rgba(0, 0, 0, 0.7);
          border-width: 0 0 0.5px;
        "
        :style="
          isFirstSample
            ? 'grid-template-columns: 1fr 1fr 1fr 1fr 1fr'
            : 'grid-template-columns:1fr 1fr 1fr 1fr'
        "
      >
        <span></span>
        <span v-if="isFirstSample"></span>
        <span></span>
        <span style="font-weight: bold">Net Total</span>
        <span style="text-align: right; font-weight: bold">{{
          !isNaN(totalReceiptAmount(receiptItems, 'retailPrice'))
            ? totalReceiptAmount(receiptItems, 'retailPrice')
            : 0
        }}</span>
      </div>
      <p style="white-space: pre; text-transform: uppercase">
        {{ receiptDescriptionNote.description }}
      </p>
      <div
        style="
          display: flex;
          gap: 0.5rem;
          padding: 0.3rem 0;
          border-style: dotted;
          border-color: rgba(0, 0, 0, 0.7);
          border-width: 0.5px 0;
        "
      >
        <span>Powered by <span style="font-weight: bold"> CodeSync</span></span>
        <span>&lt; www.codesyncs.com &gt;</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import moment from 'moment';
import receiptDescriptionNote from 'src/utils/receipt-description.json';
import { ISaleShopSelectedInventory } from 'src/interfaces';
import { computed } from 'vue';
interface IProps {
  receiptItems: ISaleShopSelectedInventory[];
  isFirstSample: boolean;
  receiptId: null | number;
  receiptTime: null | string;
}
const props = withDefaults(defineProps<IProps>(), {
  receiptItems: () => [],
  receiptId: null,
  receiptTime: null,
  isFirstSample: false,
});
const receiptTableColumn = ['Product', 'Qty', 'Price', 'Disc', 'Amt'];
const totalReceiptAmount = (
  table: ISaleShopSelectedInventory[],
  type: 'retailPrice' | 'dispatchQuantity' | 'discount'
) => {
  return table.reduce((acc: number, row: ISaleShopSelectedInventory) => {
    if (type === 'retailPrice') {
      return (
        acc +
        row[type] * row.dispatchQuantity -
        row.dispatchQuantity * row.discount
      );
    }
    return acc + row[type];
  }, 0);
};
const filteredTableColumn = computed(() => {
  if (!props.isFirstSample) {
    return receiptTableColumn.filter(
      (header) => header === 'Product' || header === 'Amt'
    );
  }
  return receiptTableColumn;
});
</script>
