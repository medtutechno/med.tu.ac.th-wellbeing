import axios from 'axios'
import Swal from 'sweetalert2'
import router from '@/router'
import { config } from '@/config'
import { loadingState } from '@/store/loadingState'

const API_URL = config.API_URL

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
})

// Add request interceptor to add token and show loading
api.interceptors.request.use(
  (config) => {
    loadingState.startLoading()
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    loadingState.stopLoading()
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token expiration and hide loading
api.interceptors.response.use(
  (response) => {
    loadingState.stopLoading()
    return response
  },
  async (error) => {
    loadingState.stopLoading()
    // Only handle 401 for non-login requests
    if (error.response?.status === 401 && !error.config.url.includes('/login')) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Show SweetAlert2
      await Swal.fire({
        icon: 'warning',
        title: 'เซสชันหมดอายุ',
        text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง'
      })

      // Redirect to login
      const currentPath = router.currentRoute.value.fullPath
      router.push({
        path: '/login',
        query: { redirect: currentPath }
      })
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  async login(username, password) {
    try {
      const response = await api.post('/login', {
        username,
        password,
      })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    }
  },

  async logout() {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return true
    } catch (error) {
      console.error('Logout error:', error)
      throw new Error('ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง')
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}

export const blogAPI = {
  async getBlogs() {
    try {
      const response = await api.get('/blog')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลบทความ')
    }
  },

  async getBlogsCount() {
    try {
      const response = await api.get('/blogs_count')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลจำนวนบทความ')
    }
  },

  async getTotalViews() {
    try {
      const response = await api.get('/blogs/total-views')
      return response.data.total_views
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลยอดเข้าชม')
    }
  },

  async getBlog(id) {
    try {
      const response = await api.get(`/blog/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลบทความ')
    }
  },

  async createBlog(data) {
    try {
      // ถ้ามี image ให้ใช้ FormData
      if (data.image) {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
          formData.append(key, data[key])
        })
        const response = await api.post('/blog', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data
      }
      
      // ถ้าไม่มี image ส่ง JSON ปกติ
      const response = await api.post('/blog', data)
      return response.data
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message)
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'เกิดข้อผิดพลาดในการสร้างบทความ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง'
      )
    }
  },

  async updateBlog(id, data) {
    try {
      const response = await api.put(`/blog/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปเดตบทความ')
    }
  },

  async deleteBlog(id) {
    try {
      const response = await api.delete(`/blog/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการลบบทความ')
    }
  },

  async getBlogsTopViewed() {
    const response = await api.get('/blogs_top_viewed')
    return response.data
  },
}

export const categoryAPI = {
  async getCategories() {
    try {
      const response = await api.get('/blog_category')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่')
    }
  },

  async getBlogCategoryCount() {
    try {
      const response = await api.get('/blog_category_count')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลจำนวนหมวดหมู่')
    }
  },

  async createCategory(data) {
    try {
      const response = await api.post('/blog_category', data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการสร้างหมวดหมู่')
    }
  },

  async updateCategory(id, data) {
    try {
      const response = await api.put(`/blog_category/${id}`, data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่')
    }
  },

  async deleteCategory(id) {
    try {
      const response = await api.delete(`/blog_category/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการลบหมวดหมู่')
    }
  }
}

export const contactAPI = {
  async getContacts(status = '') {
    try {
      const response = await api.get('/contact', { params: { status } })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลการติดต่อ')
    }
  },

  async getContact(id) {
    try {
      const response = await api.get(`/contact/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลการติดต่อ')
    }
  },

  async updateContactStatus(id, status) {
    try {
      const response = await api.patch(`/contact/${id}`, { status })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการอัพเดทสถานะ')
    }
  },

  async deleteContact(id) {
    try {
      const response = await api.delete(`/contact/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการลบข้อมูล')
    }
  }
}

export const testAPI = {
  async getTestResults() {
    try {
      const response = await api.get('/test_results')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลผลการทดสอบ')
    }
  },

  async getTestResultsByDateRange(startDate, endDate) {
    try {
      console.log('API Request:', `/test_results_by_date_range`, { startDate, endDate })
      const response = await api.get(`/test_results_by_date_range`, {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      })
      console.log('API Response:', response)
      return response
    } catch (error) {
      console.error('API Error:', error)
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลผลการประเมินตามช่วงวันที่')
    }
  },

  async getTestResult(id) {
    try {
      const response = await api.get(`/test_results/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลผลการทดสอบ')
    }
  },

  async getTestResultsCount() {
    try {
      const response = await api.get('/test_results_count')
      return response.data.total_count
    } catch (error) {
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงจำนวนผู้ทำแบบทดสอบ')
    }
  },

  async getLatestResults() {
    const response = await api.get('/test_results_latest')
    return response.data
  },
}

export const queueAPI = {
  async getQueueBookings() {
    const response = await api.get('/queue_bookings')
    return response.data
  },

  async getQueueBooking(id) {
    const response = await api.get(`/queue_bookings/${id}`)
    return response.data
  },

  async updateQueueStatus(id, status) {
    const response = await api.put(`/queue_bookings/${id}/status`, { status })
    return response.data
  },
}

export const userAPI = {
  async getUsers(page = 1, limit = 10) {
    const response = await api.get('/users', {
      params: { page, limit }
    })
    return {
      data: response.data.users,
      pagination: response.data.pagination
    }
  },

  async getUser(id) {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async createUser(userData) {
    const response = await api.post('/users', userData)
    return response.data
  },

  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`)
    return response.data
  }
}

export default api
