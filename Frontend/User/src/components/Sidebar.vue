<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed, 'mobile-open': isMobileOpen }">
    <div class="sidebar-header">
      <div class="logo-container">
        <i class="fas fa-clinic-medical"></i>
        <span v-show="!isCollapsed">TU MED Admin</span>
      </div>
      <button class="collapse-btn d-none d-lg-block" @click="toggleSidebar">
        <i :class="['fas', isCollapsed ? 'fa-angle-right' : 'fa-angle-left']"></i>
      </button>
    </div>

    <div class="sidebar-content">
      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item" active-class="active">
          <i class="fas fa-home"></i>
          <span v-show="!isCollapsed">หน้าหลัก</span>
        </router-link>

        <router-link to="/BlogCategory" class="nav-item" active-class="active">
          <i class="fas fa-tags"></i>
          <span v-show="!isCollapsed">หมวดหมู่บทความ</span>
        </router-link>

        <router-link to="/Blog" class="nav-item" active-class="active">
          <i class="fas fa-newspaper"></i>
          <span v-show="!isCollapsed">จัดการบทความ</span>
        </router-link>

        <div class="nav-group d-none d-lg-none">
          <button class="nav-item" :class="{ 'active': isMediaActive }" @click="toggleSubmenu('media')">
            <i class="fas fa-photo-video"></i>
            <span v-show="!isCollapsed">จัดการสื่อ</span>
            <i v-show="!isCollapsed" :class="['fas', 'fa-chevron-down', 'submenu-arrow', { 'rotated': activeSubmenu === 'media' }]"></i>
          </button>
          <div class="submenu" :class="{ 'show': activeSubmenu === 'media' && !isCollapsed }">
            <router-link to="/media/images" class="nav-item" active-class="active">
              <i class="fas fa-images"></i>
              <span>รูปภาพ</span>
            </router-link>
            <router-link to="/media/videos" class="nav-item" active-class="active">
              <i class="fas fa-video"></i>
              <span>วิดีโอ</span>
            </router-link>
          </div>
        </div>

        <div class="nav-group d-none d-lg-none">
          <button class="nav-item" :class="{ 'active': isUsersActive }" @click="toggleSubmenu('users')">
            <i class="fas fa-users"></i>
            <span v-show="!isCollapsed">จัดการผู้ใช้</span>
            <i v-show="!isCollapsed" :class="['fas', 'fa-chevron-down', 'submenu-arrow', { 'rotated': activeSubmenu === 'users' }]"></i>
          </button>
          <div class="submenu" :class="{ 'show': activeSubmenu === 'users' && !isCollapsed }">
            <router-link to="/users/list" class="nav-item" active-class="active">
              <i class="fas fa-user-friends"></i>
              <span>รายชื่อผู้ใช้</span>
            </router-link>
            <router-link to="/users/roles" class="nav-item" active-class="active">
              <i class="fas fa-user-shield"></i>
              <span>สิทธิ์การใช้งาน</span>
            </router-link>
          </div>
        </div>

        <router-link to="/analytics" class="nav-item d-none d-lg-none" active-class="active">
          <i class="fas fa-chart-line"></i>
          <span v-show="!isCollapsed">วิเคราะห์ข้อมูล</span>
        </router-link>

        <router-link to="/settings" class="nav-item d-none d-lg-none" active-class="active">
          <i class="fas fa-cog"></i>
          <span v-show="!isCollapsed">ตั้งค่า</span>
        </router-link>

        <router-link to="/contact" class="nav-item" active-class="active">
          <i class="fas fa-envelope"></i>
          <span v-show="!isCollapsed">จัดการข้อความติดต่อ</span>
        </router-link>

        <router-link to="/test-management" class="nav-item" active-class="active">
          <i class="fas fa-clipboard-list"></i> 
          <span v-show="!isCollapsed">จัดการแบบทดสอบ</span>
        </router-link>

        <router-link to="/queue-management" class="nav-item" active-class="active">
          <i class="mdi mdi-calendar-clock"></i>
          <span v-show="!isCollapsed">จัดการคิว</span>
        </router-link>

        <router-link to="/chart" class="nav-item" active-class="active">
          <i class="fas fa-chart-line"></i>
          <span v-show="!isCollapsed">สถิติการประเมิน</span>
        </router-link>

        <router-link to="/users" class="nav-item" active-class="active">
          <i class="fas fa-users"></i>
          <span v-show="!isCollapsed">จัดการผู้ใช้</span>
        </router-link>

      </nav>
    </div>
  </aside>

  <!-- Backdrop for mobile -->
  <div class="sidebar-backdrop" v-if="isMobileOpen" @click="closeMobileSidebar"></div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'AppSidebar',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const route = useRoute()
    const isCollapsed = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })
    const isMobileOpen = ref(false)
    const activeSubmenu = ref(null)

    const isMediaActive = computed(() => {
      return route.path.startsWith('/media')
    })

    const isUsersActive = computed(() => {
      return route.path.startsWith('/users')
    })

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
    }

    const toggleSubmenu = (submenu) => {
      activeSubmenu.value = activeSubmenu.value === submenu ? null : submenu
    }

    const closeMobileSidebar = () => {
      isMobileOpen.value = false
    }

    return {
      isCollapsed,
      isMobileOpen,
      activeSubmenu,
      isMediaActive,
      isUsersActive,
      toggleSidebar,
      toggleSubmenu,
      closeMobileSidebar
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 260px;
  background: var(--primary-color);
  color: white;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.sidebar.collapsed {
  width: 70px;
}

@media (max-width: 991px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }
}

.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  display: none;
}

@media (max-width: 991px) {
  .sidebar-backdrop {
    display: block;
  }
}

.sidebar-header {
  height: 60px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.logo-container i {
  font-size: 1.5rem;
}

.collapse-btn {
  background: none;
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  position: relative;
}

.nav-item i:first-child {
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
  margin-right: 1rem;
}

.nav-item span {
  flex: 1;
  white-space: nowrap;
}

.nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
}

.submenu {
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.submenu.show {
  max-height: 200px;
}

.submenu .nav-item {
  padding-left: 3.2rem;
}

.submenu-arrow {
  transition: transform 0.3s ease;
}

.submenu-arrow.rotated {
  transform: rotate(180deg);
}

/* Scrollbar Styles */
.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
