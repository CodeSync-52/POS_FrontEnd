<template>
  <div>
    <div class="text-lg text-center md:text-left font-medium mb-4">
      <span>Add New Flow</span>
    </div>
    <q-card>
      <q-card-section>
        <div class="q-gutter-y-md">
          <div class="row q-col-gutter-md">
            <div class="col-md-4 col-12 q-gutter-y-md">
              <div>
                <span class="text-base font-medium">Source</span>
                <q-select
                  label="Source"
                  dense
                  outlined
                  :options="sourceOptions"
                  @update:model-value="
                    addNewFlow.sourceOutstandingBalance =
                      $event.outstandingBalance
                  "
                  v-model="addNewFlow.source"
                />
              </div>
              <q-input
                v-if="addNewFlow.sourceOutstandingBalance"
                v-model="addNewFlow.sourceOutstandingBalance"
                disable
                label="Source Outstanding Balance"
                dense
                outlined
              />
            </div>
            <div class="col-md-4 col-12 q-gutter-y-md">
              <div>
                <span class="text-base font-medium">Target</span>
                <q-select
                  label="Target"
                  dense
                  outlined
                  @update:model-value="
                    addNewFlow.targetOutstandingBalance =
                      $event.outstandingBalance
                  "
                  :options="targetOptions"
                  v-model="addNewFlow.target"
                />
              </div>
              <q-input
                v-if="addNewFlow.targetOutstandingBalance"
                v-model="addNewFlow.targetOutstandingBalance"
                disable
                label="Target Outstanding Balance"
                dense
                outlined
              />
            </div>
            <div class="col-md-4 col-12">
              <span class="text-base font-medium">Amount</span>
              <q-input
                min="0"
                type="number"
                label="Amount"
                dense
                outlined
                v-model="addNewFlow.amount"
              />
            </div>
          </div>
          <div class="q-gutter-y-xs">
            <span class="font-medium text-base">Comments</span>
            <q-input
              autogrow
              color="btn-primary"
              placeholder="Add your comment"
              outlined
              type="textarea"
              v-model="addNewFlow.comment"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          unelevated
          label="Cancel"
          color="btn-cancel hover:bg-btn-cancel-hover"
          @click="router.push('/cash-flow')"
        />
        <q-btn
          label="Add"
          unelevated
          :disable="
            !addNewFlow.source || !addNewFlow.target || addNewFlow.amount <= 0
          "
          :loading="isAdding"
          @click="handleAddNewFlow"
          color="btn-primary"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const isAdding = ref(false);
const addNewFlow = ref({
  source: 0,
  target: 0,
  amount: 0,
  comment: '',
  sourceOutstandingBalance: null,
  targetOutstandingBalance: null,
});
const handleAddNewFlow = () => {
  console.log(addNewFlow.value);
};
const targetOptions = [
  { label: 'label 1', outstandingBalance: 5 },
  { label: 'label 2', outstandingBalance: 15 },
];
const sourceOptions = [
  { label: 'label 1', outstandingBalance: 15 },
  { label: 'label 2', outstandingBalance: 25 },
];
</script>
