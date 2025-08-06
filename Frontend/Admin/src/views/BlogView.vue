<template>
  <div class="blog-page">
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="section-title aos-init aos-animate" data-aos="fade-up">
              <h1>บทความ</h1>
            </div>
            <div class="category-filter" data-aos="fade-up">
              <select 
                class="form-select" 
                v-model="selectedCategory"
                @change="onCategoryChange"
                aria-label="เลือกหมวดหมู่"
              >
                <option value="">ทุกหมวดหมู่</option>
                <option v-for="category in categories" 
                        :key="category.id" 
                        :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="blog-list">
            <div v-if="displayedPosts.length > 0" class="row">
              <div v-for="post in displayedPosts" 
                   :key="post.blog_id" 
                   class="col-md-6 col-lg-4 mb-4"
                   @click="viewBlogPost(post.blog_id)">
                <div class="ota-item" data-aos="fade-up">
                  <div class="ota-image-wrapper">
                    <img :src="getImageUrl(post.image_url)" :alt="post.title" class="ota-image">
                  </div>
                  <div class="ota-content">
                    <h3 class="ota-heading">{{ post.title }}</h3>
                    <div class="ota-meta ">
                      <span class="ota-category">{{ post.name }}</span>
                      <span class="ota-author">โดย {{ post.username }}</span>
                      <span class="ota-date">{{ formatDate(post.created_at) }}</span>
                      <span class="ota-views"><i class="fas fa-eye"></i> {{ post.count_view || 0 }} ครั้ง</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Load More Button -->
            <div v-if="hasMorePosts" class="text-center mt-4">
              <button @click="loadMore" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ loading ? 'กำลังโหลด...' : 'โหลดเพิ่มเติม' }}
              </button>
            </div>

            <div v-if="loading && !displayedPosts.length" class="no-posts-message" data-aos="fade-up">
              <div class="no-data-icon">📝</div>
              <h2>กำลังโหลด...</h2>
            </div>

            <div v-if="!loading && !displayedPosts.length" class="no-posts-message" data-aos="fade-up">
              <div class="no-data-icon">📝</div>
              <h2>{{ error || 'ไม่พบบทความ' }}</h2>
              <p>ขออภัย ยังไม่มีบทความในขณะนี้</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_CONFIG, getImageUrl } from '@/config/api'

export default {
  name: 'BlogView',
  data() {
    return {
      blogPosts: [], // เก็บบทความทั้งหมดที่ได้จาก API
      displayedPosts: [], // เก็บบทความที่แสดงในหน้าเว็บ
      currentPage: 1,
      initialPosts: 6, // จำนวนบทความที่แสดงครั้งแรก
      postsPerPage: 3, // จำนวนบทความที่โหลดเพิ่มแต่ละครั้ง
      loading: true,
      error: null,
      categories: [],
      selectedCategory: ''
    }
  },
  computed: {
    hasMorePosts() {
      return this.displayedPosts.length < this.blogPosts.length
    }
  },
  async created() {
    await Promise.all([
      this.fetchCategories(),
      this.fetchPosts()
    ])
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`${API_CONFIG.PUBLIC_URL}/categories`)
        this.categories = response.data
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    async fetchPosts(categoryId = '') {
      this.loading = true
      try {
        const url = categoryId 
          ? `${API_CONFIG.PUBLIC_URL}/blog/${categoryId}`
          : `${API_CONFIG.PUBLIC_URL}/blog/`
        const response = await axios.get(url)
        this.blogPosts = response.data
        this.displayedPosts = this.blogPosts.slice(0, this.initialPosts)
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        this.error = 'ไม่สามารถโหลดบทความได้ กรุณาลองใหม่อีกครั้ง'
      } finally {
        this.loading = false
      }
    },
    loadMore() {
      this.loading = true
      setTimeout(() => {
        const nextPosts = this.blogPosts.slice(
          this.displayedPosts.length,
          this.displayedPosts.length + this.postsPerPage
        )
        this.displayedPosts = [...this.displayedPosts, ...nextPosts]
        this.currentPage++
        this.loading = false
      }, 500) // เพิ่ม delay เล็กน้อยเพื่อให้เห็น loading state
    },
    async onCategoryChange() {
      await this.fetchPosts(this.selectedCategory)
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    async viewBlogPost(id) {
      try {
        // Update view count
        await axios.get(`${API_CONFIG.PUBLIC_URL}/blog/${id}`)
        // Navigate to blog detail page
        this.$router.push(`/blog/${id}`)
      } catch (error) {
        console.error('Error updating view count:', error)
      }
    },
    getImageUrl
  }
}
</script>

<style scoped>
.blog-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.ota-item {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.ota-item:hover {
  transform: translateY(-5px);
}

.ota-image-wrapper {
  position: relative;
  padding-top: 60%;
  overflow: hidden;
}

.ota-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ota-content {
  padding: 1rem;
}

.ota-heading {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ota-meta {
  font-size: 0.9rem;
  color: #6c757d;
}

.ota-meta > span:not(:last-child)::after {
  content: "•";
  margin: 0 0.5rem;
}

.no-posts-message {
  text-align: center;
  padding: 3rem 0;
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Loading button styles */
.btn-primary:disabled {
  cursor: not-allowed;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.category-filter {
  min-width: 200px;
}

.category-filter .form-select {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 0.5rem 2rem 0.5rem 1rem;
  font-size: 0.95rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}

.category-filter .form-select:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

.category-filter .form-select:hover {
  border-color: #80bdff;
}
</style>
