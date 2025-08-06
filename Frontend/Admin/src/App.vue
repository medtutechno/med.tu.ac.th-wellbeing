<template>
  <div id="app">
    <AppHeader />
    <main class="main-content" >
      <Preloader />
      <MobileNavMenu :is-open="isMobileMenuOpen" @close="closeMobileMenu" />
      <router-view/>
    </main>
    <AppFooter />
    <LineButton />
  </div>
</template>

<script>
import AppHeader from '@/components/Header.vue'
import AppFooter from '@/components/Footer.vue'
import MobileNavMenu from './components/MobileMenu.vue'
import Preloader from './components/Preloader.vue'
import LineButton from '@/components/LineButton.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    MobileNavMenu,
    Preloader,
    LineButton
  },
  data() {
    return {
      isMobileMenuOpen: false
    }
  },
  methods: {
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    createFloatingIcons() {
      const icons = [
        'fa-brain',
        'fa-heart',
        'fa-smile',
        'fa-sun',
        'fa-cloud',
        'fa-star',
        'fa-comments',
        'fa-hand-holding-heart'
      ];
      
      const colors = [
        'rgba(147, 51, 234, 0.25)',  // Purple
        'rgba(59, 130, 246, 0.25)',   // Blue
        'rgba(236, 72, 153, 0.25)',   // Pink
        'rgba(245, 158, 11, 0.25)'    // Orange
      ];

      for (let i = 0; i < 20; i++) {
        const icon = document.createElement('i');
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        icon.className = `fas ${randomIcon} floating-icon`;
        icon.style.setProperty('--duration', 15 + Math.random() * 20 + 's');
        icon.style.setProperty('--start-x', Math.random() * 100 + 'vw');
        icon.style.setProperty('--end-x', (Math.random() - 0.5) * 50 + 'vw');
        icon.style.setProperty('--rotation', Math.random() * 720 - 360 + 'deg');
        icon.style.left = Math.random() * 100 + 'vw';
        icon.style.color = randomColor;
        
        this.$el.appendChild(icon);
      }
    }
  },
  mounted() {
    this.createFloatingIcons();
  }
}
</script>

<style>
#app {
  font-family: 'Kanit', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
  overflow: hidden;
  
}

.main-content {
  padding: 1rem;
  padding-bottom: 70px; /* Match footer height */
  max-width: 1200px;
  margin: 0 auto;
}

.floating-icon {
  position: absolute;
  font-size: 2.5rem;
  animation: float-up var(--duration) infinite linear;
  z-index: 0;
  pointer-events: none;
}

@keyframes float-up {
  0% {
    transform: translate(var(--start-x), 110vh) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.2;
  }
  80% {
    opacity: 0.2;
  }
  100% {
    transform: translate(var(--end-x), -10vh) rotate(var(--rotation));
    opacity: 0;
  }
}

/* Reset default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Add Kanit font */
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap');

/* Add Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
</style>
