<script setup>
import { useApi } from '@/composables/useApi';
import DataTableObjectType from '@/views/apps/catalogs/view/DataTableObjectType.vue';
import DataTableArrayType from '@/views/apps/catalogs/view/DataTableArrayType.vue';
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
              <div class="d-flex justify-center align-center gap-4 flex-wrap">
                <div
                  class="flex-grow-1"
                  style="max-inline-size: 350px;"
                >
                  <AppTextField
                    v-model="searchQuery"
                    placeholder="Find your course"
                  />
                </div>
                <VBtn
                  color="primary"
                  density="comfortable"
                  icon="tabler-search"
                  class="rounded"
                />
              </div>
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
