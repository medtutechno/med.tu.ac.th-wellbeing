<template>
  <div>
 
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">   
              <div class="d-flex align-center">
                จัดการหมวดหมู่บทความ
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
             

 <v-row align="center" justify="end"> 
  <v-col cols="12" md="2">
    <!-- <v-text-field
  v-model="search"
  placeholder="🔍 ค้นหา"
  single-line
  hide-details
  dense
  style="width: 100%;"
/>    -->


<v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="ค้นหาบทความ"
            single-line
            hide-details
            density="compact"
            class="me-2"
            style="width: 100%;"
          ></v-text-field>



  </v-col>
  <v-col cols="auto">
    <v-btn
      color="success"
      dark
      class="mr-2"
      @click="exportExcel"
    >
      <v-icon left>mdi-microsoft-excel</v-icon>
      Excel
    </v-btn>
  </v-col>
  <v-col cols="auto">
    <v-btn
      color="primary"
      dark
      class="mr-2"
      @click="openCreateDialog"
    >
      <v-icon left>mdi-plus</v-icon>
      เพิ่มหมวดหมู่
    </v-btn>
  </v-col>
</v-row>

            </v-card-title>

            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="categories"
                :search="search"
                :loading="loading"
                :items-per-page="10"
                class="elevation-1"
              >
                <template #[`item.actions`]="{ item }">
                  <div class="d-flex gap-2">
                    <v-btn
                      icon
                      small
                      color="primary"
                      @click="editCategory(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      small
                      color="error"
                      @click="deleteCategory(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </template>

                <template #[`item.created_at`]="{ item }">
                  {{ formatDate(item.created_at) }}
                </template>

                <template #[`item.updated_at`]="{ item }">
                  {{ formatDate(item.updated_at) }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
    

    <!-- Dialog สำหรับเพิ่ม/แก้ไขหมวดหมู่ -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="ชื่อหมวดหมู่"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.description"
                  label="คำอธิบาย"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="closeDialog"
          >
            ยกเลิก
          </v-btn>
          <v-btn
            color="success"
            text
            @click="save"
          >
            บันทึก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog ยืนยันการลบ -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">ยืนยันการลบหมวดหมู่?</v-card-title>
        <v-card-text>
          การลบหมวดหมู่จะมีผลต่อบทความที่อยู่ในหมวดหมู่นี้ คุณแน่ใจหรือไม่?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="closeDelete">ยกเลิก</v-btn>
          <v-btn color="success" text @click="deleteItemConfirm">ยืนยัน</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { categoryAPI } from '@/services/api'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'

export default {
  name: 'BlogCategory',

  setup() {
    const loading = ref(false)
    const search = ref('')
    const dialog = ref(false)
    const dialogDelete = ref(false)
    const categories = ref([])
    const editedIndex = ref(-1)
    const editedItem = ref({
      id: null,
      name: '',
      description: ''
    })
    const defaultItem = {
      id: null,
      name: '',
      description: ''
    }

    const headers = ref([
      { 
        title: 'ชื่อหมวดหมู่',
        align: 'start',
        key: 'name',
        sortable: true
      },
      { 
        title: 'คำอธิบาย',
        align: 'start',
        key: 'description',
        sortable: true
      },
      { 
        title: 'จำนวนบทความ',
        align: 'center',
        key: 'article_count',
        sortable: true
      },
      { 
        title: 'วันที่สร้าง',
        align: 'start',
        key: 'created_at',
        sortable: true
      },
      { 
        title: 'วันที่แก้ไข',
        align: 'start',
        key: 'updated_at',
        sortable: true
      },
      { 
        title: 'จัดการ',
        align: 'center',
        key: 'actions',
        sortable: false
      }
    ])

    const formTitle = computed(() => {
      return editedIndex.value === -1 ? 'เพิ่มหมวดหมู่ใหม่' : 'แก้ไขหมวดหมู่'
    })

    async function initialize() {
      loading.value = true
      try {
        const response = await categoryAPI.getCategories()
        categories.value = response
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        loading.value = false
      }
    }

    function editCategory(item) {
      editedIndex.value = categories.value.indexOf(item)
      editedItem.value = Object.assign({}, item)
      dialog.value = true
    }

    function deleteCategory(item) {
      editedIndex.value = categories.value.indexOf(item)
      editedItem.value = Object.assign({}, item)
      dialogDelete.value = true
    }

    function openCreateDialog() {
      editedIndex.value = -1
      editedItem.value = Object.assign({}, defaultItem)
      dialog.value = true
    }

    function closeDialog() {
      dialog.value = false
      editedIndex.value = -1
      editedItem.value = Object.assign({}, defaultItem)
    }

    function closeDelete() {
      dialogDelete.value = false
      editedIndex.value = -1
      editedItem.value = Object.assign({}, defaultItem)
    }

    async function save() {
      try {
        if (editedIndex.value > -1) {
          await categoryAPI.updateCategory(editedItem.value.id, editedItem.value)
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'แก้ไขหมวดหมู่เรียบร้อยแล้ว',
            timer: 1500,
            showConfirmButton: false
          })
        } else {
          await categoryAPI.createCategory(editedItem.value)
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'เพิ่มหมวดหมู่เรียบร้อยแล้ว',
            timer: 1500,
            showConfirmButton: false
          })
        }
        // Refresh the categories list after creating or updating
        await initialize()
        closeDialog()
      } catch (error) {
        console.error('Error saving category:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถบันทึกข้อมูลหมวดหมู่ได้'
        })
      }
    }

    async function deleteItemConfirm() {
      try {
        await categoryAPI.deleteCategory(editedItem.value.id)
        // Refresh the categories list after deleting
        await initialize()
        closeDelete()
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'ลบหมวดหมู่เรียบร้อยแล้ว',
          timer: 1500,
          showConfirmButton: false
        })
      } catch (error) {
        console.error('Error deleting category:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถลบหมวดหมู่ได้'
        })
      }
    }

    function formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    function exportPDF() {
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(16)
      doc.text('รายงานหมวดหมู่บทความ', 14, 15)

      // Add table
      const tableData = categories.value.map(item => [
        item.name,
        item.description || '-',
        formatDate(item.created_at),
        formatDate(item.updated_at)
      ])

      doc.autoTable({
        head: [['ชื่อหมวดหมู่', 'คำอธิบาย', 'วันที่สร้าง', 'วันที่แก้ไข']],
        body: tableData,
        startY: 25,
        theme: 'grid',
        styles: { font: 'THSarabunNew', fontSize: 10 }
      })

      doc.save('blog-categories-report.pdf')
    }

    function exportExcel() {
      const data = categories.value.map(item => ({
        'ชื่อหมวดหมู่': item.name,
        'คำอธิบาย': item.description || '-',
        'วันที่สร้าง': formatDate(item.created_at),
        'วันที่แก้ไข': formatDate(item.updated_at)
      }))

      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Categories')
      XLSX.writeFile(wb, 'blog-categories-report.xlsx')
    }

    onMounted(() => {
      initialize()
    })

    return {
      loading,
      search,
      dialog,
      dialogDelete,
      categories,
      headers,
      editedItem,
      formTitle,
      editCategory,
      deleteCategory,
      openCreateDialog,
      closeDialog,
      closeDelete,
      save,
      deleteItemConfirm,
      formatDate,
      exportPDF,
      exportExcel
    }
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>
