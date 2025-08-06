<template>
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
  </div>
  <div v-else>
    <div v-if="post" class="blog-post-container">
      <div class="blog-content">
        <div class="blog-post-header">
          <center>
            <img :src="getImageUrl(post.image_url)" :alt="post.title" class="blog-post-image">
          </center>
          <h1 class="blog-post-title mt-3">{{ post.title }}</h1>
          <div class="blog-post-meta">
            <span class="blog-post-category"> <i class="fas fa-folder"></i>&nbsp;{{ post.category_name }}</span>
            <span class="blog-post-author">โดย <i class="fas fa-user"></i>&nbsp;{{ post.username }}</span>
            <span class="blog-post-date"><i class="fas fa-calendar-alt"></i>&nbsp;{{ formatDate(post.created_at) }}</span>
            <span class="blog-post-views"><i class="fas fa-eye"></i>&nbsp;{{ post.count_view || 0 }} ครั้ง</span>
          </div>
        </div>
        
        <div class="blog-post-content" v-html="post.content">
        </div>
        
        <button class="btn btn-primary" @click="goBack">
          ← กลับไปหน้าบทความ
        </button>
      </div>

      <!-- Related Posts Section -->
      <div v-if="relatedPosts.length > 0" class="related-posts">
        <h2 class="related-title">บทความที่เกี่ยวข้อง</h2>
        <div class="related-list">
          <div v-for="relatedPost in relatedPosts" :key="relatedPost.blog_id" 
               class="related-item" @click="navigateToPost(relatedPost.blog_id)">
            <div class="related-image-wrapper">
              <img :src="getImageUrl(relatedPost.image_url)" :alt="relatedPost.title" class="related-image">
            </div>
            <div class="related-content">
              <h3 class="related-heading">{{ relatedPost.title }}</h3>
              <div class="related-meta">
                <span class="related-category">{{ relatedPost.category_name }}</span>
                <span class="related-date">{{ formatDate(relatedPost.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="not-found">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-message">ไม่พบบทความที่คุณต้องการ</h2>
        <p class="error-description">บทความที่คุณกำลังค้นหาอาจถูกย้ายหรือลบออกไปแล้ว</p>
        <button class="home-button" @click="goBack">
          กลับไปหน้าบทความ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_CONFIG, getImageUrl } from '@/config/api'

export default {
  name: 'BlogPostView',
  data() {
    return {
      post: null,
      relatedPosts: [],
      loading: true,
      error: null
    }
  },
  async created() {
    try {
      console.log('Blog ID:', this.$route.params.id)
      const response = await axios.get(`${API_CONFIG.PUBLIC_URL}/blog_view/${this.$route.params.id}`)
      this.post = response.data
      await this.fetchRelatedPosts()
      
      console.log(this.post)
      // Increment view count
      try {
        await axios.get(`${API_CONFIG.API_URL}/blogs/increment-view/${this.$route.params.id}`)
      } catch (error) {
        console.error('Error incrementing view count:', error)
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
      this.error = 'ไม่พบบทความที่คุณต้องการ'
    } finally {
      this.loading = false
    }
  },
  methods: {
    async fetchRelatedPosts() {
      try {
        const response = await axios.get(`${API_CONFIG.PUBLIC_URL}/blog/`)
        // Filter out current post and get up to 3 related posts
        this.relatedPosts = response.data
          .filter(post => post.blog_id !== this.post.blog_id)
          .slice(0, 3)
      } catch (error) {
        console.error('Error fetching related posts:', error)
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    navigateToPost(id) {
      this.$router.push(`/blog/${id}`)
    },
    getImageUrl,
    goBack() {
      this.$router.push('/blog')
    }
  },
  watch: {
    '$route.params.id': {
      async handler() {
        this.loading = true
        try {
          const response = await axios.get(`${API_CONFIG.PUBLIC_URL}/blog_view/${this.$route.params.id}`)
          this.post = response.data
          await this.fetchRelatedPosts()

          console.log(response)
          console.log('Related posts:', this.relatedPosts)
          console.log('Loading:', this.$route.params.id)
          
          // Increment view count
          try {
            await axios.get(`${API_CONFIG.API_URL}/blogs/increment-view/${this.$route.params.id}`)
          } catch (error) {
            console.error('Error incrementing view count:', error)
          }
        } catch (error) {
          console.error('Error fetching blog post:', error)
          this.error = 'ไม่พบบทความที่คุณต้องการ'
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style scoped>
.blog-post-title{font-size: 1.5rem;}
.blog-post-content img { width: 480px !important; }

.blog-post-image{ max-width: 480px; width: 100%; border-radius: 12px; }
.loading-container {
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--home4-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.blog-post-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.blog-content {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 1200px;
  width: 100%;
}

.blog-content img {
  max-width: 480px !important;
}


.related-posts {
  position: sticky;
  top: 2rem;
  align-self: start;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.related-title {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.related-item {
  display: flex;
  gap: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;
}

.related-item:hover {
  transform: translateX(5px);
  background: #f8f9fa;
}

.related-image-wrapper {
  flex: 0 0 100px;
}

.related-image {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
}

.related-content {
  flex: 1;
  min-width: 0;
}

.related-heading {
  font-size: 1rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.related-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.85rem;
}

.related-category {
  color: var(--home4-primary);
  font-weight: 600;
}

.related-date {
  color: #666;
}

.blog-post-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
  font-size: 0.95rem;
  color: #666;
}

.blog-post-meta span {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.blog-post-meta span:hover {
  background-color: #e9e9e9;
}

.blog-post-category {
  color: #2196F3;
  font-weight: 500;
}

.blog-post-author {
  color: #333;
}

.blog-post-date {
  color: #666;
}

.blog-post-views {
  color: #4CAF50;
}

.blog-post-views i {
  margin-right: 6px;
}

@media (max-width: 1024px) {
  .blog-post-container {
    grid-template-columns: 1fr;
  }

  .related-posts {
    position: static;
    margin-top: 2rem;
  }

  .related-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .related-item {
    flex-direction: column;
  }

  .related-image-wrapper {
    flex: none;
  }

  .related-image {
    width: 100%;
    height: 150px;
  }
}

@media (max-width: 768px) {
  .blog-post-container {
    padding: 1rem;
  }

  .blog-content {
    padding: 1rem;
  }

  .related-list {
    grid-template-columns: 1fr;
  }

  .blog-post-meta {
    gap: 10px;
    justify-content: flex-start;
  }
  
  .blog-post-meta span {
    padding: 3px 10px;
    font-size: 0.9rem;
  }
}

.not-found {
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f8f9fa;
}

.not-found-content {
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
  line-height: 1;
}

.error-message {
  font-size: 2rem;
  color: #2c3e50;
  margin: 1rem 0;
}

.error-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.home-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: var(--home4-primary);
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.home-button:hover {
  opacity: 0.9;
}
</style>
