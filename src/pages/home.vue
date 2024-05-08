<script setup>
import fceaLogoWhite from '@images/fcea_logo_white.png';
import homeWater from '@images/illustrations/home_water.png';
definePage({
  meta: {
    action: 'read',
    subject: ['admin', 'brigadier'],
  },
})

const faqSearchQuery = ref('')
const faqs = ref([])

const fetchFaqs = async () => {
  const data = await $api('api/faqs').catch(err => console.log(err))

  faqs.value = data.faqs
}

const activeTab = ref('Monitoreo Comunitario del Agua')
const activeQuestion = ref(0)

watch(activeTab, () => activeQuestion.value = 0)
watch(faqSearchQuery, fetchFaqs, { immediate: true })

const userData = useCookie('userData')

const contactUs = [
  {
    icon: 'tabler-world-www',
    url: 'https://fcea.org.mx/contact/',
    via: 'fcea.org.mx/contact',
    tagLine: '¡Siempre estaremos felices de ayudar!',
  },
  {
    icon: 'tabler-mail',
    url: 'mailto:info@fcea.org.mx',
    via: 'info@fcea.org.mx',
    tagLine: '¡La mejor manera de obtener una respuesta más rápido!',
  },
]
</script>

<template>
  <section>
    <VCard class="mb-6" color="primary">
      <VCardText class="py-12 position-relative">
        <div
          class="d-flex flex-column gap-y-4 mx-auto"
          :class="$vuetify.display.mdAndUp ? 'w-50' : $vuetify.display.xs ? 'w-100' : 'w-75'"
        >
          <img :src="fceaLogoWhite" alt="Fondo para la Comunicación y la Educación Ambiental, A.C." width="250" class="mx-auto">
          <h4
            class="text-h4 text-center text-primary-darken-1 text-wrap mx-auto">
            Bienvenida, bienvenido al<br><span class="text-white">Administrador de la plataforma para el Monitoreo Comunitario del Agua</span>
          </h4>
          <p class="text-center text-wrap text-primary-darken-1 text-body-1 mx-auto mb-0" v-if="userData.role === 'BRIGADIER'">
            En esta página puedes acceder a los formatos de campo digitales para capturar los resultados del monitoreo comunitario del agua en tu cuenca.
          </p>
          <p class="text-center text-wrap text-primary-darken-1 text-body-1 mx-auto mb-0" v-if="userData.role !== 'BRIGADIER'">
            En esta página puedes organizar los monitoreos en tu cuenca; determinar los sitios de referencia y de evaluación, asignar a las personas responsables de la captura de los datos y vincular los formatos de campo digitales.  
          </p>
        </div>
      </VCardText>
    </VCard>
    <!-- 👉 Faq sections and questions -->
    <VRow>
      <VCol
        v-show="faqs.length"
        cols="12"
        sm="4"
        lg="3"
        class="position-relative"
      >
        <!-- 👉 Tabs -->
        <VTabs
          v-model="activeTab"
          direction="vertical"
          class="v-tabs-pill"
          grow
        >
          <VTab
            v-for="faq in faqs"
            :key="faq.faqTitle"
            :value="faq.faqTitle"
          >
            <VIcon
              :icon="faq.faqIcon"
              :size="20"
              start
            />
            {{ faq.faqTitle }}
          </VTab>
        </VTabs>
        <VImg
          :width="245"
          :src="homeWater"
          class="d-none d-sm-block mt-4 mx-auto"
        />
      </VCol>

      <VCol
        cols="12"
        sm="8"
        lg="9"
      >
        <!-- 👉 Windows -->
        <VWindow
          v-model="activeTab"
          class="faq-v-window disable-tab-transition"
        >
          <VWindowItem
            v-for="faq in faqs"
            :key="faq.faqTitle"
            :value="faq.faqTitle"
          >
            <div class="d-flex align-center mb-4">
              <VAvatar
                rounded
                color="primary"
                variant="tonal"
                class="me-4"
                size="50"
              >
                <VIcon
                  :size="30"
                  :icon="faq.faqIcon"
                />
              </VAvatar>

              <div>
                <h5 class="text-h5">
                  {{ faq.faqTitle }}
                </h5>
                <div class="text-body-1">
                  {{ faq.faqSubtitle }}
                </div>
              </div>
            </div>

            <VExpansionPanels
              v-model="activeQuestion"
              multiple
            >
              <VExpansionPanel
                v-for="item in faq.faqs"
                :key="item.question">
                <VExpansionPanelTitle>{{ item.question }}</VExpansionPanelTitle>
                <VExpansionPanelText>
                  <p v-for="answer in item.answer" v-html="answer"></p>
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VWindowItem>
        </VWindow>
      </VCol>

      <VCol
        v-show="!faqs.length"
        cols="12"
        :class="!faqs.length ? 'd-flex justify-center align-center' : ''"
      >
        <VIcon
          icon="tabler-help"
          start
          size="20"
        />
        <span class="text-base font-weight-medium">
          No Results Found!!
        </span>
      </VCol>
    </VRow>

    <!-- 👉 You still have a question? -->
    <div class="text-center pt-16">
      <h4 class="text-h4 mb-2">
        ¿Aún tienes alguna otra pregunta?
      </h4>
      <p class="text-body-1 mb-6">
        Si tienes alguna otra duda y no se encuentra en está sección puedes contactarnos. ¡Te responderemos en breve!
      </p>

      <!-- contacts -->
      <VRow class="mt-9">
        <VCol
          v-for="contact in contactUs"
          :key="contact.icon"
          sm="6"
          cols="12"
        >
          <VCard
            flat
            style="background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));"
          >
            <VCardText class="pb-4">
              <VAvatar
                rounded
                color="primary"
                variant="tonal"
                size="46"
              >
                <VIcon
                  :icon="contact.icon"
                  size="26"
                />
              </VAvatar>
            </VCardText>
            <VCardText>
              <h5 class="text-h5 mb-1">
                <a :href="contact.url" target="_blank">{{ contact.via }}</a>
              </h5>
              <div>{{ contact.tagLine }}</div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </section>
</template>

<style lang="scss">
.faq-v-window {
  .v-window__container {
    z-index: 0;
  }
}
</style>
