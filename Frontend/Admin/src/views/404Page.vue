<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-message">ไม่พบหน้าที่คุณต้องการ</h2>
      <p class="error-description">หน้าที่คุณกำลังค้นหาอาจถูกย้ายหรือลบออกไปแล้ว</p>
      <router-link to="/" class="home-button">
        กลับสู่หน้าหลัก
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: '404Page'
}
</script>

<style scoped>
.not-found {
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.not-found-content {
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
  line-height: 1;
}

.error-message {
  font-size: 2rem;
  color: #2c3e50;
  margin: 1rem 0;
}

.error-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.home-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.home-button:hover {
  background-color: #3aa876;
}
</style>
