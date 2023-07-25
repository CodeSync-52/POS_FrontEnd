<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <span class="text-3xl font-semibold">User Management</span>
      <q-btn
        label="Add New"
        icon="add"
        class="rounded-lg"
        unelevated
        color="primary"
        @click="showAddUserModal(true)"
      />
    </div>
    <div class="row flex justify-end items-center w-full h-[3.5rem] gap-8">
      <q-select
        style="min-width: 200px"
        outlined
        v-model="filterSearch.customerGroup.label"
        :options="customerGroup"
        label="Customer Group"
        @update:model-value="
          (e) => {
            handleChange(e, 'customerGroup');
          }
        "
      />
      <q-select
        style="min-width: 200px"
        outlined
        v-model="filterSearch.role.label"
        :options="role"
        label="Role"
        @update:model-value="
          (e) => {
            handleChange(e, 'role');
          }
        "
      />
      <q-select
        style="min-width: 200px"
        outlined
        v-model="filterSearch.status.label"
        :options="status"
        label="Status"
        @update:model-value="
          (e) => {
            handleChange(e, 'status');
          }
        "
      />
      <div class="flex justify-end items-end h-full gap-4">
        <q-btn
          color="primary"
          class="rounded-lg h-2"
          icon="search"
          label="Search"
          @click="
            () => {
              console.log(filterSearch);
            }
          "
        />
        <q-btn
          color="red"
          class="rounded-lg h-2"
          label="Clear"
          @click="resetFilter"
        />
        <q-btn color="green" class="rounded-lg h-2" label="Export as CSV" />
      </div>
    </div>
    <div class="q-pa-md">
      <q-table
        tabindex="0"
        :rows="UserRows"
        :column="UserColumn"
        :visible-columns="[
          'fullName',
          'userName',
          'phone',
          'role',
          'assignShop',
          'customerGroup',
          'discount',
          'outStandingBalance',
          'action',
        ]"
        row-key="name"
      >
        <template v-slot:body-cell-action="props">
          <q-td class="" :props="props">
            <div class="flex">
              <q-btn
                size="sm"
                flat
                unelevated
                icon="edit"
                @click="onEditButtonClick(props.row)"
              />
              <q-btn size="sm" flat unelevated icon="delete" />
            </div>
          </q-td>
        </template>
        <!-- <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template> -->
      </q-table>
    </div>
    <q-dialog v-model="showAddNewAdminRolePopup">
      <q-card>
        <q-card-section>
          <div class="row justify-between items-center mb-2">
            <span class="text-2xl font-medium">Add new user</span>
            <span
              ><q-btn
                @click="showAddUserModal(false)"
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
                    v-model="state.fullName"
                    label="Full Name"
                    @update:model-value="
                      (e) => {
                        handleAddNewUserFun(e, 'fullName');
                      }
                    "
                  />
                </div>
              </div>
              <div class="col-md-4 w-full col-sm-12">
                <div>
                  <q-input
                    outlined
                    v-model="state.userName"
                    label="User Name"
                    @update:model-value="
                      (e) => {
                        handleAddNewUserFun(e, 'userName');
                      }
                    "
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
                  @update:model-value="
                    (e) => {
                      handleAddNewUserFun(e, 'phone');
                    }
                  "
                />
              </div>
            </div>
            <div class="row px-2 q-col-gutter-sm">
              <div class="col-md-6 w-full col-sm-12">
                <div>
                  <q-select
                    :options="role"
                    outlined
                    v-model="state.role"
                    label="Role"
                    @update:model-value="
                      (e) => {
                        handleAddNewUserFun(e, 'role');
                      }
                    "
                  />
                </div>
              </div>
              <div
                v-if="
                  state.role?.value === 'shop_sale_officer' ||
                  state.role?.value === 'shop_manager'
                "
                class="col-md-6 w-full col-sm-12"
              >
                <div>
                  <q-select
                    :options="role"
                    outlined
                    @update:model-value="
                      (e) => {
                        handleAddNewUserFun(e, 'assignShop');
                      }
                    "
                    v-model="state.assignShop"
                    label="Assigned Shop"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="state.role?.value === 'customer_vendor'"
              class="row px-2 q-col-gutter-sm"
            >
              <div class="col-md-4 w-full col-sm-12">
                <div>
                  <q-select
                    :options="role"
                    outlined
                    v-model="state.customerGroup"
                    label="Customer Group"
                    @update:model-value="
                      (e) => {
                        handleAddNewUserFun(e, 'customerGroup');
                      }
                    "
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
                    @update:model-value="
                      (e) => {
                        handleAddNewUserFun(e, 'wholeSaleDiscount');
                      }
                    "
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
                @update:model-value="
                  (e) => {
                    handleAddNewUserFun(e, 'isActive');
                  }
                "
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-end">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-btn
            flat
            label="Save"
            color="primary"
            v-close-popup
            @click="handleAddNewUser"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserColumn, UserRows } from './utils';
import {
  addUserStateManagement,
  customerGroup,
  role,
  status,
  userManagementFilter,
} from '../../constants/utils';
import userManagement from '../../stores/userManagement';
import { IuserManagementTableRow } from '../../interfaces/users/userManagment';
import { userManagementSearchFilter } from 'src/interfaces/general';
const showAddNewAdminRolePopup = ref(false);
const userManagementStore = userManagement();
const newUser = userManagementStore.addingNewUser;
let filterSearch = ref(JSON.parse(JSON.stringify(userManagementFilter)));
const state = ref(JSON.parse(JSON.stringify(addUserStateManagement)));
const onEditButtonClick = (row: IuserManagementTableRow) => {
  state.value = {
    ...row,
    phone: row.phone ? row.phone.toString() : '',
  };
  showAddUserModal(true);
};

function handleChange(e: any, name: keyof userManagementSearchFilter) {
  filterSearch.value[name] = e;
}
function handleAddNewUserFun(e: any, name: keyof IuserManagementTableRow) {
  state.value[name] = e;
}

const showAddUserModal = (action: boolean) => {
  showAddNewAdminRolePopup.value = action;
};

const handleAddNewUser = () => {
  newUser.userName = state.value.userName;
  newUser.phone = state.value.phone;
  newUser.role = state.value.role;
  newUser.assignShop = state.value.assignShop;
  newUser.outStandingBalance = state.value.outStandingBalance;
  newUser.wholeSaleDiscount = state.value.wholeSaleDiscount;
  newUser.isActive = state.value.isActive;
  newUser.password = state.value.password;
  newUser.customerGroup = state.value.customerGroup;
  newUser.isPhnNumberAsUserNumber = state.value.isPhnNumberAsUserNumber;
};
const resetFilter = () => {
  filterSearch.value = userManagementFilter;
};
</script>
