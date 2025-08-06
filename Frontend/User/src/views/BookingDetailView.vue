<template>
  <div class="booking-detail">
    <v-container>
      <v-card class="mx-auto" max-width="1200">
        <v-app-bar flat color="primary" dark>
          <v-toolbar-title class="text-h6">
            รายละเอียดการจอง
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="print" class="mr-2">
            <v-icon left>mdi-printer</v-icon>
            พิมพ์
          </v-btn>
          <v-btn color="white" text @click="$router.push('/queue-management')">
            <v-icon left>mdi-arrow-left</v-icon>
            กลับ
          </v-btn>
        </v-app-bar>

        <v-card-text v-if="bookingData" class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-card outlined class="mb-6">
                <v-card-title class="subtitle-1 font-weight-bold">
                  <v-icon left color="primary">mdi-account</v-icon>
                  ข้อมูลผู้จอง
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <div class="text-subtitle-1">
                        <strong>ชื่อ-นามสกุล:</strong> {{ bookingData.fullName }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="text-subtitle-1">
                        <strong>เบอร์โทรศัพท์:</strong> {{ bookingData.phone }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="text-subtitle-1">
                        <strong>อีเมล:</strong> {{ bookingData.email }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="text-subtitle-1">
                        <strong>Line ID:</strong> {{ bookingData.lineId }}
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12">
              <v-card outlined class="mb-6">
                <v-card-title class="subtitle-1 font-weight-bold">
                  <v-icon left color="primary">mdi-calendar</v-icon>
                  รายละเอียดการจอง
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <div class="text-subtitle-1">
                        <strong>วันที่จอง:</strong> {{ formatDate(bookingData.bookingDate) }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="text-subtitle-1">
                        <strong>เวลา:</strong> {{ bookingData.bookingTime }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="text-subtitle-1">
                        <strong>ประเภทการรักษา:</strong> {{ bookingData.treatmentType }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="text-subtitle-1">
                        <strong>สถานะ:</strong>
                        <v-chip
                          :color="getStatusColor(bookingData.status)"
                          text-color="white"
                          small
                        >
                          {{ bookingData.status }}
                        </v-chip>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="text-subtitle-1">
                        <strong>หมายเหตุ:</strong>
                        <div class="mt-2">{{ bookingData.notes || '-' }}</div>
                      </div>
                    </v-col>
                  </v-row>
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
    <teleport to="body">
      <div v-if="showPrintDialog" style="display: none;">
        <div class="print-content">
          <div class="print-header">
            <h1>รายละเอียดการจอง</h1>
            <p>วันที่พิมพ์: {{ formatDate(new Date()) }}</p>
          </div>

          <div v-if="bookingData" class="print-section">
            <h2>ข้อมูลผู้จอง</h2>
            <div class="print-item">
              <strong>ชื่อ-นามสกุล:</strong> {{ bookingData.fullName }}
            </div>
            <div class="print-item">
              <strong>เบอร์โทรศัพท์:</strong> {{ bookingData.phone }}
            </div>
            <div class="print-item">
              <strong>อีเมล:</strong> {{ bookingData.email }}
            </div>
            <div class="print-item">
              <strong>Line ID:</strong> {{ bookingData.lineId }}
            </div>

            <h2>รายละเอียดการจอง</h2>
            <div class="print-item">
              <strong>วันที่จอง:</strong> {{ formatDate(bookingData.bookingDate) }}
            </div>
            <div class="print-item">
              <strong>เวลา:</strong> {{ bookingData.bookingTime }}
            </div>
            <div class="print-item">
              <strong>ประเภทการรักษา:</strong> {{ bookingData.treatmentType }}
            </div>
            <div class="print-item">
              <strong>สถานะ:</strong> {{ bookingData.status }}
            </div>
            <div class="print-item">
              <strong>หมายเหตุ:</strong>
              <div class="mt-2">{{ bookingData.notes || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'BookingDetailView',
  data() {
    return {
      bookingData: null,
      showPrintDialog: false
    }
  },

  async created() {
    try {
      const response = await this.$api.get(`/bookings/${this.$route.params.id}`)
      this.bookingData = response.data
    } catch (error) {
      console.error('Error fetching booking details:', error)
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

    getStatusColor(status) {
      const colors = {
        'รอยืนยัน': 'warning',
        'ยืนยันแล้ว': 'success',
        'ยกเลิก': 'error',
        'เสร็จสิ้น': 'info'
      }
      return colors[status] || 'grey'
    },

    print() {
      this.showPrintDialog = true
      this.$nextTick(() => {
        window.print()
        this.showPrintDialog = false
      })
    }
  }
}
</script>

<style>
.print-content {
  font-family: 'Sarabun', sans-serif;
  padding: 20px;
}

.print-header {
  text-align: center;
  margin-bottom: 30px;
}

.print-section {
  margin-bottom: 30px;
}

.print-item {
  margin-bottom: 15px;
}

@media print {
  body * {
    visibility: hidden;
  }
  
  .print-content,
  .print-content * {
    visibility: visible;
  }
  
  .print-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
