<template>
  <div>
    <q-header class="bg-signature" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-btn-primary hover:text-btn-primary-hover bg-text_hover"
        />
        <q-toolbar-title class="text-black">Point of Sale </q-toolbar-title>
        <outside-click-container
          @outside-click="showAccountInfoDropdown = false"
        >
          <div class="accountInfoIcon relative flex">
            <div class="flex justify-center items-center">
              <span
                class="text-black rounded-full text-bold flex justify-center items-center bg-[#bab6b6] m-2 w-[3rem] h-[3rem]"
              >
                {{
                  authStore.loggedInUser?.fullName
                    .split(' ')
                    .map((namePart) => namePart[0])
                    .join('')
                    .toUpperCase()
                }}
              </span>
            </div>
            <div
              class="bg-signature cursor-pointer flex flex-col ite justify-center leading-4"
              @click="handleShowAccountInfoDropdown"
            >
              <span class="text-black font-medium">
                {{ authStore.loggedInUser?.fullName }}
              </span>
              <span class="text-[#8e8a8a] text-[12px]">{{
                authStore.loggedInUser?.rolePermissions.roleName
              }}</span>
            </div>

            <q-card
              v-if="showAccountInfoDropdown"
              class="absolute right-[2px] z-10 top-[45px] rounded-md"
            >
              <q-card-section class="min-w-[180px] q-pa-none">
                <q-item
                  class="hover:bg-slate-200"
                  clickable
                  v-close-popup
                  @click="handleViewProfile(true)"
                >
                  <q-item-section>
                    <q-item-label class="row items-center q-gutter-x-sm"
                      ><q-icon name="visibility" size="xs" color="green" />
                      <span class="text-green">View Profile</span></q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item
                  class="hover:bg-slate-200"
                  clickable
                  @click="handleViewProfile(false)"
                >
                  <q-item-section>
                    <q-item-label class="row items-center q-gutter-x-sm"
                      ><q-icon name="lock" size="xs" color="btn-primary" />
                      <span class="text-btn-primary"
                        >Change Password</span
                      ></q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item
                  class="hover:bg-slate-200"
                  clickable
                  @click="handleLogout"
                >
                  <q-item-section>
                    <q-item-label class="row items-center q-gutter-x-sm"
                      ><q-icon name="logout" size="xs" color="red" />
                      <span class="text-red">Logout</span></q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-card-section>
            </q-card>
          </div>
        </outside-click-container>
      </q-toolbar>
    </q-header>
  </div>
  <q-dialog v-model="isAccountInfoModalVisible">
    <account-info-modal
      :isViewProfile="isViewProfile"
      @close-modal="handleCloseModal"
    />
  </q-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
import AccountInfoModal from '../../components/header/AccountInfoModal.vue';
import OutsideClickContainer from '../common/OutsideClickContainer.vue';
import { logoutUser } from 'src/services';
import { isPosError } from 'src/utils';
const isAccountInfoModalVisible = ref<boolean>(false);
const showAccountInfoDropdown = ref<boolean>(false);
const authStore = useAuthStore();
const $q = useQuasar();
const emit = defineEmits(['toggleLeftDrawer', 'showAccountInfoModal']);
const isLeftDrawerVisible = ref<boolean>(true);
const isViewProfile = ref<boolean>(false);
const handleCloseModal = (closeModal: boolean) => {
  isAccountInfoModalVisible.value = closeModal;
};
const toggleLeftDrawer = () => {
  isLeftDrawerVisible.value = !isLeftDrawerVisible.value;
  emit('toggleLeftDrawer', isLeftDrawerVisible.value);
};
const handleShowAccountInfoDropdown = () => {
  showAccountInfoDropdown.value = !showAccountInfoDropdown.value;
};
const handleViewProfile = (isView: boolean) => {
  isViewProfile.value = isView;
  isAccountInfoModalVisible.value = true;
  showAccountInfoDropdown.value = false;
};

async function handleLogout() {
  try {
    await logoutUser();
    showAccountInfoDropdown.value = false;
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
  authStore.logoutUser();
}
</script>
