<template>
  <q-card class="min-w-[370px]">
    <q-card-section>
      <div
        class="text-h6 q-mb-md"
        :class="isViewProfile && 'row items-center justify-between'"
      >
        <span>{{ isViewProfile ? 'View Profile' : 'Change Password' }}</span>
        <q-btn
          v-if="isViewProfile"
          label="edit"
          unelevated
          color="signature"
          @click="canUpdateProfile = true"
        />
      </div>
      <div v-if="isViewProfile" class="row q-col-gutter-md">
        <div class="col-6">
          <div>
            <q-input
              v-model="account.username"
              label="Name"
              outlined
              dense
              :readonly="!canUpdateProfile"
            />
          </div>
        </div>
        <div class="col-6">
          <div>
            <q-input
              v-model="account.cell"
              type="number"
              label="Phone #"
              outlined
              dense
              :readonly="!canUpdateProfile"
            />
          </div>
        </div>
      </div>
      <div v-else class="column">
        <div class="col-6 q-mb-md">
          <div>
            <q-input
              v-model="passwordConfirmation.oldPass"
              type="password"
              label="Old Password"
              outlined
              dense
            />
          </div>
        </div>
        <div class="col-6">
          <div>
            <q-input
              v-model="passwordConfirmation.newPass"
              label="New Password"
              outlined
              dense
              lazy-rules
              :rules="[
                (val) => val.length > 7 || 'The length of password must be 8',
              ]"
            />
          </div>
        </div>
        <div class="col-6">
          <div>
            <q-input
              v-model="passwordConfirmation.confirmPass"
              label="Confirm Password"
              outlined
              dense
              lazy-rules
              :rules="[
                (val) =>
                  val === passwordConfirmation.newPass ||
                  'This password does not match',
              ]"
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="row q-gutter-m-md justify-end">
      <q-btn
        label="Close"
        :color="isViewProfile && !canUpdateProfile ? 'signature' : 'red'"
        flat
        unelevated
        v-close-popup
      />
      <q-btn
        v-if="!isViewProfile || canUpdateProfile"
        label="Save"
        color="signature"
        flat
        unelevated
        :disable="
          !isViewProfile &&
          (!passwordConfirmation.oldPass ||
            !passwordConfirmation.newPass ||
            passwordConfirmation.newPass !== passwordConfirmation.confirmPass)
        "
        v-close-popup
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
interface IProps {
  isViewProfile: boolean;
}
const canUpdateProfile = ref(false);
const account = ref<{ username: string; cell: string }>({
  username: '',
  cell: '',
});
const passwordConfirmation = ref<{
  oldPass: string;
  newPass: string;
  confirmPass: string;
}>({
  oldPass: '',
  newPass: '',
  confirmPass: '',
});
withDefaults(defineProps<IProps>(), {
  isViewProfile: false,
});
</script>
