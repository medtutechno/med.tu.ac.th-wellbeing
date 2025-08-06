<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <div>จัดการคิว</div>
      <!-- <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="ค้นหา"
        single-line
        hide-details
        style="max-width: 300px"
      ></v-text-field> -->
      <v-row align="center" justify="end"> 
  <v-col cols="12" md="2">
      <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="ค้นหา"
            single-line
            hide-details
            density="compact"
           
            style="width:100%"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="auto">
      <v-btn
        color="success"
        class="mr-2"
        @click="exportExcel"
        :loading="loading"
      >
        <v-icon left>mdi-microsoft-excel</v-icon>
        Excel
      </v-btn>
    </v-col>
    </v-row>
    </v-card-title>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="queues"
        :search="search"
        :loading="loading"
        :items-per-page="10"
        class="elevation-1"
      >
        <template #[`item.booking_date`]="{ item }">
          {{ formatDate(item.booking_date) }}
        </template>

        <template #[`item.booking_time`]="{ item }">
          {{ formatTime(item.booking_time) }}
        </template>

        <template #[`item.status`]="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            small
            @click="openStatusDialog(item)"
            style="cursor: pointer"
          >
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="d-flex gap-2">
            <v-btn
              icon
              small
              color="info"
              @click="viewQueueDetail(item)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              icon
              small
              color="warning"
              @click="openStatusDialog(item)"
            >
              <v-icon>mdi-pencil-box</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <!-- Dialog สำหรับเปลี่ยนสถานะ -->
  <v-dialog v-model="statusDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">เปลี่ยนสถานะคิว</span>
      </v-card-title>

      <v-card-text>
        <div class="d-flex flex-column gap-2">
          <v-btn
            v-for="option in statusOptions"
            :key="option.value"
            :color="option.color"
            block
            class="mt-2"
            @click="updateStatus(option.value)"
            :loading="loading"
          >
            {{ option.text }}
          </v-btn>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          text
          @click="statusDialog = false"
        >
          ปิด
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { queueAPI } from '@/services/api'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'

export default {
  name: 'QueueManagementView',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const queues = ref([])
    const search = ref('')
    const statusDialog = ref(false)
    const selectedQueue = ref(null)

    const statusOptions = [
      { text: 'รอดำเนินการ', value: 'pending', color: 'warning' },
      { text: 'กำลังดำเนินการ', value: 'in_progress', color: 'info' },
      { text: 'เสร็จสิ้น', value: 'completed', color: 'success' },
      { text: 'ยกเลิก', value: 'cancelled', color: 'error' }
    ]

    const getStatusText = (status) => {
      const option = statusOptions.find(opt => opt.value === status)
      return option ? option.text : status
    }

    const getStatusColor = (status) => {
      const option = statusOptions.find(opt => opt.value === status)
      return option ? option.color : 'grey'
    }

    const openStatusDialog = (item) => {
      selectedQueue.value = item
      statusDialog.value = true
    }

    const updateStatus = async (newStatus) => {
      try {
        loading.value = true
        await queueAPI.updateQueueStatus(selectedQueue.value.id, newStatus)
        await fetchQueueBookings()
        statusDialog.value = false
        Swal.fire({
          icon: 'success',
          title: 'อัพเดทสถานะสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        console.error('Error updating queue status:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.message
        })
      } finally {
        loading.value = false
      }
    }

    // กำหนดหัวตาราง
    const headers = ref([
      { 
        title: 'ชื่อ-นามสกุล',
        align: 'start',
        key: 'full_name',
        sortable: true
      },
      { 
        title: 'เบอร์โทรศัพท์',
        align: 'start',
        key: 'phone',
        sortable: true
      },
      { 
        title: 'อีเมล',
        align: 'start',
        key: 'email',
        sortable: true
      },
      { 
        title: 'วันที่จอง',
        align: 'start',
        key: 'booking_date',
        sortable: true
      },
      { 
        title: 'เวลาที่จอง',
        align: 'start',
        key: 'booking_time',
        sortable: true
      },
      { 
        title: 'สถานะ',
        align: 'start',
        key: 'status',
        sortable: true
      },
      { 
        title: 'การจัดการ',
        align: 'center',
        key: 'actions',
        sortable: false
      }
    ])

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '-'
        
        // แปลงเป็นวันที่ภาษาไทย
        const thaiDate = date.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        
        // แปลงเวลาเป็น HH:mm
        const time = date.toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
        
        return `${thaiDate} เวลา ${time}`
      } catch {
        return '-'
      }
    }

    const formatTime = (timeString) => {
      if (!timeString) return '-'
      try {
        // ถ้าเป็นเวลาในรูปแบบ HH:mm หรือ HH:mm:ss
        if (timeString.includes(':')) {
          const [hours, minutes] = timeString.split(':')
          return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
        }
        // ถ้าเป็น timestamp
        const date = new Date(timeString)
        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })
        }
        return '-'
      } catch {
        return '-'
      }
    }

    const viewQueueDetail = (item) => {
      router.push(`/queue-detail/${item.id}`)
    }

    const exportExcel = () => {
      // Prepare data
      const data = queues.value.map(queue => ({
        'วันที่จอง': formatDate(queue.created_at),
        'ชื่อ-นามสกุล': queue.full_name || '-',
        'เบอร์โทรศัพท์': queue.phone || '-',
        'สถานะ': getStatusText(queue.status),
        'หมายเหตุ': queue.note || '-',
        'วันที่นัด': formatDate(queue.booking_date),
        'เวลานัด': formatTime(queue.booking_time)
      }))

      // Create worksheet with custom column widths
      const ws = XLSX.utils.json_to_sheet(data)
      
      // Set column widths
      ws['!cols'] = [
        { wch: 35 }, // วันที่จอง
        { wch: 25 }, // ชื่อ-นามสกุล
        { wch: 15 }, // เบอร์โทรศัพท์
        { wch: 15 }, // สถานะ
        { wch: 30 }, // หมายเหตุ
        { wch: 35 }, // วันที่นัด
        { wch: 15 }  // เวลานัด
      ]

      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'รายการคิว')

      // Save Excel file with current date
      const now = new Date()
      const fileName = `รายการคิว_${now.toLocaleDateString('th-TH')}.xlsx`
      XLSX.writeFile(wb, fileName)
    }

    const fetchQueueBookings = async () => {
      loading.value = true
      try {
        const response = await queueAPI.getQueueBookings()
        queues.value = response
      } catch (error) {
        console.error('Error fetching queue bookings:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchQueueBookings()
    })

    return {
      loading,
      search,
      headers,
      queues,
      formatDate,
      formatTime,
      getStatusText,
      getStatusColor,
      openStatusDialog,
      updateStatus,
      statusDialog,
      selectedQueue,
      statusOptions,
      viewQueueDetail,
      exportExcel
    }
  }
}
</script>

<style scoped>
.queue-management {
  padding: 20px;
}
</style>
