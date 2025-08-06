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
              {{ status.text }}
            </v-chip>
          </v-chip-group>
        </div>




        <v-row align="center" justify="end"> 
  <v-col cols="12" md="2">

<v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="ค้นหาบทความ"
            single-line
            hide-details
            density="compact"
            class="me-2"
            style="width: 100%;"
          ></v-text-field>

  </v-col>

  <v-col cols="12" md="2">
    <v-select
            v-model="selectedCategory"
            :items="categoryOptions"
            item-title="name"
            item-value="id"
            label="หมวดหมู่"
            hide-details
            density="compact"
            class="me-2"
            style="width: 100%;"
            clearable
          ></v-select>

  </v-col>
  <v-col cols="auto">
 
    <v-btn
            color="success"
            prepend-icon="mdi-microsoft-excel"
            @click="exportExcel"
          >
            Excel
          </v-btn>
  </v-col>
  <v-col cols="auto">
    <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
          >
            เพิ่มบทความ
          </v-btn>
  </v-col>
</v-row>


      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filteredBlogs"
          :search="searchQuery"
          :loading="loading"
          :items-per-page="10"
          class="elevation-1"
          :fixed-header="true"
          :height="500"
        >
          <template #[`item.image_url`]="{ item }">
            <v-avatar size="48" color="grey lighten-2">
              <v-img
                v-if="item.image_url"
                :src="getImageUrl(item.image_url)"
                :alt="item.title"
              />
              <v-icon v-else>mdi-image</v-icon>
            </v-avatar>
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

          <template #[`item.count_view`]="{ item }">
            {{ item.count_view || 0 }} ครั้ง
          </template>

          <template #[`item.status`]="{ item }">
            <v-chip
              :color="item.status === 'published' ? 'success' : 'warning'"
              small
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
                @click="viewBlog(item)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="warning"
                @click="editBlog(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="error"
                @click="deleteBlog(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
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
                    :items="categoryOptions"
                    item-title="name"
                    item-value="id"
                    label="หมวดหมู่"
                    required
                    :rules="[v => !!v || 'กรุณาเลือกหมวดหมู่']"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <QuillEditor
                    v-model:content="formData.content"
                    contentType="html"
                    toolbar="full"
                    theme="snow"
                    :options="editorOptions"
                  />
                </v-col>
                <v-col cols="12"><br><br><br><br>
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
                  <v-select
                    v-model="formData.status"
                    :items="statusOptions"
                    item-title="text"
                    item-value="value"
                    label="สถานะการเผยแพร่"
                    required
                    :rules="[v => !!v || 'กรุณาเลือกสถานะการเผยแพร่']"
                  ></v-select>
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
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { config } from '@/config'

