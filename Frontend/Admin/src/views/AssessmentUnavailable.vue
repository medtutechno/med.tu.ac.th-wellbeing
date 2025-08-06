<template>
  <div class="unavailable-page">
    <div class="container">
      <div class="message-box">
        <h2>ขออภัย คุณยังไม่สามารถทำแบบประเมินได้ในขณะนี้</h2>
        <p>กรุณารอให้ครบ {{ daysLeft }} วัน ก่อนทำแบบประเมินอีกครั้ง</p>
        <p>คุณจะสามารถทำแบบประเมินได้อีกครั้งในวันที่: {{ formattedNextDate }}</p>
        <router-link to="/" class="back-home-btn">กลับสู่หน้าหลัก</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssessmentUnavailable',
  computed: {
    daysLeft() {
      return this.$route.query.daysLeft || 0
    },
    formattedNextDate() {
      const nextDate = this.$route.query.nextDate
      if (!nextDate) return ''
      
      return new Date(nextDate).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.unavailable-page {
  min-height: 60vh;
  padding: 4rem 0;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.message-box {
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.message-box h2 {
  color: #dc3545;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.message-box p {
  color: #666;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.back-home-btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  background-color: #28bf7e;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  background-color: #229e69;
  transform: translateY(-2px);
}
</style>
