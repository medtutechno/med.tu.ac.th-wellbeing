<template>
  <div class="assessment-result" v-if="assessmentData">
    <div class="container py-5">
      <div class="wizard-v1-content">
        <div class="wizard-form">
          <div class="document_1">
            <h3>สรุปผลการทำแบบประเมิน 8Q</h3>
          </div>

          <!-- ข้อมูลผู้ทำแบบประเมิน -->
          <div class="user-info mb-4">
            <div class="info-grid">
              <div class="info-item">
                <span><i class="fas fa-user me-2"></i>ชื่อ-นามสกุล: {{ assessmentData?.fullname }}</span>
              </div>
              <div class="info-item">
                <span><i class="fas fa-id-card me-2"></i>รหัสนักศึกษา: {{ assessmentData?.studentId }}</span>
              </div>
              <div class="info-item">
                <span><i class="fas fa-graduation-cap me-2"></i>ชั้นปี: {{ assessmentData?.year === 'อื่นๆ' ? 'อื่นๆ' : 'ปี ' + assessmentData?.year }}</span>
              </div>
              <div class="info-item">
                <span><i class="fas fa-book me-2"></i>หลักสูตร: {{ assessmentData?.program }}</span>
              </div>
              <div class="info-item">
                <span><i class="fas fa-envelope me-2"></i>อีเมล: {{ assessmentData?.email }}</span>
              </div>
              <div class="info-item">
                <span><i class="fas fa-phone me-2"></i>เบอร์โทรศัพท์: {{ assessmentData?.phone }}</span>
              </div>
            </div>
          </div>

          <!-- ผลการประเมิน 8Q -->
          <div class="result-section">
            <div v-if="submitError" class="alert alert-danger" role="alert">
              {{ submitError }}
            </div>

            <div class="card">
              <div class="card-header text-center">
                <strong>ผลการประเมิน {{ score }} คะแนน</strong>
              </div>
              <div class="card-body text-center">
                <i :class="['far', 'fa-4x', 'mb-3', getEmotionIcon, getTextColorClass]"></i>
                <div :class="['mt-3', getTextColorClass]">
                  <h3>ระดับความเสี่ยง: {{ riskLevel }}</h3>
                  <p>{{ recommendation }}</p>
                </div>
              </div>
            </div>

            <div v-if="dass21Results.length > 0" class="mt-4">
              <h3 class="text-center mb-4">ผลการประเมิน DASS-21</h3>
              <div class="row">
                <div class="col-md-4 mb-3" v-for="(result, index) in dass21Results" :key="index">
                  <div class="card h-100">
                    <div class="card-header text-center">
                      <strong>
                        {{ result.type === 'depression' ? 'ภาวะซึมเศร้า' : 
                           result.type === 'anxiety' ? 'ภาวะวิตกกังวล' : 
                           'ความเครียด' }}
                        ({{ result.score }} คะแนน)
                      </strong>
                    </div>
                    <div class="card-body text-center">
                      <i :class="['far', 'fa-4x', 'mb-3', getDass21EmotionIcon(result.level), getDass21TextColorClass(result.level)]"></i>
                      <div :class="['mt-3', getDass21TextColorClass(result.level)]">
                        <h3>{{ result.level }}</h3>
                        <p>{{ getDass21Recommendation(result.level) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="text-center mt-4">
            
            <!-- <router-link to="/" class="btn btn-secondary w-100">
              กลับหน้าหลัก
            </router-link> -->

            
            <div id="alert-box" class="alert alert-mint alert-dismissible fade show" role="alert">
            <strong>คุณมีความเสี่ยงสุขภาพ</strong> ขอข้อมูลติดต่อเพื่อรับคำปรึกษา<br>
            โปรดติดต่อที่ <strong>
              
<!-- ลิงก์สำหรับ PC -->
<a class="desktop-link" href="https://line.me/R/ti/p/@957rwkpy" target="_blank" style="text-decoration: none;">
    <img src="https://scdn.line-apps.com/n/line_add_friends/btn/en.png" alt="Add LINE" style="height: 40px; vertical-align: middle;">
    <span style="margin-left: 8px; color: #00B900;">LINE ACCOUNT @MdeTu.Well.Being</span>
</a>

<!-- ลิงก์สำหรับมือถือ/แท็บเล็ต -->
<a class="mobile-link" href="line://ti/p/@957rwkpy" style="text-decoration: none;">
    <img src="https://scdn.line-apps.com/n/line_add_friends/btn/en.png" alt="Add LINE" style="height: 40px; vertical-align: middle;">
    <span style="margin-left: 8px; color: #00B900;">LINE ACCOUNT @MdeTu.Well.Being</span>
</a>


</strong> หรือ <strong>คลินิกสบายใจ รพ.ธรรมศาสตร์</strong><br>
            โทร: <a href="tel:029269899" class="alert-link">029-269-899</a>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

          </div>


          <div v-if="submitSuccess" class="alert alert-success" role="alert">
              บันทึกผลการประเมินเรียบร้อยแล้ว
            </div>

            <router-link 
              v-if="showBookingButton"
              :to="{ 
                path: '/day-booking', 
                query: { 
                  name: name, 
                  id: resultId,
                  student_id: assessmentData?.studentId,
                  year: assessmentData?.year,
                  program: assessmentData?.program,
                  email: assessmentData?.email,
                  phone_number: assessmentData?.phone
                }
              }" 
              class="btn btn-success w-100 mb-3"
              :class="{ disabled: !resultId }"
              :disabled="!resultId">
              {{ !resultId ? 'กำลังประมวลผล...' : 'จองคิวนัดพบแพทย์' }}
            </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store/assessment'
import { submitTestResults, sendTelegramNotification } from '@/services/assessmentService'

export default {
  name: 'Assessment8QResult',
  data() {
    return {
      name: this.$route.query.name,
        score: this.$route.query.score,
      riskLevel: this.$route.query.riskLevel,
      summary: this.$route.query.summary ? JSON.parse(this.$route.query.summary) : null,
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
      resultId: null
    }
  },
  computed: {
    assessmentData() {
      return store.state.assessmentData
    },
    getEmotionIcon() {
      switch (this.riskLevel) {
        case 'ไม่มี':
          return 'fa-smile'
        case 'น้อย':
          return 'fa-smile'
        case 'ปานกลาง':
          return 'fa-meh'
        case 'รุนแรง':
          return 'fa-frown'
        case 'รุนแรงมาก':
          return 'fa-sad-tear'
        default:
          return 'fa-meh'
      }
    },
    getTextColorClass() {
      switch (this.riskLevel) {
        case 'ไม่มี':
          return 'text-success'
        case 'น้อย':
          return 'text-info'
        case 'ปานกลาง':
          return 'text-warning'
        case 'รุนแรง':
          return 'text-danger'
        default:
          return ''
      }
    },
    recommendation() {
      switch (this.riskLevel) {
        case 'ไม่มี':
          return 'ไม่มีความเสี่ยง'
        case 'น้อย':
          return 'ความเสี่ยงต่ำ ให้ติดตามเฝ้าระวังห่างๆ'
        case 'ปานกลาง':
          return 'ควรพบผู้เชี่ยวชาญเพื่อประเมินอาการและให้การปรึกษา'
        case 'รุนแรง':
          return 'ควรพบผู้เชี่ยวชาญโดยเร็วเพื่อประเมินอาการและให้การรักษา'
        case 'รุนแรงมาก':
          return 'ควรได้รับการดูแลรักษาจากผู้เชี่ยวชาญโดยทันที'
        default:
          return 'ควรพบผู้เชี่ยวชาญเพื่อประเมินอาการเพิ่มเติม'
      }
    },
    dass21Results() {
      if (!this.assessmentData?.scores) return [];
      
      return [
        {
          type: 'depression',
          score: this.assessmentData.scores.depression,
          level: this.getDass21Level('depression', this.assessmentData.scores.depression)
        },
        {
          type: 'anxiety',
          score: this.assessmentData.scores.anxiety,
          level: this.getDass21Level('anxiety', this.assessmentData.scores.anxiety)
        },
        {
          type: 'stress',
          score: this.assessmentData.scores.stress,
          level: this.getDass21Level('stress', this.assessmentData.scores.stress)
        }
      ];
    },
    showBookingButton() {
      // แสดงปุ่มเมื่อมีความเสี่ยงระดับปานกลางขึ้นไป
      return ['ปานกลาง', 'รุนแรง', 'รุนแรงมาก'].includes(this.riskLevel) ||
             // หรือเมื่อ DASS-21 มีผลระดับรุนแรงในด้านใดด้านหนึ่ง
             this.dass21Results.some(result => 
               ['รุนแรง', 'รุนแรงมาก'].includes(result.level)
             )
    }
  },
  methods: {
    getDass21Level(type, score) {
      const levels = {
        depression: {
          normal: score <= 9 ? 'ปกติ' : null,
          mild: score <= 13 ? 'เล็กน้อย' : null,
          moderate: score <= 20 ? 'ปานกลาง' : null,
          severe: score <= 27 ? 'รุนแรง' : null,
          extremely_severe: score > 27 ? 'รุนแรงมาก' : null
        },
        anxiety: {
          normal: score <= 7 ? 'ปกติ' : null,
          mild: score <= 9 ? 'เล็กน้อย' : null,
          moderate: score <= 14 ? 'ปานกลาง' : null,
          severe: score <= 19 ? 'รุนแรง' : null,
          extremely_severe: score > 19 ? 'รุนแรงมาก' : null
        },
        stress: {
          normal: score <= 14 ? 'ปกติ' : null,
          mild: score <= 18 ? 'เล็กน้อย' : null,
          moderate: score <= 25 ? 'ปานกลาง' : null,
          severe: score <= 33 ? 'รุนแรง' : null,
          extremely_severe: score > 33 ? 'รุนแรงมาก' : null
        }
      }

      const levelMap = levels[type]
      return Object.values(levelMap).find(level => level !== null) || 'ไม่ระบุ'
    },
    getDass21EmotionIcon(level) {
      switch (level) {
        case 'ปกติ':
          return 'fa-smile'
        case 'เล็กน้อย':
          return 'fa-smile'
        case 'ปานกลาง':
          return 'fa-meh'
        case 'รุนแรง':
          return 'fa-frown'
        case 'รุนแรงมาก':
          return 'fa-sad-tear'
        default:
          return 'fa-meh'
      }
    },
    getDass21TextColorClass(level) {
      switch (level) {
        case 'ปกติ':
          return 'text-success'
        case 'เล็กน้อย':
          return 'text-success'
        case 'ปานกลาง':
          return 'text-warning'
        case 'รุนแรง':
          return 'text-danger'
        case 'รุนแรงมาก':
          return 'text-danger'
        default:
          return 'text-muted'
      }
    },
    getDass21Recommendation(level) {
      switch (level) {
        case 'ปกติ':
          return 'ไม่มีอาการ'
        case 'เล็กน้อย':
          return 'มีอาการเล็กน้อย ควรติดตามอาการ'
        case 'ปานกลาง':
          return 'มีอาการปานกลาง ควรพบผู้เชี่ยวชาญ'
        case 'รุนแรง':
          return 'มีอาการรุนแรง ควรพบผู้เชี่ยวชาญโดยเร็ว'
        case 'รุนแรงมาก':
          return 'มีอาการรุนแรงมาก ควรได้รับการดูแลรักษาโดยทันที'
        default:
          return 'ไม่ระบุ'
      }
    },
    async submitResults() {
      if (this.isSubmitting) return

      try {
        this.isSubmitting = true
        this.submitError = null
        this.submitSuccess = false

        const data = {
          name: this.assessmentData?.fullname,
          
      student_id: this.assessmentData?.studentId,
        year: this.assessmentData?.year,
        program: this.assessmentData?.program,
        email: this.assessmentData?.email,
        phone_number: this.assessmentData?.phone,
        
          dass21_result: JSON.stringify({
            scores: this.assessmentData?.scores,
            summary: this.assessmentData?.summary
          }),
          dass21_depression_score: this.assessmentData?.scores?.depression,
          dass21_anxiety_score: this.assessmentData?.scores?.anxiety,
          dass21_stress_score: this.assessmentData?.scores?.stress,
          eightq_score: this.summary.assessment8Q.score,
          dass21_score: this.assessmentData?.scores?.depression + this.assessmentData?.scores?.anxiety + this.assessmentData?.scores?.stress,
          eightq_result: JSON.stringify(this.summary)
        }

        const result = await submitTestResults(data)
        console.log('Test results submitted successfully:', result)
        this.submitSuccess = true
        
        this.resultId = result.id // เก็บ ID ที่ได้จาก API
       
        // ส่งรายงานไปยัง Telegram
        const reportMessage = `
🔔 *รายงานผลการประเมิน*
👤 ชื่อ: ${this.assessmentData?.fullname}
🆔 รหัสนักศึกษา: ${this.assessmentData?.studentId}
📚 ชั้นปี: ${this.assessmentData?.year}
🎓 หลักสูตร: ${this.assessmentData?.program}
📧 อีเมล: ${this.assessmentData?.email}
📱 เบอร์โทร: ${this.assessmentData?.phone}

📊 *ผลการประเมิน 8Q*: ${this.score} คะแนน
⚠️ ระดับความเสี่ยง: ${this.riskLevel}

${this.assessmentData?.scores ? `📊 *ผลการประเมิน DASS-21*
😔 ภาวะซึมเศร้า:${this.assessmentData?.scores?.stress} คะแนน
😰 ภาวะวิตกกังวล: ${this.assessmentData?.scores?.anxiety} คะแนน
😫 ความเครียด:  ${this.assessmentData?.scores?.depression}คะแนน` : ''}

🔗 ID: ${result.id}
⏰ เวลา: ${new Date().toLocaleString('th-TH')}
        `
        
        try {
          await sendTelegramNotification(reportMessage)
          console.log('Telegram notification sent successfully')
        } catch (notificationError) {
          console.error('Failed to send Telegram notification:', notificationError)
          // ไม่ต้องแสดง error ให้ผู้ใช้เห็น เพราะการส่งรายงานเป็นกระบวนการเสริม
        }

        setTimeout(() => this.submitSuccess = false, 3000); // ซ่อนหลัง 3 วินาที
      } catch (error) {
        console.error('Failed to submit test results:', error)
        this.submitError = 'ไม่สามารถบันทึกผลการประเมินได้ กรุณาลองใหม่อีกครั้ง'
      } finally {
        this.isSubmitting = false
      }
    }
  },
  mounted() {
    if (!this.assessmentData) {
      this.$router.push('/assessment')
      return
    }

    // Log complete assessment data
    console.log('Complete 8Q Assessment Data:', {
      userInfo: {
        fullname: this.assessmentData?.fullname,
        studentId: this.assessmentData?.studentId,
        year: this.assessmentData?.year,
        program: this.assessmentData?.program,
        email: this.assessmentData?.email,
        phone: this.assessmentData?.phone
      },
      assessmentResults: this.assessmentData?.eightQ
    })

    // Submit results to API
    this.submitResults()
  }
}
</script>

<style scoped>
.assessment-result {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.wizard-v1-content {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.user-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  padding: 8px;
}

.info-item span {
  display: flex;
  align-items: center;
  color: #495057;
}

.info-item i {
  color: var(--home4-primary);
  width: 20px;
}

.document_1 {
  text-align: center;
  margin-bottom: 2rem;
}

.result-section {
  margin-bottom: 2rem;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: none;
}

.alert-mint {
  background-color: #d1f0e1;
  color: #2c6e49;
  border-color: #a3d9b1;
}

.btn-primary {
  background-color: #28bf7e;
  border-color: #28bf7e;
}

.btn-primary:hover {
  background-color: #229e69;
  border-color: #229e69;
}


        .desktop-link { display: block; }
        .mobile-link { display: none; }

        @media (max-width: 1024px) { 
            .desktop-link { display: none; }
            .mobile-link { display: block; }
        }
</style>