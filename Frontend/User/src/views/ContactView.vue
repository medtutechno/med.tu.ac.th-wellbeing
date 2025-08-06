<template>
  <div class="contact-table">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          ข้อความติดต่อ
          <v-chip-group
            v-model="selectedStatus"
            class="ms-4"
            mandatory
          >
            <v-chip
              v-for="status in statusOptions"
              :key="status.value"
              :value="status.value"
              :color="status.color"
              filter
              variant="outlined"
            >
              {{ status.label }}
            </v-chip>
          </v-chip-group>
        </div>
        <div class="d-flex gap-2">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="ค้นหา"
            single-line
            hide-details
            density="compact"
            class="me-2"
            style="width: 300px"
            clearable
          ></v-text-field>
          <v-btn
            color="success"
            prepend-icon="mdi-microsoft-excel"
            @click="exportExcel"
          >
            Excel
          </v-btn>
          <!-- <v-btn
            color="error"
            prepend-icon="mdi-file-pdf-box"
            @click="exportPDF"
          >
            PDF
          </v-btn> -->
        </div>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filteredContacts"
          :loading="loading"
          :items-per-page="10"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:no-data>
            <div class="d-flex flex-column align-center py-6">
              <v-icon size="64" color="grey">mdi-alert-circle-outline</v-icon>
              <div class="text-grey mt-2">ไม่พบข้อมูล</div>
            </div>
          </template>
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.full_name }}</td>
              <td>{{ item.email }}</td>
              <td>
                <div class="text-truncate" style="max-width: 300px;">
                  {{ item.message }}
                </div>
              </td>
              <td class="text-center">
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="small"
                >
                  {{ getStatusLabel(item.status) }}
                </v-chip>
              </td>
              <td class="text-center">{{ formatDate(item.created_at) }}</td>
              <td class="text-center">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      size="small"
                      v-bind="props"
                    />
                  </template>
                  <v-list>
                    <v-list-item
                      @click="viewDetails(item)"
                    >
                      <v-list-item-title>
                        <v-icon start icon="mdi-eye"></v-icon>
                        ดูรายละเอียด
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="updateStatus(item)"
                    >
                      <v-list-item-title>
                        <v-icon start icon="mdi-pencil"></v-icon>
                        อัพเดทสถานะ
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="deleteContact(item)"
                      color="error"
                    >
                      <v-list-item-title>
                        <v-icon start icon="mdi-delete"></v-icon>
                        ลบข้อความ
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- View Details Dialog -->
    <v-dialog
      v-model="detailsDialog"
      max-width="600px"
    >
      <v-card v-if="selectedContact">
        <v-card-title>รายละเอียดข้อความ</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-account" class="me-3"></v-icon>
              </template>
              <v-list-item-title>ชื่อผู้ติดต่อ</v-list-item-title>
              <v-list-item-subtitle>{{ selectedContact.full_name }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-email" class="me-3"></v-icon>
              </template>
              <v-list-item-title>อีเมล</v-list-item-title>
              <v-list-item-subtitle>{{ selectedContact.email }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-clock" class="me-3"></v-icon>
              </template>
              <v-list-item-title>เวลา</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(selectedContact.created_at) }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-message" class="me-3"></v-icon>
              </template>
              <v-list-item-title>ข้อความ</v-list-item-title>
              <v-list-item-subtitle class="mt-2" style="white-space: pre-wrap;">{{ selectedContact.message }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="detailsDialog = false"
          >
            ปิด
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Update Status Dialog -->
    <v-dialog
      v-model="statusDialog"
      max-width="400px"
    >
      <v-card v-if="selectedContact">
        <v-card-title>อัพเดทสถานะ</v-card-title>
        <v-card-text>
          <v-select
            v-model="newStatus"
            :items="statusOptions.filter(opt => opt.value !== 'all')"
            item-title="label"
            item-value="value"
            label="เลือกสถานะ"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="text"
            @click="statusDialog = false"
          >
            ยกเลิก
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="confirmUpdateStatus"
          >
            บันทึก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import { contactAPI } from '@/services/api'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default {
  name: 'ContactTable',
  setup() {
    const loading = ref(false)
    const contacts = ref([])
    const selectedContact = ref(null)
    const detailsDialog = ref(false)
    const statusDialog = ref(false)
    const newStatus = ref('')
    const selectedStatus = ref('all')
    const search = ref('')

    const statusOptions = [
      { label: 'ทั้งหมด', value: 'all', color: 'grey' },
      { label: 'รอดำเนินการ', value: 'pending', color: 'warning' },
      { label: 'กำลังดำเนินการ', value: 'in_progress', color: 'info' },
      { label: 'เสร็จสิ้น', value: 'resolved', color: 'success' }
    ]

    const headers = [
      { title: 'ชื่อผู้ติดต่อ', align: 'start', key: 'full_name' },
      { title: 'อีเมล', align: 'start', key: 'email' },
      { title: 'ข้อความ', align: 'start', key: 'message' },
      { title: 'สถานะ', align: 'center', key: 'status' },
      { title: 'วันที่', align: 'center', key: 'created_at' },
      { title: 'จัดการ', key: 'actions', sortable: false, align: 'center' }
    ]

    const filteredContacts = computed(() => {
      if (!search.value) return contacts.value
      return contacts.value.filter(item => {
        return (
          item.full_name.toLowerCase().includes(search.value.toLowerCase()) ||
          item.email.toLowerCase().includes(search.value.toLowerCase()) ||
          item.message.toLowerCase().includes(search.value.toLowerCase())
        )
      })
    })

    // Fetch contacts when status changes
    watch(selectedStatus, async (newValue) => {
      await fetchContacts(newValue === 'all' ? '' : newValue)
    })

    const fetchContacts = async (status = '') => {
      try {
        loading.value = true
        contacts.value = await contactAPI.getContacts(status)
      } catch (error) {
        console.error('Error fetching contacts:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.message
        })
      } finally {
        loading.value = false
      }
    }

    const viewDetails = (contact) => {
      selectedContact.value = contact
      detailsDialog.value = true
    }

    const updateStatus = (contact) => {
      selectedContact.value = contact
      newStatus.value = contact.status
      statusDialog.value = true
    }

    const confirmUpdateStatus = async () => {
      try {
        await contactAPI.updateContactStatus(selectedContact.value.id, newStatus.value)
        await fetchContacts(selectedStatus.value === 'all' ? '' : selectedStatus.value)
        statusDialog.value = false
        Swal.fire({
          icon: 'success',
          title: 'อัพเดทสถานะสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        console.error('Error updating status:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.message
        })
      }
    }

    const deleteContact = async (contact) => {
      const result = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: 'คุณต้องการลบข้อความนี้ใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ลบเลย',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      })

      if (result.isConfirmed) {
        try {
          await contactAPI.deleteContact(contact.id)
          await fetchContacts(selectedStatus.value === 'all' ? '' : selectedStatus.value)
          Swal.fire({
            icon: 'success',
            title: 'ลบข้อความสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        } catch (error) {
          console.error('Error deleting contact:', error)
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: error.message
          })
        }
      }
    }

    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getStatusColor = (status) => {
      const statusOption = statusOptions.find(opt => opt.value === status)
      return statusOption ? statusOption.color : 'grey'
    }

    const getStatusLabel = (status) => {
      const statusOption = statusOptions.find(opt => opt.value === status)
      return statusOption ? statusOption.label : status
    }

    const exportPDF = () => {
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(16)
      doc.text('รายงานข้อความติดต่อ', 14, 15)
      
      // Add date
      doc.setFontSize(10)
      doc.text(`วันที่: ${new Date().toLocaleDateString('th-TH')}`, 14, 25)
      
      // Prepare table data
      const tableData = contacts.value.map(item => [
        item.full_name,
        item.email,
        item.message,
        getStatusLabel(item.status),
        formatDate(item.created_at)
      ])
      
      // Add table
      doc.autoTable({
        head: [['ชื่อผู้ติดต่อ', 'อีเมล', 'ข้อความ', 'สถานะ', 'วันที่']],
        body: tableData,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [44, 62, 80] },
        styles: { font: 'Sarabun' }
      })
      
      // Save PDF
      doc.save('contact-messages.pdf')
    }

    const exportExcel = () => {
      // Prepare data
      const data = contacts.value.map(item => ({
        'ชื่อผู้ติดต่อ': item.full_name,
        'อีเมล': item.email,
        'ข้อความ': item.message,
        'สถานะ': getStatusLabel(item.status),
        'วันที่': formatDate(item.created_at)
      }))
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data)
      
      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'ข้อความติดต่อ')
      
      // Save Excel file
      XLSX.writeFile(wb, 'contact-messages.xlsx')
    }

    onMounted(() => {
      fetchContacts()
    })

    return {
      loading,
      contacts,
      headers,
      selectedContact,
      detailsDialog,
      statusDialog,
      newStatus,
      selectedStatus,
      statusOptions,
      search,
      filteredContacts,
      viewDetails,
      updateStatus,
      confirmUpdateStatus,
      deleteContact,
      formatDate,
      getStatusColor,
      getStatusLabel,
      exportPDF,
      exportExcel
    }
  }
}
</script>

<style scoped>
.contact-table {
  padding:0rem;
}

.v-data-table {
  background: white;
}

.gap-2 {
  gap: 0.5rem;
}
</style>