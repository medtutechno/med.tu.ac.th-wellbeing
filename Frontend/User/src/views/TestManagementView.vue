<template>
  <v-card style="padding: 0rem;">
    <v-card-title class="d-flex justify-space-between align-center">
      <div>จัดการแบบทดสอบ</div>
      <v-row align="center" justify="end"> 
        <v-col cols="12" md="2"> <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
            label="ค้นหา"
            single-line
            hide-details
            density="compact"
            class="me-2"
       
            clearable
        style="width: 100%;"
      ></v-text-field>
</v-col>
<v-col cols="auto">
      <v-btn
            color="success"
            prepend-icon="mdi-microsoft-excel"
            @click="exportExcel"
          >
            Excel
          </v-btn></v-col>
      <!-- <v-btn
        icon
        small
        color="primary"
        @click="exportExcel"
      >
        <v-icon>mdi-file-excel</v-icon>
      </v-btn> -->
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="tests"
        :search="search"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:no-data>
          <div class="text-center">ไม่พบข้อมูล</div>
        </template>

        <template v-slot:loading>
          <div class="text-center">กำลังโหลดข้อมูล...</div>
        </template>

        <template #[`item.created_at`]="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template #[`item.dass21_result`]="{ item }">
          <v-chip
            :color="getDassLevelColor(item.dass21_result)"
            small
          >
            {{ getDassLevelText(item.dass21_result) }}
          </v-chip>
        </template>

        <template #[`item.eightq_result`]="{ item }">
          <v-chip
            :color="getQ8LevelColor(item.eightq_result)"
            small
          >
            {{ getQ8LevelText(item.eightq_result) }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            icon
            small
            color="primary"
            @click="viewTestDetail(item)"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import * as XLSX from 'xlsx'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { testAPI } from '@/services/api'

export default {
  name: 'TestManagementView',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const search = ref('')
    const tests = ref([])

    const headers = [
      { title: 'ชื่อ-นามสกุล', key: 'name', align: 'start' },
      { title: 'วันที่ทำแบบทดสอบ', key: 'created_at', align: 'start' },
      { title: 'DASS-21', key: 'dass21_result', align: 'center' },
      { title: '8Q', key: 'eightq_result', align: 'center' },
      { title: 'การจัดการ', key: 'actions', sortable: false, align: 'center' }
    ]

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '-'
        return date.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return '-'
      }
    }

    const parseTestResult = (resultString) => {
      try {
        if (!resultString) return null
        const result = JSON.parse(resultString)
        return result?.summary?.assessmentDASS21?.scores || null
      } catch (e) {
        console.error('Error parsing test result:', e)
        return null
      }
    }

    const getDass21Result = (result) => {
      if (!result) return null
      try {
        const data = JSON.parse(result)
        const scores = data.summary.assessmentDASS21.scores
        const maxLevel = Object.values(scores).reduce((max, score) => {
          return score.level === 'มีอาการมากที่สุด' ? score : max
        }, scores.depression)
        return maxLevel
      } catch (error) {
        console.error('Error parsing DASS21 result:', error)
        return null
      }
    }

    const get8QResult = (result) => {
      if (!result) return null
      try {
        const data = JSON.parse(result)
        return {
          score: data.assessment8Q.score,
          level: data.assessment8Q.riskLevel
        }
      } catch (error) {
        console.error('Error parsing 8Q result:', error)
        return null
      }
    }

    const getDassLevelColor = (result) => {
      if (!result) return 'grey'
      const level = getDass21Result(result)
      if (!level) return 'grey'
      
      switch (level.level) {
        case 'ปกติ': return 'success'
        case 'มีอาการเล็กน้อย': return 'info'
        case 'มีอาการปานกลาง': return 'warning'
        case 'มีอาการมาก':
        case 'มีอาการมากที่สุด': return 'error'
        default: return 'grey'
      }
    }

    const getDassLevelText = (result) => {
      if (!result) return 'ไม่มีข้อมูล'
      const level = getDass21Result(result)
      if (!level) return 'ไม่มีข้อมูล'
      return level.level
    }

    const getQ8LevelColor = (result) => {
      if (!result) return 'grey'
      const data = get8QResult(result)
      if (!data) return 'grey'

      if (data.score <= 8) return 'success'
      if (data.score <= 12) return 'warning'
      return 'error'
    }

    const getQ8LevelText = (result) => {
      if (!result) return 'ไม่มีข้อมูล'
      const data = get8QResult(result)
      if (!data) return 'ไม่มีข้อมูล'
      return `${data.level} (${data.score})`
    }

    const viewTestDetail = (item) => {
      router.push(`/test-detail/${item.id}`)
    }

    const exportExcel = () => {
      // Prepare data
      const data = tests.value.map(test => {
        const dass21Result = parseTestResult(test.dass21_result)
        
        return {
          'วันที่': formatDate(test.created_at),
          'ชื่อ-นามสกุล': test.name || '-',
          'คะแนนรวม DASS-21': test.dass21_score || '-',
          'คะแนนภาวะซึมเศร้า': test.dass21_depression_score || '-',
          'ระดับภาวะซึมเศร้า': dass21Result?.depression?.level || '-',
          'คะแนนความวิตกกังวล': test.dass21_anxiety_score || '-',
          'ระดับความวิตกกังวล': dass21Result?.anxiety?.level || '-',
          'คะแนนความเครียด': test.dass21_stress_score || '-',
          'ระดับความเครียด': dass21Result?.stress?.level || '-',
          'คะแนน 8Q': test.eightq_score || '-'
        }
      })

      // Create worksheet with custom column widths
      const ws = XLSX.utils.json_to_sheet(data)
      
      // Set column widths
      ws['!cols'] = [
        { wch: 20 }, // วันที่
        { wch: 25 }, // ชื่อ-นามสกุล
        { wch: 15 }, // คะแนนรวม
        { wch: 15 }, // คะแนนซึมเศร้า
        { wch: 15 }, // ระดับซึมเศร้า
        { wch: 15 }, // คะแนนวิตกกังวล
        { wch: 15 }, // ระดับวิตกกังวล
        { wch: 15 }, // คะแนนเครียด
        { wch: 15 }, // ระดับเครียด
        { wch: 15 }  // คะแนน 8Q
      ]

      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'ผลการประเมิน')

      // Save Excel file
      XLSX.writeFile(wb, `ผลการประเมิน_${formatDate(new Date())}.xlsx`)
    }

    const fetchTests = async () => {
      loading.value = true
      try {
        const response = await testAPI.getTestResults()
        console.log('API Response:', response)
        if (Array.isArray(response)) {
          tests.value = response
        } else if (response && Array.isArray(response.data)) {
          tests.value = response.data
        } else {
          console.error('Unexpected API response format:', response)
          tests.value = []
        }
      } catch (error) {
        console.error('Error fetching tests:', error)
        tests.value = []
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchTests()
    })

    return {
      loading,
      search,
      headers,
      tests,
      formatDate,
      getDassLevelColor,
      getDassLevelText,
      getQ8LevelColor,
      getQ8LevelText,
      viewTestDetail,
      exportExcel
    }
  }
}
</script>
