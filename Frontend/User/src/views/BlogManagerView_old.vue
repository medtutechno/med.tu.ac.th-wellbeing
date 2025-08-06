<template>
  <div class="blog-manager">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          จัดการบทความ
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
        <div class="d-flex gap-4">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="ค้นหาบทความ"
            single-line
            hide-details
            density="compact"
            class="me-2"
            style="max-width: 300px;"
          ></v-text-field>
          <v-btn
            color="success"
            prepend-icon="mdi-microsoft-excel"
            @click="exportExcel"
          >
            Excel
          </v-btn>
          <v-btn
            color="error"
            prepend-icon="mdi-file-pdf-box"
            @click="exportPDF"
          >
            PDF
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
          >
            เพิ่มบทความ
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filteredBlogs"
          :search="searchQuery"
          :items-per-page="10"
          class="elevation-1"
        >
          <template #[`item.image_url`]="{ item }">
            <v-img
              v-if="item.image_url"
              :src="getImageUrl(item.image_url)"
              max-width="100"
              max-height="100"
              cover
              class="ma-2"
            >
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
            <span v-else>ไม่มีรูปภาพ</span>
          </template>

          <template #[`item.published`]="{ item }">
            <v-chip
              :color="item.published ? 'success' : 'warning'"
              :text="item.published ? 'เผยแพร่' : 'ไม่เผยแพร่'"
              size="small"
            ></v-chip>
          </template>

          <template #[`item.created_at`]="{ item }">
            {{ formatDate(item.created_at) }}
          </template>

          <template #[`item.updated_at`]="{ item }">
            {{ formatDate(item.updated_at) }}
          </template>

          <template #[`item.actions`]="{ item }">
            <v-btn
              icon="mdi-pencil"
              size="small"
              color="primary"
              class="mr-2"
              @click="editBlog(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              size="small"
              color="error"
              @click="deleteBlog(item)"
            ></v-btn>
            <v-btn
              icon="mdi-publish"
              size="small"
              :color="item.published ? 'warning' : 'success'"
              class="ml-2"
              @click="togglePublish(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog
      v-model="dialog"
      max-width="800px"
      :retain-focus="false"
      scrollable
    >
      <v-card>
        <v-card-title>{{ isEditing ? 'แก้ไขบทความ' : 'เพิ่มบทความใหม่' }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.title"
                    label="ชื่อบทความ"
                    required
                    :rules="[v => !!v || 'กรุณากรอกชื่อบทความ']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="formData.category_id"
                    :items="categories"
                    item-title="name"
                    item-value="id"
                    label="หมวดหมู่"
                    required
                    :rules="[v => !!v || 'กรุณาเลือกหมวดหมู่']"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.content"
                    label="เนื้อหา"
                    required
                    :rules="[v => !!v || 'กรุณากรอกเนื้อหา']"
                    rows="10"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="formData.image"
                    accept="image/*"
                    label="รูปภาพ"
                    prepend-icon="mdi-camera"
                    @change="handleImageChange"
                    :show-size="true"
                  >
                    <template v-slot:selection="{ fileNames }">
                      <template v-for="fileName in fileNames" :key="fileName">
                        <v-chip
                          size="small"
                          label
                          color="primary"
                          class="me-2"
                        >
                          {{ fileName }}
                        </v-chip>
                      </template>
                    </template>
                  </v-file-input>
                </v-col>
                <v-col cols="12" v-if="imagePreview">
                  <v-img
                    :src="imagePreview"
                    max-height="200"
                    contain
                  ></v-img>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="formData.published"
                    label="เผยแพร่บทความ"
                    color="success"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="text"
            @click="dialog = false"
          >
            ยกเลิก
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="saveBlog"
            :disabled="!valid"
          >
            บันทึก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Blog Dialog -->
    <v-dialog
      v-model="viewDialog"
      max-width="800px"
    >
      <v-card v-if="selectedBlog">
        <v-card-title>{{ selectedBlog.title }}</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-folder" class="me-3"></v-icon>
              </template>
              <v-list-item-title>หมวดหมู่</v-list-item-title>
              <v-list-item-subtitle>{{ selectedBlog.category?.name || '-' }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-clock" class="me-3"></v-icon>
              </template>
              <v-list-item-title>สร้างเมื่อ</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(selectedBlog.created_at) }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-update" class="me-3"></v-icon>
              </template>
              <v-list-item-title>แก้ไขล่าสุด</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(selectedBlog.updated_at) }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-text" class="me-3"></v-icon>
              </template>
              <v-list-item-title>เนื้อหา</v-list-item-title>
              <v-list-item-subtitle class="mt-2" style="white-space: pre-wrap;">{{ selectedBlog.content }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="viewDialog = false"
          >
            ปิด
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { blogAPI, categoryAPI } from '@/services/api'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default {
  name: 'BlogManager',
  setup() {
    const loading = ref(false)
    const blogs = ref([])
    const categories = ref([])
    const dialog = ref(false)
    const viewDialog = ref(false)
    const selectedBlog = ref(null)
    const isEditing = ref(false)
    const valid = ref(false)
    const form = ref(null)
    const searchQuery = ref('')
    const selectedStatus = ref('all')
    const imagePreview = ref(null)

    const formData = ref({
      title: '',
      content: '',
      category_id: null,
      image: null,
      published: false
    })

    const statusOptions = [
      { label: 'ทั้งหมด', value: 'all', color: 'grey' },
      { label: 'ฉบับร่าง', value: 'draft', color: 'warning' },
      { label: 'เผยแพร่', value: 'published', color: 'success' }
    ]

    const headers = ref([
      { title: 'ชื่อบทความ', key: 'title', align: 'start', sortable: true },
      { title: 'รูปภาพ', key: 'image_url', align: 'center', sortable: false },
      { title: 'หมวดหมู่', key: 'category.name', align: 'start', sortable: true },
      { title: 'เนื้อหา', key: 'content', align: 'start', sortable: false },
      { title: 'สถานะ', key: 'published', align: 'center', sortable: true },
      { title: 'สร้างเมื่อ', key: 'created_at', align: 'center', sortable: true },
      { title: 'แก้ไขล่าสุด', key: 'updated_at', align: 'center', sortable: true },
      { title: 'จัดการ', key: 'actions', align: 'center', sortable: false }
    ])

    const filteredBlogs = computed(() => {
      let filtered = [...blogs.value]

      // Filter by status
      if (selectedStatus.value !== 'all') {
        const isPublished = selectedStatus.value === 'published'
        filtered = filtered.filter(blog => blog.published === isPublished)
      }

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(blog =>
          blog.title.toLowerCase().includes(query) ||
          blog.content.toLowerCase().includes(query) ||
          blog.category?.name.toLowerCase().includes(query)
        )
      }

      return filtered
    })

    const fetchBlogs = async () => {
      try {
        loading.value = true
        blogs.value = await blogAPI.getBlogs()
      } catch (error) {
        console.error('Error fetching blogs:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.message
        })
      } finally {
        loading.value = false
      }
    }

    const fetchCategories = async () => {
      try {
        categories.value = await categoryAPI.getCategories()
      } catch (error) {
        console.error('Error fetching categories:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.message
        })
      }
    }

    const openCreateDialog = () => {
      isEditing.value = false
      formData.value = {
        title: '',
        content: '',
        category_id: null,
        image: null,
        published: false
      }
      dialog.value = true
    }

    const editBlog = (blog) => {
      isEditing.value = true
      formData.value = {
        ...blog,
        category_id: blog.category?.id
      }
      if (blog.image_url) {
        imagePreview.value = getImageUrl(blog.image_url)
      }
      dialog.value = true
    }

    const viewBlog = (blog) => {
      selectedBlog.value = blog
      viewDialog.value = true
    }

    const saveBlog = async () => {
      if (!form.value.validate()) return

      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user?.id) {
          throw new Error('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่')
        }

        const data = new FormData()
        data.append('title', formData.value.title)
        data.append('content', formData.value.content)
        data.append('category_id', formData.value.category_id)
        data.append('author_id', user.id)
        data.append('published', formData.value.published)

        if (formData.value.image) {
          data.append('image', formData.value.image)
        }

        if (isEditing.value) {
          await blogAPI.updateBlog(formData.value.id, data)
        } else {
          await blogAPI.createBlog(data)
        }

        dialog.value = false
        await fetchBlogs()

        Swal.fire({
          icon: 'success',
          title: `${isEditing.value ? 'แก้ไข' : 'เพิ่ม'}บทความสำเร็จ`,
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        console.error('Error saving blog:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.message
        })
      }
    }

    const togglePublish = async (blog) => {
      try {
        await blogAPI.updateBlog(blog.id, {
          ...blog,
          published: !blog.published
        })
        await fetchBlogs()

        Swal.fire({
          icon: 'success',
          title: `${blog.published ? 'ยกเลิกการเผยแพร่' : 'เผยแพร่'}บทความสำเร็จ`,
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        console.error('Error toggling publish:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.message
        })
      }
    }

    const deleteBlog = async (blog) => {
      const result = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: 'คุณต้องการลบบทความนี้ใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ลบเลย',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      })

      if (result.isConfirmed) {
        try {
          await blogAPI.deleteBlog(blog.id)
          await fetchBlogs()
          Swal.fire({
            icon: 'success',
            title: 'ลบบทความสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        } catch (error) {
          console.error('Error deleting blog:', error)
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

    const exportPDF = () => {
      const doc = new jsPDF()

      // Add title
      doc.setFontSize(16)
      doc.text('รายงานบทความ', 14, 15)

      // Add date
      doc.setFontSize(10)
      doc.text(`วันที่: ${new Date().toLocaleDateString('th-TH')}`, 14, 25)

      // Prepare table data
      const tableData = filteredBlogs.value.map(item => [
        item.title,
        item.category?.name || '-',
        item.content,
        item.published ? 'เผยแพร่' : 'ฉบับร่าง',
        formatDate(item.created_at),
        formatDate(item.updated_at)
      ])

      // Add table
      doc.autoTable({
        head: [['ชื่อบทความ', 'หมวดหมู่', 'เนื้อหา', 'สถานะ', 'สร้างเมื่อ', 'แก้ไขล่าสุด']],
        body: tableData,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [44, 62, 80] },
        styles: { font: 'Sarabun' }
      })

      // Save PDF
      doc.save('blogs.pdf')
    }

    const exportExcel = () => {
      // Prepare data
      const data = filteredBlogs.value.map(item => ({
        'ชื่อบทความ': item.title,
        'หมวดหมู่': item.category?.name || '-',
        'เนื้อหา': item.content,
        'สถานะ': item.published ? 'เผยแพร่' : 'ฉบับร่าง',
        'สร้างเมื่อ': formatDate(item.created_at),
        'แก้ไขล่าสุด': formatDate(item.updated_at)
      }))

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data)

      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'บทความ')

      // Save Excel file
      XLSX.writeFile(wb, 'blogs.xlsx')
    }

    const getImageUrl = (imageUrl) => {
      if (!imageUrl) return null
      return `https://api.sinothaitrade.com${imageUrl}`
    }

    const handleImageChange = (files) => {
      if (!files) {
        imagePreview.value = null
        return
      }

      // v-file-input ส่ง FileList มา ต้องเอาตัวแรก
      const file = Array.isArray(files) ? files[0] : files

      if (file && file instanceof File) {
        // สร้าง URL สำหรับ preview
        imagePreview.value = URL.createObjectURL(file)
      } else {
        imagePreview.value = null
      }
    }

    // Clear URL เมื่อ component unmount
    onUnmounted(() => {
      if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value)
      }
    })

    onMounted(async () => {
      await Promise.all([
        fetchBlogs(),
        fetchCategories()
      ])
    })

    return {
      loading,
      blogs,
      categories,
      headers,
      dialog,
      viewDialog,
      selectedBlog,
      isEditing,
      formData,
      valid,
      form,
      searchQuery,
      selectedStatus,
      statusOptions,
      filteredBlogs,
      openCreateDialog,
      editBlog,
      viewBlog,
      saveBlog,
      togglePublish,
      deleteBlog,
      formatDate,
      exportPDF,
      exportExcel,
      imagePreview,
      handleImageChange,
      getImageUrl
    }
  }
}
</script>

<style scoped>
.blog-manager {
  padding: 1rem;
}

.v-data-table {
  background: white;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
