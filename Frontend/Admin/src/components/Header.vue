<template>
  <header class="app-header">
    <div class="logo">
      <img src="@/assets/medtu-logo.png" alt="Logo" class="logo-img">
      <!-- <img src="@/assets/logo.png" alt="Logo" class="logo-img"> -->
    </div>
    <nav class="menu-grid d-none">
      <router-link to="/mental-health" class="menu-item mental-health">
        <div class="icon-wrapper purple">
          <i class="fas fa-heart"></i>
        </div>
        <span>ตรวจสอบสุขภาพจิต</span>
      </router-link>
      
      <router-link to="/articles" class="menu-item articles">
        <div class="icon-wrapper blue">
          <i class="fas fa-book-open"></i>
        </div>
        <span>บทความที่น่าสนใจ</span>
      </router-link>
      
      <router-link to="/booking" class="menu-item booking">
        <div class="icon-wrapper pink">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <span>นัดหมายเพื่อรับคำปรึกษา</span>
      </router-link>
      
      <router-link to="/contact" class="menu-item contact">
        <div class="icon-wrapper orange">
          <i class="fas fa-phone"></i>
        </div>
        <span>ติดต่อเรา</span>
      </router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
/* .app-header {
  padding: 1rem;
  background-color: #10B981;
} */

.app-header {
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.logo {
  text-align: left;
  margin-bottom: 0rem;
}

.logo-img {
  height: 50px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.menu-item:hover {
  transform: translateY(-2px);
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.icon-wrapper i {
  color: #ffffff;
  font-size: 1.2rem;
}

.purple {
  background-color: #8B5CF6;
}

.blue {
  background-color: #3B82F6;
}

.pink {
  background-color: #EC4899;
}

.orange {
  background-color: #F59E0B;
}

.menu-item span {
  font-size: 1rem;
  font-weight: 500;
}

@media (max-width: 991px) {
  .main-menu {
    display: none;
  }
}
</style>
