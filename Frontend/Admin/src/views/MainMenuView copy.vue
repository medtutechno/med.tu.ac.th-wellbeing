<template>
  <div class="main-menu-container">
    <div class="menu-grid">
      <router-link to="/assessment" class="menu-item purple">
        <div class="icon-container">
          <i class="fas fa-brain"></i>
        </div>
        <div class="menu-text">
          แบบประเมินสุขภาพจิต
          <i class="fas fa-chevron-right arrow"></i>
        </div>
      </router-link>

      <router-link to="/blog" class="menu-item blue">
        <div class="icon-container">
          <i class="fas fa-book-reader"></i>
        </div>
        <div class="menu-text">
          บทความที่น่าสนใจสุขภาพจิต
          <i class="fas fa-chevron-right arrow"></i>
        </div>
      </router-link>

      <!-- <router-link to="/day-booking" class="menu-item pink">
        <div class="icon-container">
          <i class="fas fa-comments"></i>
        </div>
        <div class="menu-text">
          จองคิวรับคำปรึกษาจิตวิทยา
          <i class="fas fa-chevron-right arrow"></i>
        </div>
      </router-link> -->

      <router-link to="/contact" class="menu-item orange">
        <div class="icon-container">
          <i class="fas fa-phone-alt"></i>
        </div>
        <div class="menu-text">
          ข้อมูลติดต่อ
          <i class="fas fa-chevron-right arrow"></i>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainMenuView'
}
</script>

<style scoped>
.main-menu-container {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 240px); /* Adjust based on header/footer height */
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 600px; /* Slightly narrower for better readability */
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 15px;
  text-decoration: none;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 80px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Add some scaling animation on hover */
.menu-item:hover {
  transform: translateX(5px) translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.icon-container {
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  transition: transform 0.3s ease;
}

.menu-item:hover .icon-container {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.3);
}

.icon-container i {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.menu-text {
  flex: 1;
  font-size: 1.2rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 0.3px;
}

.arrow {
  font-size: 1rem;
  opacity: 0.8;
  transition: transform 0.3s ease;
}

.menu-item:hover .arrow {
  transform: translateX(3px);
  opacity: 1;
}

.purple {
  background: linear-gradient(135deg, #9333EA 0%, #7C3AED 100%);
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
}

.blue {
  background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.pink {
  background: linear-gradient(135deg, #F472B6 0%, #EC4899 100%);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.orange {
  background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

/* Responsive Design */
@media (max-width: 600px) {
  .main-menu-container {
    padding: 0.5rem;
  }

  .menu-item {
    padding: 0.75rem;
    min-height: 70px;
  }

  .icon-container {
    width: 40px;
    height: 40px;
  }

  .menu-text {
    font-size: 1rem;
  }
}
</style>
