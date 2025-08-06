<template>
  <v-layout>
    <div class="queue-detail">
      <v-container>
        <v-card class="mx-auto" max-width="1200">
          <v-card-text>
            <div class="d-flex justify-end mb-4">
              <v-btn 
                color="primary" 
                text 
                @click="print"
                class="mr-2"
                :loading="printing"
              >
                <v-icon left>mdi-printer</v-icon>
                พิมพ์
              </v-btn>
              <v-btn 
                color="primary" 
                text 
                @click="$router.push('/queue-management')"
              >
                <v-icon left>mdi-arrow-left</v-icon>
                กลับ
              </v-btn>
            </div>

            <v-row v-if="queueData">
              <v-col cols="12">
                <h2 class="text-h5 mb-4">ข้อมูลนักศึกษา</h2>
                <v-card outlined>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">ชื่อ-นามสกุล</div>
                          <div>{{ queueData.full_name }}</div>
                        </div>
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">รหัสนักศึกษา</div>
                          <div>{{ queueData.student_id }}</div>
                        </div>
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">คณะ</div>
                          <div>{{ queueData.faculty }}</div>
                        </div>
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">ภาควิชา</div>
                          <div>{{ queueData.department }}</div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">ชั้นปี</div>
                          <div>{{ queueData.year }}</div>
                        </div>
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">เบอร์โทรศัพท์</div>
                          <div>{{ queueData.phone }}</div>
                        </div>
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">อีเมล</div>
                          <div>{{ queueData.email }}</div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <h2 class="text-h5 mb-4">ข้อมูลการจองคิว</h2>
                <v-card outlined>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">วันที่จอง</div>
                          <div>{{ formatDate(queueData.booking_date) }}</div>
                        </div>
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">เวลาที่จอง</div>
                          <div>{{ formatTime(queueData.booking_time) }}</div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">สถานะ</div>
                          <v-chip
                            :color="getStatusColor(queueData.status)"
                            text-color="white"
                            small
                          >
                            {{ getStatusText(queueData.status) }}
                          </v-chip>
                        </div>
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">รหัสผลการทดสอบ</div>
                          <div v-if="queueData.test_results_id">
                            <v-btn
                              text
                              color="primary"
                              :to="`/test-detail/${queueData.test_results_id}`"
                              small
                            >
                              <v-icon left small>mdi-file-document-outline</v-icon>
                              ดูผลการทดสอบ #{{ queueData.test_results_id }}
                            </v-btn>
                          </div>
                          <div v-else>-</div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <h2 class="text-h5 mb-4">ข้อมูลระบบ</h2>
                <v-card outlined>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">วันที่สร้าง</div>
                          <div>{{ formatDateTime(queueData.created_at) }}</div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="mb-4">
                          <div class="text-subtitle-1 font-weight-bold mb-1">วันที่แก้ไขล่าสุด</div>
                          <div>{{ formatDateTime(queueData.updated_at) }}</div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>

      <!-- Print Layout -->
      <div v-if="showPrintDialog" class="print-content">
        <div class="print-header">
          <h1>รายละเอียดการจองคิว</h1>
          <p>วันที่พิมพ์: {{ formatDateTime(new Date()) }}</p>
        </div>

        <div class="print-info" v-if="queueData">
          <h2>ข้อมูลนักศึกษา</h2>
          <p><strong>ชื่อ-นามสกุล:</strong> {{ queueData.full_name }}</p>
          <p><strong>รหัสนักศึกษา:</strong> {{ queueData.student_id }}</p>
          <p><strong>คณะ:</strong> {{ queueData.faculty }}</p>
          <p><strong>ภาควิชา:</strong> {{ queueData.department }}</p>
          <p><strong>ชั้นปี:</strong> {{ queueData.year }}</p>
          <p><strong>เบอร์โทรศัพท์:</strong> {{ queueData.phone }}</p>
          <p><strong>อีเมล:</strong> {{ queueData.email }}</p>
          
          <h2>ข้อมูลการจองคิว</h2>
          <p><strong>วันที่จอง:</strong> {{ formatDate(queueData.booking_date) }}</p>
          <p><strong>เวลาที่จอง:</strong> {{ formatTime(queueData.booking_time) }}</p>
          <p><strong>สถานะ:</strong> {{ getStatusText(queueData.status) }}</p>
          <p>
            <strong>รหัสผลการทดสอบ:</strong>
            <template v-if="queueData.test_results_id">
              <router-link :to="`/test-detail/${queueData.test_results_id}`" class="primary--text">
                ดูผลการทดสอบ #{{ queueData.test_results_id }}
              </router-link>
            </template>
            <template v-else>-</template>
          </p>

          <h2>ข้อมูลระบบ</h2>
          <p><strong>วันที่สร้าง:</strong> {{ formatDateTime(queueData.created_at) }}</p>
          <p><strong>วันที่แก้ไขล่าสุด:</strong> {{ formatDateTime(queueData.updated_at) }}</p>
        </div>
      </div>
    </div>
  </v-layout>
</template>

<script>
import { queueAPI } from '@/services/api'

export default {
  name: 'QueueDetailView',

  data() {
    return {
      queueData: null,
      showPrintDialog: false,
      printing: false
    }
  },

  async created() {
    try {
      const id = this.$route.params.id
      const response = await queueAPI.getQueueBooking(id)
      this.queueData = response
    } catch (error) {
      console.error('Error fetching queue details:', error)
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    formatTime(time) {
      if (!time) return '-'
      return time.substring(0, 5) // แสดงแค่ชั่วโมง:นาที
    },

    formatDateTime(datetime) {
      if (!datetime) return '-'
      return new Date(datetime).toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },

    getStatusColor(status) {
      if (!status) return 'grey'
      const colors = {
        pending: 'warning',
        confirmed: 'success',
        cancelled: 'error'
      }
      return colors[status] || 'grey'
    },

    getStatusText(status) {
      if (!status) return 'ไม่ระบุ'
      const texts = {
        pending: 'รอยืนยัน',
        confirmed: 'ยืนยันแล้ว',
        cancelled: 'ยกเลิก'
      }
      return texts[status] || status
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
.queue-detail {
  padding: 20px;
}

/* Print Styles */
@media print {
  .v-app-bar,
  .v-navigation-drawer,
  .v-footer,
  .no-print {
    display: none !important;
  }

  .print-content {
    display: block !important;
  }

  .print-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .print-info {
    margin-bottom: 30px;
  }

  .print-info p {
    margin-bottom: 10px;
  }
}

.print-content {
  display: none;
  padding: 20px;
}
</style>
