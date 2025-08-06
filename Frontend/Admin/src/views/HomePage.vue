<template>
  <div class="home-page">
    <HeroSection />
    <SelfCareSection />
    <MentalHealthKnowledge />
    <ChatbotSection />
  </div>
</template>

<script>
import HeroSection from '@/components/Hero.vue'
import SelfCareSection from '@/components/SelfCareSection.vue'
import MentalHealthKnowledge from '@/components/MentalHealthKnowledge.vue'
import ChatbotSection from '@/components/ChatbotSection.vue'

export default {
  name: 'HomePage',
  components: {
    HeroSection,
    SelfCareSection,
    MentalHealthKnowledge,
    ChatbotSection
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}
</style>
