<template>
  <q-card class="min-w-[310px] md:min-w-[400px]">
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-lg font-medium"> {{ action }}</span>
        <span
          ><q-btn
            class="close-modal"
            v-close-popup
            flat
            unelevated
            dense
            size="md"
            icon="close"
        /></span>
      </div>
      <div class="flex flex-col gap-2">
        <div class="row q-col-gutter-sm">
          <div class="col-md-6 col-12">
            <div>
              <q-input
                dense
                outlined
                maxlength="250"
                v-model="shopData.name"
                label="Full Name"
                autofocus
                color="btn-primary"
              />
            </div>
          </div>

          <div class="col-md-6 col-12">
            <q-input
              dense
              outlined
              v-model="shopData.phone"
              type="tel"
              color="btn-primary"
              mask="+92###-########"
              label="Phone Number"
            />
          </div>
          <div class="col-md-6 col-12">
            <q-input
              dense
              outlined
              v-model="shopData.address"
              type="text"
              color="btn-primary"
              label="Address"
              maxlength="250"
            />
          </div>
          <div class="col-md-6 col-12">
            <q-input
              dense
              outlined
              v-model="shopData.code"
              type="text"
              color="btn-primary"
              label="Code"
              maxlength="250"
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        label="Cancel"
        color="signature"
        v-close-popup
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
      />
      <q-btn
        flat
        :label="action === 'Add New Shop' ? 'Add' : 'Save'"
        color="signature"
        :disable="isButtonDisabled"
        :loading="isLoading"
        @click="
          action === 'Add New Shop' ? handleAddNewShop() : handleEditShop()
        "
        class="bg-btn-primary hover:bg-btn-primary-hover"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { IShopResponse } from 'src/interfaces';
import { onMounted, computed, ref } from 'vue';
interface PropType {
  action: string;
  selectedShop: IShopResponse | null;
}
const isLoading = ref(false);
const shopData = ref<IShopResponse>({
  address: '',
  closingBalance: 0,
  code: '',
  isWareHouse: '',
  name: '',
  phone: '',
  shopId: 0,
  status: '',
});
onMounted(() => {
  if (props.selectedShop) {
    shopData.value = props.selectedShop;
  }
});

const isButtonDisabled = computed(() => {
  const { name, phone, address, code } = shopData.value;
  const validations = ref<boolean[]>([]);
  validations.value.push(!name);
  validations.value.push(!(phone.length >= 14 && phone.length <= 15));
  validations.value.push(!address);
  validations.value.push(!code);
  return validations.value.some((validation) => validation);
});

const emit = defineEmits<{
  (event: 'user-add', shopData: IShopResponse, callback: () => void): void;
  (event: 'user-edit', shopData: IShopResponse, callback: () => void): void;
}>();
const props = withDefaults(defineProps<PropType>(), {
  selectedShop: null,
  action: 'Add',
});
const handleEditShop = () => {
  if (shopData.value.phone) {
    if (shopData.value.phone.charAt(3) === '0') {
      const userPhoneNumber = shopData.value.phone;
      shopData.value.phone =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
      shopData.value.phone =
        shopData.value.phone.substring(0, 3) +
        shopData.value.phone.substring(4);
    } else if (
      shopData.value.phone.charAt(3) !== '0' &&
      (shopData.value.phone.length === 14 || shopData.value.phone.length === 15)
    ) {
      const userPhoneNumber = shopData.value.phone;
      shopData.value.phone =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
    }
  }
  isLoading.value = true;
  emit('user-edit', shopData.value, () => (isLoading.value = false));
};
function handleAddNewShop() {
  if (shopData.value.phone) {
    if (shopData.value.phone.charAt(3) === '0') {
      const userPhoneNumber = shopData.value.phone;
      shopData.value.phone =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
      shopData.value.phone =
        shopData.value.phone.substring(0, 3) +
        shopData.value.phone.substring(4);
    } else if (
      shopData.value.phone.charAt(3) !== '0' &&
      (shopData.value.phone.length === 14 || shopData.value.phone.length === 15)
    ) {
      const userPhoneNumber = shopData.value.phone;
      shopData.value.phone =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
    }
  }
  isLoading.value = true;
  emit('user-add', shopData.value, () => (isLoading.value = false));
}
</script>
