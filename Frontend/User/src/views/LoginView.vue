<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-header">
        <i class="fas fa-clinic-medical"></i>
        <h2>TU MED Admin</h2>
        <p>ระบบหลังบ้าน</p>
      </div>
      <div class="login-form">
        <div class="alert alert-danger" v-if="error">
          {{ error }}
        </div>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">ชื่อผู้ใช้</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-user"></i>
              </span>
              <input
                type="text"
                class="form-control"
                v-model="username"
                :class="{ 'is-invalid': submitted && !username }"
                placeholder="กรุณากรอกชื่อผู้ใช้"
                required
              />
            </div>
            <div class="invalid-feedback" v-if="submitted && !username">
              กรุณากรอกชื่อผู้ใช้
            </div>
          </div>
          <div class="mb-4">
            <label class="form-label">รหัสผ่าน</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-lock"></i>
              </span>
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                v-model="password"
                :class="{ 'is-invalid': submitted && !password }"
                placeholder="กรุณากรอกรหัสผ่าน"
                required
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                style="border-color: #dee2e6 !important;"
                @click="togglePassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="invalid-feedback" v-if="submitted && !password">
              กรุณากรอกรหัสผ่าน
            </div>
          </div>
          <div class="d-grid">
            <button
              class="btn btn-primary btn-login text-light"
              type="submit"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import Swal from 'sweetalert2'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const loading = ref(false)
    const submitted = ref(false)
    const error = ref('')
    const showPassword = ref(false)

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const handleLogin = async () => {
      submitted.value = true
      error.value = ''

      if (!username.value || !password.value) {
        return
      }

      loading.value = true

      try {
        await authAPI.login(username.value, password.value)
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: 'ยินดีต้อนรับเข้าสู่ระบบ',
          showConfirmButton: false,
          timer: 1500
        })
        router.push('/dashboard')
      } catch (err) {
        error.value = err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
        Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: error.value
        })
      } finally {
        loading.value = false
      }
    }

    return {
      username,
      password,
      loading,
      submitted,
      error,
      showPassword,
      togglePassword,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.login-header {
  background: linear-gradient(to right, #1a237e, #283593);
  color: white;
  padding: 30px;
  text-align: center;
}

.login-header i {
  font-size: 3rem;
  margin-bottom: 15px;
}

.login-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.login-header p {
  margin: 10px 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.login-form {
  padding: 30px;
}

.form-label {
  font-weight: 500;
  color: #1a237e;
}

.input-group-text {
  background: white;
  color: #1a237e;
  border-right: none;
}

.form-control {
  border-left: none;
}

/* .form-control:focus {
  border-color: #1a237e;
  box-shadow: none;
} */

.btn-login {
  padding: 12px;
  font-weight: 500;
  background: linear-gradient(to right, #2c3e50, #283593);
  border: none;
  transition: all 0.3s;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(26, 35, 126, 0.2);
}

.btn-login:disabled {
  background: #ccc;
}

.alert {
  border: none;
  border-radius: 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-box {
  animation: fadeIn 0.5s ease-out;
}
</style>
