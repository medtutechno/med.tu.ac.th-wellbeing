<template>
  <div class="chart-container">
    <h2>สถิติการทำแบบประเมิน</h2>
    
    <div class="form-group">
      <div class="date-inputs">
        <div>
          <label>วันที่เริ่มต้น</label>
          <input
            type="date"
            v-model="startDate"
          >
        </div>
        <div>
          <label>วันที่สิ้นสุด</label>
          <input
            type="date"
            v-model="endDate"
          >
        </div>
        <div>
          <button
            @click="fetchData"
            :disabled="loading"
          >
            {{ loading ? 'กำลังโหลด...' : 'แสดงผล' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="loading" class="loading">
      กำลังโหลด...
    </div>

    <div v-if="!error && !loading" class="charts">
      <div class="chart-box">
        <h3>คะแนนเฉลี่ย DASS-21</h3>
        <div class="chart-wrapper">
          <apexchart
            type="line"
            height="400"
            :options="dass21Options"
            :series="dass21Series"
          ></apexchart>
        </div>
      </div>

      <div class="chart-box">
        <h3>คะแนนเฉลี่ย 8Q</h3>
        <div class="chart-wrapper">
          <apexchart
            type="line"
            height="400"
            :options="eightQOptions"
            :series="eightQSeries"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { testAPI } from '@/services/api'
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'ChartDataAssignment',
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      loading: false,
      error: null,
      dass21Series: [],
      eightQSeries: [],
      dass21Options: {
        chart: {
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        colors: ['#FF6384', '#36A2EB', '#FFCE56'],
        xaxis: {
          categories: []
        },
        yaxis: {
          max: 21,
          title: {
            text: 'คะแนนเฉลี่ย'
          }
        },
        legend: {
          position: 'bottom'
        }
      },
      eightQOptions: {
        chart: {
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        colors: ['#4BC0C0'],
        xaxis: {
          categories: []
        },
        yaxis: {
          max: 60,
          title: {
            text: 'คะแนนเฉลี่ย'
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  },
  methods: {
    async fetchData() {
      if (!this.startDate || !this.endDate) {
        this.error = 'กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุด'
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await testAPI.getTestResultsByDateRange(this.startDate, this.endDate)
        console.log('API Response:', response.data)

        if (!response.data || response.data.length === 0) {
          this.error = 'ไม่พบข้อมูลในช่วงเวลาที่เลือก'
          return
        }

        this.createCharts(response.data)
      } catch (error) {
        console.error('Error:', error)
        this.error = 'เกิดข้อผิดพลาดในการดึงข้อมูล'
      } finally {
        this.loading = false
      }
    },
    createCharts(data) {
      try {
        // Sort data by date
        data.sort((a, b) => new Date(a.date) - new Date(b.date))

        // Prepare data
        const dates = data.map(item => {
          const date = new Date(item.date)
          return date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        })

        const depression = data.map(item => Number(item.scores.depression.avg) || 0)
        const anxiety = data.map(item => Number(item.scores.anxiety.avg) || 0)
        const stress = data.map(item => Number(item.scores.stress.avg) || 0)
        const eightQ = data.map(item => Number(item.scores.eightq.avg) || 0)

        // Update DASS-21 chart
        this.dass21Options = {
          ...this.dass21Options,
          xaxis: {
            categories: dates
          }
        }
        
        this.dass21Series = [
          {
            name: 'ภาวะซึมเศร้า',
            data: depression
          },
          {
            name: 'ความวิตกกังวล',
            data: anxiety
          },
          {
            name: 'ความเครียด',
            data: stress
          }
        ]

        // Update 8Q chart
        this.eightQOptions = {
          ...this.eightQOptions,
          xaxis: {
            categories: dates
          }
        }
        
        this.eightQSeries = [
          {
            name: 'คะแนน 8Q',
            data: eightQ
          }
        ]
      } catch (error) {
        console.error('Error creating charts:', error)
        this.error = 'เกิดข้อผิดพลาดในการสร้างกราฟ'
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.date-inputs {
  display: flex;
  gap: 20px;
  align-items: flex-end;
}

.date-inputs > div {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  min-width: 100px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  padding: 10px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.charts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-box h3 {
  margin-bottom: 20px;
}

.chart-wrapper {
  width: 100%;
}
</style>
