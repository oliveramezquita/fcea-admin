<script setup>
import AccountSettingsAccount from '@/views/apps/users/view/AccountSettingsAccount.vue';
import AccountSettingsSecurity from '@/views/apps/users/view/AccountSettingsSecurity.vue';

const route = useRoute('pages-account-settings-tab')
const userData = useCookie('userData')
const { data: user } = await useApi(`api/user/${ userData.value._id }`)
const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})

// tabs
const tabs = [
  {
    title: 'Perfil',
    icon: 'tabler-user',
    tab: 'account',
  },
  {
    title: 'Seguridad',
    icon: 'tabler-lock-cog',
    tab: 'security',
  },
]

definePage({ meta: { navActiveLink: 'apps-users-view-tab' } })
</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      class="v-tabs-pill"
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        :to="{ name: 'apps-users-view-tab', params: { tab: item.tab } }"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-6 disable-tab-transition"
      :touch="false"
    >
      <!-- Account -->
      <VWindowItem value="account">
        <AccountSettingsAccount :user-data="user" />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <AccountSettingsSecurity :user-data="user" />
      </VWindowItem>
    </VWindow>
  </div>
</template>
