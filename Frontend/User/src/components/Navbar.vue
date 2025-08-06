<template>
  <nav class="navbar">
    <div class="container-fluid px-3">
      <div class="d-flex align-items-center">
        <button class="hamburger-btn d-lg-none" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </button>
        <div class="page-title d-none d-sm-block ms-3">{{ currentPageTitle }}</div>
      </div>
      
      <div class="d-flex align-items-center gap-3">
        <!-- <button class="notification-btn" type="button">
          <i class="fas fa-bell"></i>
          <span class="notification-badge" v-if="hasNotifications">3</span>
        </button> -->

        <div class="ms-3">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                color="primary"
                v-bind="props"
                variant="text"
              >
                <i class="fas fa-user-circle me-2"></i>
                <span class="d-none d-sm-inline">Admin</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
                :value="index"
                @click="handleMenuClick(item.action)"
              >
                <v-list-item-title>
                  <i :class="item.icon + ' me-2'"></i>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '@/services/api'
import Swal from 'sweetalert2'

export default {
  name: 'TopNavbar',
  emits: ['toggle-sidebar'],
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const hasNotifications = ref(true)

    const currentPageTitle = computed(() => {
      const routeTitles = {
        '/dashboard': 'แดชบอร์ด',
        '/BlogCategory': 'หมวดหมู่บทความ',
        '/Blog': 'จัดการบทความ',
        '/media/images': 'รูปภาพ',
        '/media/videos': 'วิดีโอ',
        '/users/list': 'รายชื่อผู้ใช้',
        '/users/roles': 'สิทธิ์การใช้งาน',
        '/analytics': 'วิเคราะห์ข้อมูล',
        '/settings': 'ตั้งค่า',
        '/assessment-stats': 'สถิติแบบประเมิน (ตาราง)',
        '/test-results-chart': 'สถิติแบบประเมิน (กราฟ)'
      }
      return routeTitles[route.path] || 'TU MED Admin'
    })

    const menuItems = [
      // { title: 'โปรไฟล์', icon: 'fas fa-user', action: 'profile' },
      // { title: 'ตั้งค่า', icon: 'fas fa-cog', action: 'settings' },
      { title: 'ออกจากระบบ', icon: 'fas fa-sign-out-alt', action: 'logout' }
    ]

    const toggleSidebar = () => {
      emit('toggle-sidebar')
    }

    const handleMenuClick = async (action) => {
      switch (action) {
        case 'profile':
          // Handle profile click
          break
        case 'settings':
          // Handle settings click
          break
        case 'logout':
          try {
            await authAPI.logout()
            await Swal.fire({
              icon: 'success',
              title: 'ออกจากระบบสำเร็จ',
              showConfirmButton: false,
              timer: 1500
            })
            router.push('/login')
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: error.message
            })
          }
          break
      }
    }

    return {
      hasNotifications,
      currentPageTitle,
      menuItems,
      handleMenuClick,
      toggleSidebar
    }
  }
}
</script>

<style scoped>
.navbar {
  background: white;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 60px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

@media (min-width: 992px) {
  .navbar {
    left: 260px;
  }
  
  .navbar.sidebar-collapsed {
    left: 70px;
  }
}

.page-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-dark);
}

.hamburger-btn {
  background: none;
  border: none;
  color: var(--text-dark);
  font-size: 1.2rem;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hamburger-btn:hover {
  color: var(--primary-color);
}

.notification-btn {
  position: relative;
  background: none;
  border: none;
  color: var(--text-dark);
  font-size: 1.2rem;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-btn:hover {
  color: var(--primary-color);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--danger-color);
  color: white;
  font-size: 0.7rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-list-item-title {
  display: flex;
  align-items: center;
}
</style>
