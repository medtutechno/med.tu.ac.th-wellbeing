<template>
  <div class="dashboard">
    <div class="row">
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="stat-card">
          <div class="stat-card-body">
            <div class="stat-icon">
              <i class="fas fa-newspaper"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.totalBlogs || 0 }}</h3>
              <p>บทความทั้งหมด</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="stat-card">
          <div class="stat-card-body">
            <div class="stat-icon">
              <i class="fas fa-tags"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.totalCategories || 0 }}</h3>
              <p>หมวดหมู่</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="stat-card">
          <div class="stat-card-body">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3>{{ totalTestResults }}</h3>
              <p>ผู้ใช้ทั้งหมด</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="stat-card">
          <div class="stat-card-body">
            <div class="stat-icon">
              <i class="fas fa-eye"></i>
            </div>
            <div class="stat-content">
              <h3>{{ totalViews }}</h3>
              <p>ยอดเข้าชม</p>
              <!-- <button @click="refreshTotalViews">รีเฟรช</button> -->
            </div>
          </div>
        </div>
      </div>
    
    </div>

    <div class="row">
      <div class="col-md-8 mb-4">
        <div class="card">
          <div class="card-header d-flex align-center">
            <h5 class="mb-0">ผลการทดสอบล่าสุด</h5>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              variant="text"
              @click="$router.push('/test-management')"
            >
              ดูทั้งหมด
              <v-icon right>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>ชื่อผู้ทำแบบทดสอบ</th>
                    <th class="text-center">ภาวะซึมเศร้า</th>
                    <th class="text-center">ความวิตกกังวล</th>
                    <th class="text-center">ความเครียด</th>
                    <th class="text-center">DASS-21</th>
                    <th class="text-center">8Q</th>
                    <th>วันที่</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="result in latestResults" :key="result.id">
                    <td>{{ result.name }}</td>
                    <td class="text-center">{{ result.scores.depression }}</td>
                    <td class="text-center">{{ result.scores.anxiety }}</td>
                    <td class="text-center">{{ result.scores.stress }}</td>
                    <td class="text-center">{{ result.scores.dass21 }}</td>
                    <td class="text-center">{{ result.scores.eightq }}</td>
                    <td>{{ formatDate(result.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">บทความยอดนิยม</h5>
          </div>
          <div class="card-body">
            <div class="popular-categories">
              <div v-for="blog in popularBlogs" :key="blog.id" class="category-item">
                <div class="category-name">{{ blog.title }}</div>
                <div class="category-count">{{ blog.count_view }} ครั้ง</div>
                <div class="progress">
                  <div
                    class="progress-bar"
                    :style="{ width: (blog.count_view / maxViewCount * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row d-none">
      <div class="col-md-12 mb-4">
        <div class="card">
          <div class="card-header d-flex align-center">
            <h5 class="mb-0">ผลการทดสอบล่าสุด</h5>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              variant="text"
              @click="$router.push('/test-results')"
            >
              ดูทั้งหมด
              <v-icon right>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>ชื่อผู้ทำแบบทดสอบ</th>
                    <th class="text-center">ภาวะซึมเศร้า</th>
                    <th class="text-center">ความวิตกกังวล</th>
                    <th class="text-center">ความเครียด</th>
                    <th class="text-center">DASS-21</th>
                    <th class="text-center">8Q</th>
                    <th>วันที่</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="result in latestResults" :key="result.id">
                    <td>{{ result.name }}</td>
                    <td class="text-center">{{ result.scores.depression }}</td>
                    <td class="text-center">{{ result.scores.anxiety }}</td>
                    <td class="text-center">{{ result.scores.stress }}</td>
                    <td class="text-center">{{ result.scores.dass21 }}</td>
                    <td class="text-center">{{ result.scores.eightq }}</td>
                    <td>{{ formatDate(result.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { blogAPI } from '@/services/api'
import { testAPI } from '@/services/api'
import { categoryAPI } from '@/services/api'

export default {
  name: 'DashboardView',
  setup() {
    const stats = ref({
      totalBlogs: 0,
      totalCategories: 0,
      totalUsers: 0,
      totalViews: 0
    })

    const totalViews = ref(0)
    const totalTestResults = ref(0)

    const recentBlogs = ref([])
    const popularCategories = ref([])
    const popularBlogs = ref([])

    const maxCategoryCount = computed(() => {
      if (popularCategories.value.length === 0) return 0
      return Math.max(...popularCategories.value.map(c => c.count))
    })

    const maxViewCount = ref(0)

    const latestResults = ref([])

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const fetchTotalViews = async () => {
      try {
        totalViews.value = await blogAPI.getTotalViews()
      } catch (error) {
        console.error('Error fetching total views:', error)
      }
    }

    const fetchTotalTestResults = async () => {
      try {
        totalTestResults.value = await testAPI.getTestResultsCount()
      } catch (error) {
        console.error('Error fetching test results count:', error)
      }
    }

    const refreshTotalViews = () => {
      fetchTotalViews()
    }

    const fetchPopularBlogs = async () => {
      try {
        const data = await blogAPI.getBlogsTopViewed()
        popularBlogs.value = data
        // หาจำนวนผู้เข้าชมสูงสุด
        maxViewCount.value = Math.max(...data.map(blog => blog.count_view))
      } catch (error) {
        console.error('Error fetching popular blogs:', error)
      }
    }

    const fetchLatestResults = async () => {
      try {
        const response = await testAPI.getLatestResults()
        latestResults.value = response
      } catch (error) {
        console.error('Error fetching latest test results:', error)
      }
    }

    onMounted(async () => {
      try {
        const categoryData = await categoryAPI.getBlogCategoryCount();
        stats.value.totalCategories = categoryData.total_count;

        const blogsData = await blogAPI.getBlogsCount();
        stats.value.totalBlogs = blogsData.total_count;
      } catch (error) {
        console.error('Error fetching data:', error);
        stats.value.totalCategories = 0;
        stats.value.totalBlogs = 0;
      }

      stats.value = {
        ...stats.value,
        totalUsers: 12,
        totalViews: 0
      }

      recentBlogs.value = [
        { id: 1, title: 'การรักษาโรคหัวใจ', category: 'โรคหัวใจ', author: 'Dr.Smith', created_at: '2024-01-24' },
        { id: 2, title: 'วิธีป้องกันโควิด-19', category: 'โรคติดต่อ', author: 'Dr.Johnson', created_at: '2024-01-23' },
        { id: 3, title: 'อาหารเพื่อสุขภาพ', category: 'โภชนาการ', author: 'Dr.Brown', created_at: '2024-01-22' }
      ]

      popularCategories.value = [
        { id: 1, name: 'โรคหัวใจ', count: 12 },
        { id: 2, name: 'โรคติดต่อ', count: 8 },
        { id: 3, name: 'โภชนาการ', count: 5 },
        { id: 4, name: 'สุขภาพจิต', count: 3 }
      ]

      await Promise.all([
        fetchTotalViews(),
        fetchTotalTestResults(),
        fetchPopularBlogs(),
        fetchLatestResults()
      ])
    })

    return {
      stats,
      totalViews,
      totalTestResults,
      recentBlogs,
      popularCategories,
      popularBlogs,
      maxCategoryCount,
      maxViewCount,
      latestResults,
      formatDate,
      refreshTotalViews
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card-body {
  padding: 20px;
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stat-icon i {
  font-size: 24px;
  color: white;
}

.stat-content h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a237e;
}

.stat-content p {
  margin: 5px 0 0;
  color: #666;
  font-size: 14px;
}

.popular-categories {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.category-item {
  padding: 10px 0;
}

.category-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.category-count {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.progress {
  height: 6px;
  background: #f5f6fa;
}

.progress-bar {
  background: linear-gradient(to right, #1a237e, #283593);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.table th {
  font-weight: 600;
  color: #1a237e;
}

.table td {
  vertical-align: middle;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.card-body {
  padding: 20px;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-name {
  font-weight: 500;
  color: #333;
}

.category-count {
  font-size: 0.9em;
  color: #666;
}

.progress {
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}
</style>
