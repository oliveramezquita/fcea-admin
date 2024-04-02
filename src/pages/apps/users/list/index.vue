<script setup>
import AddNewUserDrawer from '@/views/apps/users/list/AddNewUserDrawer.vue';

// 👉 Store
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const isUserInfoEditDialogVisible = ref(false)
const isUserDeleteDialogVisible = ref(false)
const isUserEditable = ref()

const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Headers
const headers = [
  {
    title: 'Nombre',
    key: 'user',
  },
  {
    title: 'Cargo',
    key: 'role',
  },
  {
    title: 'Institución',
    key: 'institution',
  },
  {
    title: 'Estatus',
    key: 'status',
  },
  {
    title: 'Acciones',
    key: 'actions',
    sortable: false,
  },
]

const {
  data: usersData,
  execute: fetchUsers,
} = await useApi(createUrl('api/users'))

const users = computed(() => usersData.value.data)
const totalUsers = computed(() => usersData.value.total_elements)

// 👉 search filters
const roles = [
  {
    title: 'Administrador',
    value: 'ADMIN',
  },
  {
    title: 'Brigadista',
    value: 'BRIGADIER',
  },
]

const plans = [
  {
    title: 'Basic',
    value: 'basic',
  },
  {
    title: 'Company',
    value: 'company',
  },
  {
    title: 'Enterprise',
    value: 'enterprise',
  },
  {
    title: 'Team',
    value: 'team',
  },
]

const status = [
  {
    title: 'Desactivo',
    value: false,
  },
  {
    title: 'Activo',
    value: true,
  },
]

const resolveUserNameVariant = (name, last_name, email) => {
  if (!name && !last_name)
    return email
  return `${name} ${last_name}`
}

const resolveEmailVariant = (name, last_name, email) => {
  if (!name && !last_name)
    return null
  return email
}

const resolveUserRoleVariant = role => {
  const roleLowerCase = role.toLowerCase()
  if (roleLowerCase === 'admin')
    return {
      name: 'Administrador',
      color: 'primary',
      icon: 'tabler-crown',
    }
  
  return {
    name: 'Brigadista',
    color: 'info',
    icon: 'tabler-user',
  }
}

const resolveUserStatusVariant = stat => {
  if (stat)
    return {
      name: 'Activo',
      color: 'success'
    }
  
  return {
    name: 'Desactivo',
    color: 'secondary'
  }
}

const isAddNewUserDrawerVisible = ref(false)

const addNewUser = async userData => {
  await $api('api/users', {
    method: 'POST',
    body: userData,
  })

  // refetch User
  fetchUsers()
}

const userDetail = ref()

const showUserEditor = async (user, editable) => {
  userDetail.value = user
  isUserEditable.value = editable
  isUserInfoEditDialogVisible.value = true
}

const editUser = async userData => {
  await $api(`api/user/${userData._id}`, {
    method: 'PATCH',
    body: userData,
  })

  // refetch User
  fetchUsers()
}

const showDeleteUserConfirmation = async user => {
  userDetail.value = user
  isUserDeleteDialogVisible.value = true
}

const deleteUser = async id => {
  await $api(`api/user/${ id }`, { method: 'DELETE' })

  // refetch User
  fetchUsers()
}
</script>

<template>
  <section>
    <VCard class="mb-6">
      <VCardItem class="pb-4">
        <VCardTitle>Filtros</VCardTitle>
      </VCardItem>

      <VCardText>
        <VRow>
          <!-- 👉 Select Role -->
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedRole"
              placeholder="Seleccionar cargo"
              :items="roles"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
          <!-- 👉 Select Plan -->
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedPlan"
              placeholder="Seleccionar institución"
              :items="plans"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
          <!-- 👉 Select Status -->
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedStatus"
              placeholder="Seleccionar estatus"
              :items="status"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: -1, title: 'All' },
            ]"
            style="inline-size: 6.25rem;"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          />
        </div>
        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div style="inline-size: 15.625rem;">
            <AppTextField
              v-model="searchQuery"
              placeholder="Buscar usuario"
            />
          </div>

          <!-- 👉 Add user button -->
          <VBtn
            prepend-icon="tabler-plus"
            @click="isAddNewUserDrawerVisible = true"
          >
            Agregar usuario
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="users"
        :items-length="totalUsers"
        :headers="headers"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- User -->
        <template #item.user="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar
              size="34"
              :variant="!item.avatar ? 'tonal' : undefined"
              :color="!item.avatar ? resolveUserRoleVariant(item.role).color : undefined"
            >
              <VImg
                v-if="item.avatar"
                :src="item.avatar"
              />
              <span v-else>{{ avatarText(item.short_name) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-base">
                <RouterLink
                  :to="{ name: 'apps-users-view-id', params: { id: item._id } }"
                  class="font-weight-medium text-link"
                >
                  {{ resolveUserNameVariant(item.name, item.last_name, item.email) }}
                </RouterLink>
              </h6>
              <div class="text-sm">
                {{ resolveEmailVariant(item.name, item.last_name, item.email) }}
              </div>
            </div>
          </div>
        </template>

        <!-- 👉 Role -->
        <template #item.role="{ item }">
          <div class="d-flex align-center gap-x-2">
            <VIcon
              :size="22"
              :icon="resolveUserRoleVariant(item.role).icon"
              :color="resolveUserRoleVariant(item.role).color"
            />

            <div class="text-capitalize text-high-emphasis text-body-1">
              {{ resolveUserRoleVariant(item.role).name }}
            </div>
          </div>
        </template>

        <!-- Plan -->
        <template #item.institution="{ item }">
          <div class="text-body-1 text-high-emphasis">
            {{ item.institution }}
          </div>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip
            :color="resolveUserStatusVariant(item.activated).color"
            size="small"
            label
            class="text-capitalize"
          >
            {{ resolveUserStatusVariant(item.activated).name }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn @click="showUserEditor(item, false)"> 
            <VIcon icon="tabler-eye" />
          </IconBtn>

          <IconBtn @click="showUserEditor(item, true)">
            <VIcon icon="tabler-pencil" />
          </IconBtn>

          <IconBtn @click="showDeleteUserConfirmation(item)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalUsers"
          />
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>
    <!-- 👉 Add New User -->
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      @user-data="addNewUser"
    />
    <UserInfoEditDialog
      v-model:isDialogVisible="isUserInfoEditDialogVisible"
      v-model:isUserEditable="isUserEditable"
      v-model:userDetail="userDetail"
      @user-data="editUser"
    />
    <DeleteUserDialog
      v-model:isDialogVisible="isUserDeleteDialogVisible"
      v-model:userDetail="userDetail"
      @user-data="deleteUser"
    />
    
  </section>
</template>
