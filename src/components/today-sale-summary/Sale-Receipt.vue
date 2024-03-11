<template>
  <div
    class="mx-auto max-w-[400px]"
    style="font-family: 'Courier New', Courier, monospace"
  >
    <div class="flex flex-col">
      <div style="margin-bottom: 0.5rem; text-align: center">
        <div style="margin: 0 auto 1rem; width: 7rem; font-size: 1.3rem">
          <img src="/assets/Pos-icon.png" alt="" />
        </div>
        <div style="margin-bottom: 1rem">
          <span>{{ receiptDetail?.address }}</span>
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
        <span>{{ receiptDetail?.saleId }}</span>
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
          moment(receiptDetail?.saleDate).format('D-MMM-YYYY h:mm:ss A')
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
          isFirstSample === 'first'
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
        v-for="product in receiptDetail?.saleDetailInfos"
        :key="product.inventoryId"
        style="display: grid !important; gap: 0.5rem; padding: 0.3rem 0"
        :style="
          isFirstSample === 'first'
            ? 'grid-template-columns: 1fr 1fr 1fr 1fr 1fr'
            : 'grid-template-columns: 1fr 1fr'
        "
      >
        <span class="text-base">{{ product.productName }}</span>
        <span v-if="isFirstSample === 'first'" class="text-base">{{
          product.dispatchQuantity
        }}</span>
        <span v-if="isFirstSample === 'first'" class="text-base">{{
          product.retailPrice
        }}</span>
        <span v-if="isFirstSample === 'first'" class="text-base">{{
          product.discount
        }}</span>
        <span class="text-base" style="text-align: right"
          ><span v-if="product.isReturn">(ret)</span> {{ product.amount }}</span
        >
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
          isFirstSample === 'first'
            ? 'grid-template-columns: 1fr 1fr 1fr 1fr 1fr'
            : 'grid-template-columns: 1fr 1fr'
        "
      >
        <span>Total</span>
        <span v-if="isFirstSample === 'first'">{{
          receiptDetail?.totalQuantity
        }}</span>
        <span v-if="isFirstSample === 'first'"></span>
        <span v-if="isFirstSample === 'first'">{{
          receiptDetail?.totalDiscount
        }}</span>
        <span style="text-align: right">{{
          receiptDetail?.totalSalesAmount
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
          grid-template-columns: 1fr 1fr 1fr 1fr;
        "
      >
        <span></span>
        <span></span>
        <span style="font-weight: bold">Total Return</span>
        <span style="text-align: right; font-weight: bold">
          {{ receiptDetail?.totalReturnAmount }}
        </span>
      </div>
      <div
        style="
          display: grid !important;
          gap: 0.5rem;
          padding: 0.3rem 0;
          border-style: dotted;
          border-color: rgba(0, 0, 0, 0.7);
          border-width: 0 0 0.5px;
          grid-template-columns: 1fr 1fr 1fr 1fr;
        "
      >
        <span></span>
        <span></span>
        <span style="font-weight: bold">Total Sale</span>
        <span style="text-align: right; font-weight: bold">
          {{ receiptDetail?.totalSalesAmount }}
        </span>
      </div>
      <div
        style="
          display: grid !important;
          gap: 0.5rem;
          padding: 0.3rem 0;
          border-style: dotted;
          border-color: rgba(0, 0, 0, 0.7);
          border-width: 0 0 0.5px;
          grid-template-columns: 1fr 1fr 1fr 1fr;
        "
      >
        <span></span>
        <span></span>
        <span style="font-weight: bold">Total Discount</span>
        <span style="text-align: right; font-weight: bold">
          {{ receiptDetail?.totalDiscount }}
        </span>
      </div>
      <div
        style="
          display: grid !important;
          gap: 0.5rem;
          padding: 0.3rem 0;
          border-style: dotted;
          border-color: rgba(0, 0, 0, 0.7);
          border-width: 0 0 0.5px;
          grid-template-columns: 1fr 1fr 1fr 1fr;
        "
      >
        <span></span>
        <span></span>
        <span style="font-weight: bold">Net Total</span>
        <span style="text-align: right; font-weight: bold">
          {{ receiptDetail?.netAmount }}
        </span>
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
import {
  IPreviewSaleResponse,
  ISaleShopSelectedInventory,
} from 'src/interfaces';
import { computed } from 'vue';
interface IProps {
  receiptDetail: IPreviewSaleResponse | null;
  receiptItems: ISaleShopSelectedInventory[];
  isFirstSample: 'first' | 'second';
  receiptId: null | number;
}
const props = withDefaults(defineProps<IProps>(), {
  receiptDetail: null,
  receiptItems: () => [],
  receiptId: null,
  isFirstSample: 'first',
});
const receiptTableColumn = ['Product', 'Qty', 'Price', 'Disc', 'Amt'];
// const totalReceiptAmount = (
//   table: ISaleShopSelectedInventory[],
//   type: 'retailPrice' | 'dispatchQuantity' | 'discount'
// ) => {
//   return table.reduce((acc: number, row: ISaleShopSelectedInventory) => {
//     if (type === 'retailPrice') {
//       return (
//         acc +
//         row[type] * row.dispatchQuantity -
//         row.dispatchQuantity * row.discount
//       );
//     }
//     return acc + row[type];
//   }, 0);
// };
const filteredTableColumn = computed(() => {
  if (props.isFirstSample === 'second') {
    return receiptTableColumn.filter(
      (header) => header === 'Product' || header === 'Amt'
    );
  }
  return receiptTableColumn;
});
</script>
