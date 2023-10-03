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
                v-model="userData.name"
                label="Full Name"
                color="btn-primary"
              />
            </div>
          </div>

          <div class="col-md-6 col-12">
            <q-input
              dense
              outlined
              v-model="userData.phone"
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
              v-model="userData.address"
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
              v-model="userData.code"
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
        @click="
          action === 'Add New Shop' ? handleAddNewShop() : handleEditShop()
        "
        class="bg-btn-primary hover:bg-btn-primary-hover"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { IShopAddNew, IAddNewShopPayload } from 'src/interfaces';
type PropType = {
  selectedUser: IShopAddNew | null;
  action: string;
};
onMounted(() => {
  if (props.selectedUser) {
    userData.value = props.selectedUser;
  }
});
const userData = ref<IShopAddNew>({
  name: '',
  phone: '',
  address: '',
  code: '',
});

const isButtonDisabled = computed(() => {
  const { name, phone, address, code } = userData.value;
  const validations = ref<boolean[]>([]); // Initialize an array to store validation results

  // Validate Full Name: Check if it's empty
  validations.value.push(!name);

  // Validate Phone Number: Check if it doesn't meet the length criteria (14-15 characters)
  validations.value.push(!(phone.length >= 14 && phone.length <= 15));

  // Validate Address: Check if it's empty
  validations.value.push(!address);

  // Validate Code: Check if it's empty
  validations.value.push(!code);

  // Return true if any of the validations fail (resulting in a true value in the array)
  return validations.value.some((validation) => validation);
});

const emit = defineEmits<{
  (event: 'user-add', data: IAddNewShopPayload): void;
  (event: 'user-edit', data: IAddNewShopPayload): void;
}>();
const props = defineProps<PropType>();
const handleEditShop = () => {
  if (userData.value.phone) {
    if (userData.value.phone.charAt(3) === '0') {
      const userPhoneNumber = userData.value.phone;
      userData.value.phone =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
      userData.value.phone =
        userData.value.phone.substring(0, 3) +
        userData.value.phone.substring(4);
    } else if (
      userData.value.phone.charAt(3) !== '0' &&
      (userData.value.phone.length === 14 || userData.value.phone.length === 15)
    ) {
      const userPhoneNumber = userData.value.phone;
      userData.value.phone =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
    }
  }
  emit('user-edit', userData.value);
};
function handleAddNewShop() {
  if (userData.value.phone) {
    if (userData.value.phone.charAt(3) === '0') {
      const userPhoneNumber = userData.value.phone;
      userData.value.phone =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
      userData.value.phone =
        userData.value.phone.substring(0, 3) +
        userData.value.phone.substring(4);
    } else if (
      userData.value.phone.charAt(3) !== '0' &&
      (userData.value.phone.length === 14 || userData.value.phone.length === 15)
    ) {
      const userPhoneNumber = userData.value.phone;
      userData.value.phone =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
    }
  }
  emit('user-add', userData.value);
}
</script>
