<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <span class="text-3xl font-semibold">User Managment</span>
      <q-btn
        label="Add New"
        icon="add"
        unelevated
        color="primary"
        @click="handleAddNewAdminRole(true)"
      />
    </div>
    <div class="q-pa-md">
      <q-table
        tabindex="0"
        title="Users"
        :rows="UserRows"
        :column="UserColumn"
        :filter="filter"
        row-key="name"
      >
        <template v-slot:body-cell-action="props">
          <q-td class="!text-right" :props="props">
            <div class="flex gap-2 justify-end md:pr-4">
              <q-btn size="sm" flat unelevated icon="edit" />
              <q-btn size="sm" flat unelevated icon="delete" />
            </div>
          </q-td>
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="showAddNewAdminRolePopup">
      <q-card>
        <q-card-section>
          <div class="row justify-between items-center mb-2">
            <span class="text-2xl font-medium">Add new user</span>
            <span
              ><q-btn
                @click="handleAddNewAdminRole(false)"
                flat
                unelevated
                dense
                size="md"
                icon="close"
            /></span>
          </div>
          <div class="flex flex-col gap-2">
            <div class="row px-2 q-col-gutter-sm">
              <div class="col-md-4 w-full col-sm-12">
                <div>
                  <q-input
                    outlined
                    v-model="state.userName"
                    label="User Name"
                  />
                </div>
              </div>
              <div class="col-md-4 w-full col-sm-12">
                <q-input
                  outlined
                  v-model="state.phone"
                  type="tel"
                  mask="(####) #######"
                  label="Phone Number"
                />
              </div>
              <div class="col-md-4 w-full col-sm-12">
                <q-input
                  v-model="state.password"
                  outlined
                  :type="isPwd ? 'password' : 'text'"
                  label="Password"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="col-12">
              <q-checkbox
                v-model="state.isPhnNumberAsUserNumber"
                color="secondary"
                label="Phone number as username"
                size="30px"
                />
            </div>
            <div class="row px-2 q-col-gutter-sm">
              <div class="col-md-4 w-full col-sm-12">
                <div>
                  <q-select
                    :options="options.map((el) => el.role)"
                    outlined
                    v-model="state.role"
                    label="Role"
                  />
                </div>
              </div>
              <div class="col-md-4 w-full col-sm-12">
                <div>
                  <q-select
                    :options="options.map((el) => el.role)"
                    outlined
                    v-model="state.assignShop"
                    label="Assigned Shop"
                  />
                </div>
              </div>
              <div class="col-md-4 w-full col-sm-12">
                <div>
                  <q-input
                    outlined
                    v-model="state.outStandingBalance"
                    fill-mask="0"
                    reverse-fill-mask
                    input-class="text-right"
                    label="Outstanding Balance"
                  />
                </div>
              </div>
            </div>
            <div class="row px-2 q-col-gutter-sm">
              <div class="col-md-4 w-full col-sm-12">
                <div>
                  <q-select
                    :options="options.map((el) => el.role)"
                    outlined
                    v-model="state.customerGroup"
                    label="Customer Group"
                  />
                </div>
              </div>
              <div class="col-md-4 w-full col-sm-12">
                <div>
                  <q-input
                    outlined
                    v-model="state.wholeSaleDiscount"
                    fill-mask="0"
                    reverse-fill-mask
                    input-class="text-right"
                    label="Discount"
                  />
                </div>
              </div>
            </div>
            <div class="col-12">
              <q-checkbox
                v-model="state.isActive"
                color="secondary"
                label="Active"
                size="30px"
                />
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-end">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-btn flat label="Save" color="primary" v-close-popup @click="handleAddingNewAdminRole" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserColumn, UserRows } from './utils';
import  userManagement from '../../stores/userManagement'
const showAddNewAdminRolePopup = ref(false);
const userManagementStore = userManagement()
const newUser = userManagementStore.addingNewUser
const isPwd = ref(true);
const state = ref({
  userName: '',
  phone: '',
  role: '',
  assignShop: '',
  outStandingBalance: '',
  wholeSaleDiscount: '',
  isActive: true,
  password: '12345678',
  customerGroup: '',
  isPhnNumberAsUserNumber: false,
});
const options = ref([
  { id: 1, role: 'Super admin' },
  { id: 2, role: 'Admin' },
  { id: 3, role: 'Shopkeeper' },
  { id: 4, role: 'Master' },
  { id: 5, role: 'Master' },
]);
const handleAddNewAdminRole = (action: boolean) => {
  showAddNewAdminRolePopup.value = action;
};
const handleAddingNewAdminRole = ()=>{
    newUser.userName = state.value.userName
    newUser.phone = state.value.phone
    newUser.role = state.value.role
    newUser.assignShop = state.value.assignShop
    newUser.outStandingBalance = state.value.outStandingBalance
    newUser.wholeSaleDiscount = state.value.wholeSaleDiscount
    newUser.isActive = state.value.isActive
    newUser.password = state.value.password
    newUser.customerGroup = state.value.customerGroup
    newUser.isPhnNumberAsUserNumber = state.value.isPhnNumberAsUserNumber
}
const filter = ref('');
</script>
<style>
.q-table th.sortable:last-child {
  text-align: right !important;
}
</style>
