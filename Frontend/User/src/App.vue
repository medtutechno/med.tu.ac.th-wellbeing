<template>
  <div class="app-wrapper">
    <Sidebar v-if="!isLoginPage" v-model="isSidebarCollapsed" />
    <div class="main-content" :class="{ 'full-width': isLoginPage, 'sidebar-collapsed': isSidebarCollapsed }">
      <Navbar v-if="!isLoginPage" @toggle-sidebar="toggleSidebar" />
      <div class="content-area" :class="{ 'no-padding': isLoginPage }">
        <router-view></router-view>
      </div>
    </div>
    <LoadingOverlay />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Sidebar,
    LoadingOverlay
  },
  setup() {
    const route = useRoute()
    const isSidebarCollapsed = ref(false)

    const isLoginPage = computed(() => {
      return route.path === '/login'
    })

    const toggleSidebar = () => {
      isSidebarCollapsed.value = !isSidebarCollapsed.value
    }

    return {
      isLoginPage,
      isSidebarCollapsed,
      toggleSidebar
    }
  }
}
</script>

<style>
/* Base Styles */
:root {
  --primary-color: #2c3e50;
  --secondary-color: #34495e;
  --accent-color: #3498db;
  --danger-color: #e74c3c;
  --success-color: #2ecc71;
  --warning-color: #f1c40f;
  --text-dark: #2c3e50;
  --text-light: #95a5a6;
  --light-hover: #f8f9fa;
  --danger-light: #fee2e2;
  --transition-default: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Kanit', sans-serif;
  background: #f8f9fa;
  color: var(--text-dark);
  line-height: 1.6;
}

.app-wrapper {
  display: flex;
  min-height: 100vh;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  min-height: 100vh;
  transition: all 0.3s ease;
}

@media (min-width: 992px) {
  .main-content {
    margin-left: 260px;
  }

  .main-content.sidebar-collapsed {
    margin-left: 70px;
  }

  .main-content.full-width {
    margin-left: 0;
  }
}

.content-area {
  padding: 80px 2rem 2rem;
  min-height: 100vh;
}

.content-area.no-padding {
  padding: 0;
}

/* เพิ่ม style สำหรับหน้า login */
.full-width .content-area {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}

@media (max-width: 768px) {
  .content-area {
    padding: 80px 1rem 1rem;
  }
}

/* Utility Classes */
.d-flex {
  display: flex !important;
}

.align-items-center {
  align-items: center !important;
}

.justify-content-between {
  justify-content: space-between !important;
}

.gap-3 {
  gap: 1rem !important;
}

.ms-3 {
  margin-left: 1rem !important;
}

.me-2 {
  margin-right: 0.5rem !important;
}

.px-3 {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

@media (min-width: 576px) {
  .d-sm-block {
    display: block !important;
  }
  .d-sm-inline {
    display: inline !important;
  }
}

@media (min-width: 992px) {
  .d-lg-none {
    display: none !important;
  }
  .d-lg-block {
    display: block !important;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
