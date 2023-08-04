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
          color="btn-primary"
          @click="canUpdateProfile = true"
        />
      </div>
      <div v-if="isViewProfile" class="row q-col-gutter-md">
        <div class="col-6">
          <div>
            <q-input
              v-model="userInfo.fullName"
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
              v-model="userInfo.phoneNumber"
              label="Phone #"
              outlined
              dense
              :readonly="!canUpdateProfile"
            />
          </div>
        </div>
      </div>
      <div v-else class="column gap-1">
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
              type="password"
              outlined
              dense
              lazy-rules
              :rules="[
                (val) =>
                  val.length >= 6 || 'Passwords must be at least 6 characters.',
                (val) =>
                  /[^a-zA-Z0-9]/.test(val) ||
                  'Passwords must have at least one non-alphanumeric character.',
                (val) =>
                  /\d/.test(val) ||
                  'Passwords must have at least one digit (0-9).',
                (val) =>
                  /[A-Z]/.test(val) ||
                  'Passwords must have at least one uppercase letter (A-Z).',
              ]"
            />
          </div>
        </div>
        <div class="col-6">
          <div>
            <q-input
              v-model="passwordConfirmation.confirmPass"
              type="password"
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
        :color="isViewProfile && !canUpdateProfile ? 'btn-primary' : 'red'"
        flat
        unelevated
        v-close-popup
      />
      <q-btn
        v-if="!isViewProfile || canUpdateProfile"
        label="Save"
        color="btn-primary"
        :loading="isLoading"
        flat
        unelevated
        :disable="isButtonDisabled"
        @click="callingSaveNewPasswordApi"
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { changeUserPassword, viewUserProfile } from 'src/services/auth';
import { useQuasar } from 'quasar';
import { IGenericResponse } from 'src/interfaces';
import { isPosError } from 'src/utils';

interface IProps {
  isViewProfile: boolean;
}
onMounted(() => {
  callingViewUserProfileApi();
});
async function callingViewUserProfileApi() {
  try {
    const response: IGenericResponse<{
      fullName: string;
      phoneNumber: string;
    }> = await viewUserProfile();
    userInfo.value.fullName = response.data.fullName;
    userInfo.value.phoneNumber = response.data.phoneNumber;
    console.log(response.data.phoneNumber);
  } catch (e) {
    if (isPosError(e)) {
      $q.notify({
        message: e.message || 'Unexpected Error Occurred',
        color: 'red',
      });
    }
  }
}
const canUpdateProfile = ref(false);
const userInfo = ref<{ fullName: string; phoneNumber: string }>({
  fullName: '',
  phoneNumber: '',
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
const closeModal = ref(false);
const emit = defineEmits(['close-modal']);
const isLoading = ref<boolean>(false);
const $q = useQuasar();
const isButtonDisabled = computed(() => {
  const validations = [
    !passwordConfirmation.value.oldPass,
    passwordConfirmation.value.newPass.length < 6,
    !/[^a-zA-Z0-9]/.test(passwordConfirmation.value.newPass),
    !/\d/.test(passwordConfirmation.value.newPass),
    !/[A-Z]/.test(passwordConfirmation.value.newPass),
    passwordConfirmation.value.newPass !==
      passwordConfirmation.value.confirmPass,
  ];
  return validations.some((validation) => validation);
});
async function callingSaveNewPasswordApi() {
  const { oldPass, newPass } = passwordConfirmation.value;
  try {
    isLoading.value = true;
    const res: IGenericResponse = await changeUserPassword({
      oldPass,
      newPass,
    });
    isLoading.value = false;
    $q.notify({
      message: res.message,
      color: 'green',
    });
    passwordConfirmation.value.confirmPass = '';
    passwordConfirmation.value.newPass = '';
    passwordConfirmation.value.oldPass = '';
  } catch (e) {
    if (isPosError(e)) {
      isLoading.value = false;
      $q.notify({
        message: e.message,
        color: 'red',
      });
    }
  }
  closeModal.value = false;
  emit('close-modal', closeModal.value);
}
</script>
