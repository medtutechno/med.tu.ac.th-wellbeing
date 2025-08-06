<template>
  <v-layout>
    <div class="test-detail">
      <v-container>
        <v-card class="mx-auto" max-width="1200">
          <v-btn 
              color="white" 
              text 
              @click="print"
              class="mr-2"
              :loading="printing"
            >
              <v-icon left>mdi-printer</v-icon>
              พิมพ์
            </v-btn>
            <v-btn 
              color="white" 
              text 
              @click="$router.push('/test-management')"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              กลับ
            </v-btn>
          <v-card-text v-if="testData" class="mt-4">
            <v-row>
              <v-col cols="12">
                <v-card outlined class="mb-6">
                  <v-card-title class="subtitle-1 font-weight-bold">
                    <v-icon left color="primary">mdi-account</v-icon>
                    ข้อมูลทั่วไป
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="text-subtitle-1">
                          <strong>ชื่อ:</strong> {{ testData.name }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-subtitle-1">
                          <strong>วันที่ทำแบบทดสอบ:</strong> {{ formatDate(testData.created_at) }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card outlined class="mb-6">
                  <v-card-title class="subtitle-1 font-weight-bold">
                    <v-icon left color="primary">mdi-chart-bar</v-icon>
                    ผลคะแนน
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="mx-auto" outlined>
                          <v-card-text class="text-center">
                            <div class="text-h5 primary--text font-weight-bold">
                              {{ depressionScore }}
                            </div>
                            <div class="text-subtitle-1">คะแนนความเครียด</div>
                            <div class="text-caption">{{ depressionLevel }}</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="mx-auto" outlined>
                          <v-card-text class="text-center">
                            <div class="text-h5 primary--text font-weight-bold">
                              {{ anxietyScore }}
                            </div>
                            <div class="text-subtitle-1">คะแนนวิตกกังวล</div>
                            <div class="text-caption">{{ anxietyLevel }}</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="mx-auto" outlined>
                          <v-card-text class="text-center">
                            <div class="text-h5 primary--text font-weight-bold">
                              {{ stressScore }}
                            </div>
                            <div class="text-subtitle-1">คะแนนซึมเศร้า</div>
                            <div class="text-caption">{{ stressLevel }}</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="mx-auto" outlined>
                          <v-card-text class="text-center">
                            <div class="text-h5 primary--text font-weight-bold">
                              {{ eightQScore }}
                            </div>
                            <div class="text-subtitle-1">คะแนน 8Q รวม</div>
                            <div class="text-caption">{{ eightQLevel }}</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card outlined class="mb-6">
                  <v-card-title class="subtitle-1 font-weight-bold">
                    <v-icon left color="primary">mdi-clipboard-text</v-icon>
                    แบบประเมิน DASS-21
                  </v-card-title>
                  <v-card-text>
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>คำถาม</th>
                            <th>คำตอบ</th>
                            <th>คะแนน</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in dass21Questions" :key="index">
                            <td>{{ item.question }}</td>
                            <td>{{ item.answer }}</td>
                            <td>{{ item.score }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card outlined class="mb-6">
                  <v-card-title class="subtitle-1 font-weight-bold">
                    <v-icon left color="primary">mdi-clipboard-text</v-icon>
                    แบบประเมิน 8Q
                  </v-card-title>
                  <v-card-text>
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>คำถาม</th>
                            <th>คำตอบ</th>
                            <th>คะแนน</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in eightQQuestions" :key="index">
                            <td>{{ item.question }}</td>
                            <td>{{ item.answer }}</td>
                            <td>{{ item.score }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text v-else class="text-center py-12">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <div class="text-h6 mt-4">กำลังโหลดข้อมูล...</div>
          </v-card-text>
        </v-card>
      </v-container>

      <!-- Print Layout -->
      <div v-if="showPrintDialog" class="print-content">
        <div class="print-header">
          <h1>รายงานผลการประเมิน</h1>
          <p>วันที่พิมพ์: {{ formatDate(new Date()) }}</p>
        </div>

        <div class="print-info">
          <h2>ข้อมูลทั่วไป</h2>
          <p><strong>ชื่อ:</strong> {{ testData?.name }}</p>
          <p><strong>วันที่ทำแบบทดสอบ:</strong> {{ formatDate(testData?.created_at) }}</p>
        </div>

        <div class="print-scores">
          <div class="print-item">
            <strong>คะแนนความเครียด:</strong> {{ stressScore }}
            <div class="print-level">ระดับ: {{ stressLevel }}</div>
          </div>
          <div class="print-item">
            <strong>คะแนนวิตกกังวล:</strong> {{ anxietyScore }}
            <div class="print-level">ระดับ: {{ anxietyLevel }}</div>
          </div>
          <div class="print-item">
            <strong>คะแนนซึมเศร้า:</strong> {{ depressionScore }}
            <div class="print-level">ระดับ: {{ depressionLevel }}</div>
          </div>
          <div class="print-item">
            <strong>คะแนน 8Q รวม:</strong> {{ eightQScore }}
            <div class="print-level">ระดับความเสี่ยง: {{ eightQLevel }}</div>
          </div>
        </div>

        <div class="print-questions">
          <h2>แบบประเมิน DASS-21</h2>
          <table>
            <thead>
              <tr>
                <th>คำถาม</th>
                <th>คำตอบ</th>
                <th>คะแนน</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in dass21Questions" :key="'dass21-'+index">
                <td>{{ item.question }}</td>
                <td>{{ item.answer }}</td>
                <td>{{ item.score }}</td>
              </tr>
            </tbody>
          </table>

          <h2>แบบประเมิน 8Q</h2>
          <table>
            <thead>
              <tr>
                <th>คำถาม</th>
                <th>คำตอบ</th>
                <th>คะแนน</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in eightQQuestions" :key="'8q-'+index">
                <td>{{ item.question }}</td>
                <td>{{ item.answer }}</td>
                <td>{{ item.score }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </v-layout>
</template>

<script>
import { testAPI } from '@/services/api'

export default {
  name: 'TestDetailView',

  data() {
    return {
      testData: null,
      dass21Data: null,
      eightQData: null,
      showPrintDialog: false,
      printing: false,
      loading: false
    }
  },

  async created() {
    try {
      const id = this.$route.params.id
      const response = await testAPI.getTestResult(id)
      this.testData = response

      // Parse JSON strings
      if (this.testData.dass21_result) {
        this.dass21Data = JSON.parse(this.testData.dass21_result)
      }
      if (this.testData.eightq_result) {
        this.eightQData = JSON.parse(this.testData.eightq_result)
      }
    } catch (error) {
      console.error('Error fetching test details:', error)
    }
  },

  computed: {
    depressionScore() {
      return this.dass21Data?.scores?.depression || 0
    },
    anxietyScore() {
      return this.dass21Data?.scores?.anxiety || 0
    },
    stressScore() {
      return this.dass21Data?.scores?.stress || 0
    },
    eightQScore() {
      return this.eightQData?.assessment8Q?.score || 0
    },
    depressionLevel() {
      return this.dass21Data?.summary?.assessmentDASS21?.scores?.depression?.level || 'ไม่มีข้อมูล'
    },
    anxietyLevel() {
      return this.dass21Data?.summary?.assessmentDASS21?.scores?.anxiety?.level || 'ไม่มีข้อมูล'
    },
    stressLevel() {
      return this.dass21Data?.summary?.assessmentDASS21?.scores?.stress?.level || 'ไม่มีข้อมูล'
    },
    eightQLevel() {
      return this.eightQData?.assessment8Q?.riskLevel || 'ไม่มีข้อมูล'
    },
    dass21Questions() {
      return this.dass21Data?.summary?.assessmentDASS21?.responses || []
    },
    eightQQuestions() {
      return this.eightQData?.assessment8Q?.responses || []
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    print() {
      this.printing = true
      this.showPrintDialog = true
      this.$nextTick(() => {
        window.print()
        this.showPrintDialog = false
        this.printing = false
      })
    }
  }
}
</script>

<style>
.test-detail {
  padding: 20px;
}

/* Print Styles */
@media print {
  .v-app-bar,
  .v-navigation-drawer,
  .v-footer {
    display: none !important;
  }

  .print-content {
    display: block !important;
  }

  .no-print {
    display: none !important;
  }

  .print-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .print-info {
    margin-bottom: 30px;
  }

  .print-scores {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 30px;
  }

  .print-item {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .print-level {
    margin-top: 5px;
    color: #666;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f5f5f5;
  }
}

/* Print Dialog Content */
.print-content {
  display: none;
  padding: 20px;
}
</style>
