<script setup>
import AccountSettingsAccount from '@/views/apps/users/view/AccountSettingsAccount.vue';
import AccountSettingsSecurity from '@/views/apps/users/view/AccountSettingsSecurity.vue';

const route = useRoute('pages-account-settings-tab')

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})

// tabs
const tabs = [
  {
    title: 'Perfil',
    icon: 'tabler-users',
    tab: 'account',
  },
  {
    title: 'Seguridad',
    icon: 'tabler-lock',
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
        <AccountSettingsAccount />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>
    </VWindow>
  </div>
</template>
