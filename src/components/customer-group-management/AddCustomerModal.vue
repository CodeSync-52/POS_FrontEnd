<template>
  <q-card class="q-pa-md full-width">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <span>
          {{
            isEditCustomerGroup ? 'Edit Customer Group' : 'Add Customer Group'
          }}</span
        >
      </div>
      <q-input
        dense
        v-model="customerName"
        outlined
        label="Name"
        color="btn-primary"
      />
    </q-card-section>
    <div class="row justify-end gap-4">
      <q-btn
        label="Cancel"
        flat
        unelevated
        color="signature"
        v-close-popup
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
      />
      <q-btn
        v-if="isEditCustomerGroup"
        label="Save"
        flat
        :loading="isLoading"
        unelevated
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="saveNewCustomer('edit')"
      />
      <q-btn
        v-else
        label="Add"
        flat
        unelevated
        :disable="!customerName"
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        :loading="isLoading"
        @click="saveNewCustomer('add')"
      />
    </div>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
const customerName = ref('');
const isLoading = ref(false);
interface IProps {
  userName?: string;
  isEditCustomerGroup?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  userName: '',
  isEditCustomerGroup: false,
});

const emit = defineEmits<{
  (
    event: 'name-changed',
    action: string,
    newName: string,
    callback: () => void
  ): Promise<void>;
}>();
onMounted(() => {
  customerName.value = props.userName;
});

async function saveNewCustomer(action: string) {
  if (isLoading.value) return;
  isLoading.value = true;
  await emit(
    'name-changed',
    customerName.value,
    action,
    () => (isLoading.value = false)
  );
}
</script>
