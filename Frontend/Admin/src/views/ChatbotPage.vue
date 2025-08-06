<template>
  <div class="chatbot-page">
    <div class="container">
      <div class="row">
        <div class="col-sm-8 offset-sm-2">
          <div class="section-title text-center" data-aos="fade-up">
            <h1>หน่วยงาน&แชทบอทดูแลใจ</h1>
            <p>ค้นหาความช่วยเหลือและคำแนะนำจากผู้เชี่ยวชาญด้านสุขภาพจิต</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <ChatbotSection />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatbotSection from '@/components/ChatbotSectionNoHead.vue'

export default {
  name: 'ChatbotPage',
  components: {
    ChatbotSection
  }
}
</script>

<style scoped>
.chatbot-page {
  padding: 120px 0 60px;
}

.section-title {
  margin-bottom: 40px;
}

.section-title h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.section-title p {
  color: #666;
  font-size: 1.1rem;
}
</style>
