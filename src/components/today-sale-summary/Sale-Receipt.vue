<template>
  <div :ref="divToPrint" class="mx-auto max-w-[400px]">
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
        <span>260889</span>
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
        <span>{{ moment(timeStamp).format('MMMM Do YYYY h:mm:ss a') }}</span>
      </div>
      <div
        style="
          display: grid !important;
          gap: 0.5rem;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          border-style: dotted;
          border-color: rgba(0, 0, 0, 0.7);
          border-width: 0.5px 0;
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
        style="
          display: grid !important;
          gap: 0.5rem;
          padding: 0.3rem 0;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        "
      >
        <span class="text-base">{{ product.productName }}</span>
        <span class="text-base">{{ product.dispatchQuantity }}</span>
        <span class="text-base">{{ product.retailPrice }}</span>
        <span class="text-base">{{ product.discount }}</span>
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
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          border-style: dotted;
          border-color: rgba(0, 0, 0, 0.7);
          border-width: 0.5px 0;
        "
      >
        <span>Total</span>
        <span>{{
          !isNaN(totalReceiptAmount(receiptItems, 'dispatchQuantity'))
            ? totalReceiptAmount(receiptItems, 'dispatchQuantity')
            : 0
        }}</span>
        <span></span>
        <span>{{
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
          grid-template-columns: 1fr 1fr 1fr 1fr;
          border-style: dotted;
          border-color: rgba(0, 0, 0, 0.7);
          border-width: 0.5px 0;
        "
      >
        <span></span>
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
  divToPrint?: string;
  receiptItems: ISaleShopSelectedInventory[];
  isfirstSample: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  divToPrint: '',
  receiptItems: () => [],
  isfirstSample: false,
});
const receiptTableColumn = ['Product', 'Qty', 'Price', 'Disc', 'Amt'];
const timeStamp = Date.now();
const totalReceiptAmount = (
  table: ISaleShopSelectedInventory[],
  type: 'retailPrice' | 'dispatchQuantity' | 'discount'
) => {
  return table.reduce((acc: number, row: ISaleShopSelectedInventory) => {
    return acc + row[type];
  }, 0);
};
const filteredTableColumn = computed(() => {
  if (props.isfirstSample) {
    return receiptTableColumn.filter(
      (header) => header === 'Product' || header === 'Amt'
    );
  }
  return receiptTableColumn;
});
</script>
