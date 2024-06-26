<template>
  <q-card class="min-w-[310px] md:min-w-[400px]">
    <q-card-section>
      <div
        class="text-lg font-medium mb-2"
        :class="isViewProfile && 'row items-center justify-between'"
      >
        <span>{{ isViewProfile ? 'View Profile' : 'Change Password' }}</span>
        <q-btn
          v-if="isViewProfile"
          label="edit"
          unelevated
          class="bg-btn-primary hover:bg-btn-primary-hover"
          color="Signature"
          @click="canUpdateProfile = true"
        />
      </div>
      <div v-if="isViewProfile" class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div>
            <q-input
              maxlength="250"
              v-model="userInfo.fullName"
              label="Name"
              outlined
              dense
              :readonly="!canUpdateProfile"
            />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div>
            <q-input
              v-model="userInfo.phoneNumber"
              outlined
              mask="+92###-########"
              label="Phone Number"
              lazy-rules
              :rules="[
                (val) =>
                  (val.length >= 14 && val.length <= 15) ||
                  'This entered number is not valid',
              ]"
              dense
              :readonly="!canUpdateProfile"
            />
          </div>
        </div>
      </div>
      <div v-else class="column gap-1">
        <div class="col-12 col-md-6 q-mb-md">
          <div>
            <q-input
              v-model="passwordConfirmation.oldPass"
              maxlength="250"
              type="password"
              label="Old Password"
              color="btn-primary"
              outlined
              dense
            />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div>
            <q-input
              v-model="passwordConfirmation.newPass"
              maxlength="250"
              label="New Password"
              color="btn-primary"
              type="password"
              outlined
              dense
              lazy-rules
              :rules="passwordRules"
            />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div>
            <q-input
              v-model="passwordConfirmation.confirmPass"
              maxlength="250"
              type="password"
              label="Confirm Password"
              color="btn-primary"
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
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
        :color="isViewProfile && !canUpdateProfile ? 'signature' : 'signature'"
        flat
        unelevated
        v-close-popup
      />
      <q-btn
        v-if="!isViewProfile || canUpdateProfile"
        label="Save"
        color="signature"
        class="bg-btn-primary"
        :loading="isLoading"
        :disable="
          isViewProfile || canUpdateProfile
            ? !userInfo.fullName ||
              !userInfo.phoneNumber ||
              !(
                userInfo.phoneNumber.length >= 14 &&
                userInfo.phoneNumber.length <= 15
              )
            : isButtonDisabled
        "
        flat
        unelevated
        @click="
          isViewProfile || canUpdateProfile
            ? handleUpdateProfile()
            : callingSaveNewPasswordApi()
        "
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import {
  changeUserPassword,
  GetUserProfile,
  UpdateUserProfile,
} from 'src/services';
import { useQuasar } from 'quasar';
import { IGenericResponse } from 'src/interfaces';
import { isPosError } from 'src/utils';
import { useAuthStore } from 'src/stores';

interface IProps {
  isViewProfile: boolean;
}
onMounted(() => {
  if (props.isViewProfile) {
    callingViewUserProfileApi();
  }
});
const handleUpdateProfile = () => {
  if (userInfo.value.phoneNumber) {
    if (userInfo.value.phoneNumber.charAt(3) === '0') {
      const userPhoneNumber = userInfo.value.phoneNumber;
      userInfo.value.phoneNumber =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
      userInfo.value.phoneNumber =
        userInfo.value.phoneNumber.substring(0, 3) +
        userInfo.value.phoneNumber.substring(4);
    } else if (
      userInfo.value.phoneNumber.charAt(3) !== '0' &&
      (userInfo.value.phoneNumber.length === 14 ||
        userInfo.value.phoneNumber.length === 15)
    ) {
      const userPhoneNumber = userInfo.value.phoneNumber;
      userInfo.value.phoneNumber =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
    }
  }
  updateProfile();
};
const updateProfile = async () => {
  try {
    isLoading.value = true;
    const res: IGenericResponse = await UpdateUserProfile({
      payload: userInfo.value,
    });
    isLoading.value = false;
    $q.notify({
      message: res.message,
      color: 'green',
    });
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  closeModal.value = false;
  emit('close-modal', closeModal.value);
};
async function callingViewUserProfileApi() {
  try {
    const response: IGenericResponse<{
      fullName: string;
      phoneNumber: string;
    }> = await GetUserProfile();
    if (response && response.data) userInfo.value = response.data;
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
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
const props = withDefaults(defineProps<IProps>(), {
  isViewProfile: false,
});
const closeModal = ref(false);
const emit = defineEmits(['close-modal']);
const authStore = useAuthStore();
const isLoading = ref<boolean>(false);
const $q = useQuasar();
const isButtonDisabled = computed(() => {
  const { oldPass, newPass, confirmPass } = passwordConfirmation.value;
  const hasValidPassword =
    newPass.length >= 6 &&
    /[^a-zA-Z0-9]/.test(newPass) &&
    /\d/.test(newPass) &&
    /[A-Z]/.test(newPass);
  const validations = [!oldPass, !hasValidPassword, newPass !== confirmPass];
  return validations.some((validation) => validation);
});
const passwordRules = [
  (val: string) =>
    val.length >= 6 || 'Passwords must be at least 6 characters.',
  (val: string) =>
    /[^a-zA-Z0-9]/.test(val) ||
    'Passwords must have at least one non-alphanumeric character.',
  (val: string) =>
    /\d/.test(val) || 'Passwords must have at least one digit (0-9).',
  (val: string) =>
    /[A-Z]/.test(val) ||
    'Passwords must have at least one uppercase letter (A-Z).',
];
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
    authStore.logoutUser();
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  closeModal.value = false;
  emit('close-modal', closeModal.value);
}
</script>
