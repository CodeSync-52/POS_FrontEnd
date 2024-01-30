<template>
  <q-card class="min-w-[310px] md:min-w-[400px]">
    <q-card-section>
      <div class="text-lg font-medium mb-2 row justify-between items-center">
        <span> {{ isEditExpense ? 'Edit Expense' : 'Add New Expense' }}</span>
        <q-btn icon="close" flat unelevated dense v-close-popup />
      </div>
      <q-input
        dense
        maxlength="250"
        v-model="expenseName"
        outlined
        label="Name"
        autofocus
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
        v-if="isEditExpense"
        label="Update"
        flat
        :loading="isLoading"
        unelevated
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="saveNewExpense('edit')"
      />
      <q-btn
        v-else
        label="Add"
        flat
        unelevated
        :disable="!expenseName"
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        :loading="isLoading"
        @click="saveNewExpense('add')"
      />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
const expenseName = ref('');
const isLoading = ref(false);
interface IProps {
  userName?: string;
  isEditExpense?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  userName: '',
  isEditExpense: false,
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
  expenseName.value = props.userName;
});
async function saveNewExpense(action: string) {
  if (isLoading.value) return;
  isLoading.value = true;
  await emit(
    'name-changed',
    expenseName.value,
    action,
    () => (isLoading.value = false)
  );
}
</script>
