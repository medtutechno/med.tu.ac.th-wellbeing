<template>
  <footer class="app-footer">
    <nav class="footer-menu">
      <router-link to="/" class="menu-item">
        <i class="fas fa-home"></i>
        <span>หน้าแรก</span>
      </router-link>
      
      <!-- <router-link to="/day-booking" class="menu-item">
        <i class="fas fa-calendar"></i>
        <span>ตารางนัด</span>
      </router-link>
       -->
      <router-link to="/assessment" class="menu-item">
        <i class="fas fa-clipboard-list"></i>
        <span>แบบประเมิน</span>
      </router-link>
      
      <router-link to="/blog" class="menu-item">
        <i class="fas fa-book"></i>
        <span>บทความ</span>
      </router-link>
      
      <router-link to="/contact" class="menu-item">
        <i class="fas fa-phone"></i>
        <span>ติดต่อเรา</span>
      </router-link>
    </nav>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  padding: 0.5rem;
  z-index: 999 ;
}

.footer-menu {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  padding: 0.5rem;
  transition: color 0.2s;
}

.menu-item.router-link-active {
  color: #10B981;
}

.menu-item i {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.menu-item span {
  font-size: 0.75rem;
}

/* Add padding to main content to prevent footer overlap */
:root {
  --footer-height: 70px;
}

main {
  padding-bottom: var(--footer-height);
}
</style>
