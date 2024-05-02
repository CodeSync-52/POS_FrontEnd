<template>
  <div
    class="mx-auto max-w-[400px]"
    style="font-family: Arial, Helvetica, sans-serif"
  >
    <div class="flex flex-col">
      <div style="margin-bottom: 0.5rem; text-align: center">
        <div
          style="
            margin: 0 auto 1rem;
            width: 100%;
            display: flex;
            justify-content: center;
          "
        >
          <shoe-store-icon />
        </div>
        <div>
          <span>{{ receiptDetail?.shopName }}</span>
        </div>
        <div style="margin-bottom: 1rem">
          <span>{{ receiptDetail?.address }}</span>
        </div>
        <div style="margin-bottom: 1rem">
          <span>{{ receiptDetail?.phone }}</span>
        </div>
      </div>
      <div
        style="
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
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
          font-size: 1.25rem;
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
          font-size: 1.25rem;
        "
        :style="
          isFirstSample === 'first'
            ? 'grid-template-columns: 1fr 1fr 1fr 1fr 2fr'
            : 'grid-template-columns: 1fr 1fr 1fr'
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
        style="
          display: grid !important;
          gap: 0.5rem;
          padding: 0.3rem 0;
          font-size: 1.25rem;
        "
        :style="
          isFirstSample === 'first'
            ? 'grid-template-columns: 1fr 1fr 1fr 1fr 2fr'
            : 'grid-template-columns: 1fr 1fr 1fr'
        "
      >
        <span class="text-base">{{ product.productCode.split(',')[0] }}</span>
        <span class="text-base">{{
          product.isReturn
            ? product.dispatchQuantity * -1
            : product.dispatchQuantity
        }}</span>
        <span v-if="isFirstSample === 'first'" class="text-base">{{
          product.retailPrice
        }}</span>
        <span v-if="isFirstSample === 'first'" class="text-base">{{
          product.discount
        }}</span>
        <span class="text-base" style="text-align: right">
          {{
            product.isReturn
              ? product.amount * -1 - product.discount
              : product.amount - product.discount
          }}</span
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
          font-size: 1.25rem;
        "
        :style="
          isFirstSample === 'first'
            ? 'grid-template-columns: 1fr 1fr 1fr 1fr 2fr'
            : 'grid-template-columns: 1fr 1fr 1fr'
        "
      >
        <span>Total</span>
        <span>{{ receiptDetail?.totalQuantity }}</span>
        <span v-if="isFirstSample === 'first'"></span>
        <span v-if="isFirstSample === 'first'">{{
          receiptDetail?.totalDiscount
        }}</span>
        <span style="text-align: right">
          {{
            (receiptDetail && receiptDetail.totalSalesAmount
              ? receiptDetail.totalSalesAmount
              : 0) -
            (receiptDetail && receiptDetail.totalDiscount
              ? receiptDetail.totalDiscount
              : 0)
          }}
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
          grid-template-columns: 1fr 1fr 1fr;
          font-size: 1.25rem;
        "
      >
        <span></span>
        <span style="font-weight: bold">Net Total</span>
        <span style="text-align: right; font-weight: bold">
          {{ receiptDetail?.netAmount }}
        </span>
      </div>
      <p
        v-if="settingObj.receiptDescription"
        style="white-space: pre; text-transform: uppercase"
      >
        <span
          v-for="(item, index) in settingObj.receiptDescription.split('.')"
          :key="index"
        >
          {{
            index === settingObj.receiptDescription.split('.').length - 1
              ? item.trim()
              : item.trim() + '.'
          }}<br
            v-if="index !== settingObj.receiptDescription.split('.').length - 1"
          />
        </span>
      </p>
      <p
        v-else
        style="white-space: pre; text-transform: uppercase; font-size: 1.25rem"
      >
        No Refunds. <br />You must have your receipt to exchange within 15 days.
        <br />We can not change used shoes sale stock. <br />Thank you for your
        visit.
      </p>
      <div
        style="
          display: flex;
          gap: 0.5rem;
          padding: 0.3rem 0;
          border-style: dotted;
          border-color: rgba(0, 0, 0, 0.7);
          border-width: 0.5px 0;
          font-size: 0.9rem;
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
import ShoeStoreIcon from 'src/components/pos-icon/Shoe-Store-Svg.vue';
import { IPreviewSaleResponse, ISetting } from 'src/interfaces';
import { GetSetting } from 'src/services';
import { ref, onMounted, computed } from 'vue';
const settingObj = ref<ISetting>({
  receiptDescription: '',
});
onMounted(() => {
  getSettings();
});

const getSettings = async () => {
  try {
    const response = await GetSetting();
    if (response.data && response.data.receiptDescription) {
      settingObj.value = response.data;
    }
  } catch (error) {}
};

interface IProps {
  receiptDetail: IPreviewSaleResponse | null;
  isFirstSample: string;
}
const props = withDefaults(defineProps<IProps>(), {
  receiptDetail: null,
  isFirstSample: 'first',
});
const receiptTableColumn = ['Product', 'Qty', 'Price', 'Disc', 'Amt'];
const filteredTableColumn = computed(() => {
  if (props.isFirstSample === 'second') {
    return receiptTableColumn.filter(
      (header) => header === 'Product' || header === 'Qty' || header === 'Amt'
    );
  }
  return receiptTableColumn;
});
</script>
