<template>
  <q-card class="min-w-[310px] md:min-w-[400px]">
    <q-card-section>
      <div class="text-lg font-medium mb-2 row justify-between items-center">
        <span>
          {{
            isEditCustomerGroup ? 'Edit Customer Group' : 'Add Customer Group'
          }}</span
        >
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <q-input
        dense
        maxlength="250"
        v-model="customerName"
        outlined
        label="Name"
        color="btn-primary"
      />
    </q-card-section>
    <q-card-actions align="right">
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
    </q-card-actions>
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