export default {
  name: 'BlogManager',
  components: {
    QuillEditor
  },
  setup() {
    const blogs = ref([])
    const categories = ref([])
    const categoryOptions = ref([])
    const loading = ref(false)
    const searchQuery = ref('')
    const dialog = ref(false)
    const viewDialog = ref(false)
    const selectedBlog = ref(null)
    const isEditing = ref(false)
    const valid = ref(false)
    const form = ref(null)
    const selectedStatus = ref('all')
    const selectedCategory = ref(null)
    const imagePreview = ref(null)

    const formData = ref({
      id: null,
      title: '',
      content: '',
      category_id: null,
      image: null,
      image_url: null,
      status: 'draft',
      published: false
    })

    const statusOptions = [
      { text: 'เผยแพร่', value: 'published', color: 'success' },
      { text: 'ฉบับร่าง', value: 'draft', color: 'warning' }
    ]

    const getStatusText = (status) => {
      const option = statusOptions.find(opt => opt.value === status)
      return option ? option.text : '-'
    }

    const headers = ref([
      { 
        title: 'รูปภาพ',
        align: 'center',
        key: 'image_url',
        sortable: false,
        width: '120px'
      },
      { 
        title: 'หัวข้อ',
        align: 'start',
        key: 'title',
        sortable: true
      },
      { 
        title: 'หมวดหมู่',
        align: 'start',
        key: 'category_name',
        sortable: true
      },
      { 
        title: 'จำนวนเข้าชม',
        align: 'center',
        key: 'count_view',
        sortable: true
      },
      { 
        title: 'สถานะ',
        align: 'center',
        key: 'status',
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
        sortable: false,
        width: '150px'
      }
    ])

    const filteredBlogs = computed(() => {
      let filtered = [...blogs.value]

      // Filter by status
      if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(blog => 
          selectedStatus.value === 'published' ? blog.published : !blog.published
        )
      }

      // Filter by category
      if (selectedCategory.value) {
        filtered = filtered.filter(blog => blog.category_id === selectedCategory.value)
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

    const loadCategories = async () => {
      try {
        const categories = await categoryAPI.getCategories()
        categoryOptions.value = categories.map(category => ({
          id: category.id,
          name: category.name
        }))
      } catch (error) {
        console.error('Error loading categories:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้'
        })
      }
    }

    const openCreateDialog = () => {
      isEditing.value = false
      formData.value = {
        id: null,
        title: '',
        content: '',
        category_id: null,
        image: null,
        image_url: null,
        status: 'draft',
        published: false
      }
      dialog.value = true
    }

    const editBlog = (item) => {
      isEditing.value = true
      formData.value = {
        id: item.id,
        title: item.title,
        content: item.content,
        category_id: item.category_id,
        image_url: item.image_url,
        status: item.status,
        published: item.published
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
        data.append('status', formData.value.status)
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
        item.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง',
        formatDate(item.created_at),
        formatDate(item.updated_at)
      ])

      // Add table
      doc.autoTable({
        head: [['ชื่อบทความ', 'หมวดหมู่', 'สถานะ', 'สร้างเมื่อ', 'แก้ไขล่าสุด']],
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
      const data = filteredBlogs.value.map(blog => ({
        'ชื่อบทความ': blog.title,
        'หมวดหมู่': blog.category?.name || '-',
        'จำนวนเข้าชม': blog.count_view || 0,
        'สถานะ': getStatusText(blog.status),
        'สร้างเมื่อ': formatDate(blog.created_at),
        'แก้ไขล่าสุด': formatDate(blog.updated_at)
      }))

      // Create worksheet with custom column widths
      const ws = XLSX.utils.json_to_sheet(data)
      
      // Set column widths
      ws['!cols'] = [
        { wch: 40 }, // ชื่อบทความ
        { wch: 20 }, // หมวดหมู่
        { wch: 15 }, // จำนวนเข้าชม
        { wch: 15 }, // สถานะ
        { wch: 20 }, // สร้างเมื่อ
        { wch: 20 }  // แก้ไขล่าสุด
      ]

      // Create workbook and add the worksheet
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'รายการบทความ')

      // Generate & Download Excel file
      XLSX.writeFile(wb, `รายการบทความ_${formatDate(new Date())}.xlsx`)
    }

    const getImageUrl = (imageUrl) => {
      if (!imageUrl) return null
      return `${config.BASE_URL}${imageUrl}`
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

    const editorOptions = ref({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          ['link', 'image', 'video'],
          ['clean']
        ]
      },
      placeholder: 'เขียนเนื้อหาบทความที่นี่...'
    })

    onMounted(async () => {
      await Promise.all([
        fetchBlogs(),
        loadCategories()
      ])
    })

    return {
      blogs,
      categories,
      categoryOptions,
      loading,
      searchQuery,
      dialog,
      viewDialog,
      selectedBlog,
      isEditing,
      formData,
      valid,
      form,
      selectedStatus,
      selectedCategory,
      statusOptions,
      filteredBlogs,
      headers,
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
      getImageUrl,
      getStatusText,
      editorOptions
    }
  }
}
</script>

<style scoped>
.blog-manager {
  padding:0rem;
}

.v-data-table {
  background: white;
}

.gap-2 {
  gap: 0.5rem;
}

.ql-editor {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.ql-toolbar.ql-snow,
.ql-container.ql-snow {
  border-color: rgba(0, 0, 0, 0.12) !important;
}

.ql-toolbar.ql-snow {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.ql-container.ql-snow {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.ql-editor:focus {
  outline: none;
  border-color: #1976d2 !important;
}
</style>
