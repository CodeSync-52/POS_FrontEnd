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
        />
        <q-toolbar-title>Point of Sale</q-toolbar-title>
        <div ref="dropdownRef" class="accountInfoIcon relative">
          <q-icon
            name="account_circle"
            size="lg"
            class="cursor-pointer"
            @click="handleShowAccountInfoDropdown"
          />
          <div ref="dropdownContainerRef">
            <q-card
              v-if="showAccountInfoDropdown"
              class="absolute right-[1rem] z-10 top-[100%] rounded-md"
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
                      ><q-icon name="lock" size="xs" color="signature" />
                      <span class="text-signature"
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
        </div>
      </q-toolbar>
    </q-header>
  </div>
  <q-dialog v-model="isAccountInfoModalVisible">
    <account-info-modal :isViewProfile="isViewProfile" />
  </q-dialog>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useAuthStore } from 'src/stores';
import AccountInfoModal from '../../components/header/AccountInfoModal.vue';
const isAccountInfoModalVisible = ref<boolean>(false);
const showAccountInfoDropdown = ref<boolean>(false);
const authStore = useAuthStore();
const emit = defineEmits(['toggleLeftDrawer', 'showAccountInfoModal']);
const isLeftDrawerVisible = ref<boolean>(true);
const isViewProfile = ref<boolean>(false);
const dropdownContainerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const toggleLeftDrawer = () => {
  isLeftDrawerVisible.value = !isLeftDrawerVisible.value;
  emit('toggleLeftDrawer', isLeftDrawerVisible.value);
};
const handleClickOutside = (event: Event) => {
  if (
    dropdownRef.value &&
    dropdownContainerRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    showAccountInfoDropdown.value = false;
  }
};
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
const handleShowAccountInfoDropdown = () => {
  showAccountInfoDropdown.value = !showAccountInfoDropdown.value;
};
const handleViewProfile = (isView: boolean) => {
  isViewProfile.value = isView;
  isAccountInfoModalVisible.value = true;
  showAccountInfoDropdown.value = false;
};
const handleLogout = () => {
  showAccountInfoDropdown.value = false;
  authStore.logoutUser();
};
</script>
