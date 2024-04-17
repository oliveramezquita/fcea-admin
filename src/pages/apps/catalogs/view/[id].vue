<script setup>
import { useApi } from '@/composables/useApi';
import DataTableArrayType from '@/views/apps/catalogs/view/DataTableArrayType.vue';
import DataTableObjectType from '@/views/apps/catalogs/view/DataTableObjectType.vue';
import { computed } from 'vue';

const route = useRoute('apps-projects-view-id')
const { data: catalogData } = await useApi(createUrl(`api/catalog/${ route.params.id }`))
const catalog = computed(() => catalogData.value)
</script>
<template>
  <div>
    <VRow>
      <VCol
        cols="12"
      >
        <!-- 👉 Order Details -->
        <VCard class="mb-6">
          <VCardItem>
            <template #title>
              <h5 class="text-h5">
                Catálogo: {{ catalog.name }}
              </h5>
            </template>
          </VCardItem>

          <VDivider />
          <DataTableObjectType :catalog-id="catalog._id" v-if="catalog.type === 'object'" />
          <DataTableArrayType :catalog-id="catalog._id" v-if="catalog.type === 'array'" />
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
