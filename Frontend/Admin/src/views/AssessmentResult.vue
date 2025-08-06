<template>
  <div class="assessment-result" v-if="results">
    <div class="container py-5">
      <div class="wizard-v1-content">
        <div class="wizard-form">
          <div class="document_1">
            <h3>สรุปผลการทำแบบประเมินสุขภาพจิต DASS-21</h3>
          </div>
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
          <br>

          <div class="row">
            <!-- Depression Result -->
            <div class="col-md-4 mb-4">
              <div class="result-section h-100">
                <div class="card">
                  <div class="card-header text-center">
                    <strong>ด้านภาวะซึมเศร้า {{ getResults[0].score }} คะแนน</strong>
                  </div>
                  <div class="card-body text-center">
                    <i :class="['far', 'fa-4x', 'mb-3', getEmotionIcon(getResults[0].level), getTextColorClass(getResults[0].level)]"></i>
                    <div v-if="getResults && getResults[0]" :class="['mt-3', getTextColorClass(getResults[0].level)]">
                      <h3>{{ getLevelText(0, getResults[0].level) }}</h3>
                      <p>{{ getResultText('depression', getResults[0].level) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Anxiety Result -->
            <div class="col-md-4 mb-4">
              <div class="result-section h-100">
                <div class="card">
                  <div class="card-header text-center">
                    <strong>ด้านภาวะวิตกกังวล {{ getResults[1].score }} คะแนน</strong>
                  </div>
                  <div class="card-body text-center">
                    <i :class="['far', 'fa-4x', 'mb-3', getEmotionIcon(getResults[1].level), getTextColorClass(getResults[1].level)]"></i>
                    <div v-if="getResults && getResults[1]" :class="['mt-3', getTextColorClass(getResults[1].level)]">
                      <h3>{{ getLevelText(1, getResults[1].level) }}</h3>
                      <p>{{ getResultText('anxiety', getResults[1].level) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stress Result -->
            <div class="col-md-4 mb-4">
              <div class="result-section h-100">
                <div class="card">
                  <div class="card-header text-center">
                    <strong>ด้านความเครียด {{ getResults[2].score }} คะแนน</strong>
                  </div>
                  <div class="card-body text-center">
                    <i :class="['far', 'fa-4x', 'mb-3', getEmotionIcon(getResults[2].level), getTextColorClass(getResults[2].level)]"></i>
                    <div v-if="getResults && getResults[2]" :class="['mt-3', getTextColorClass(getResults[2].level)]">
                      <h3>{{ getLevelText(2, getResults[2].level) }}</h3>
                      <p>{{ getResultText('stress', getResults[2].level) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="shouldTake8Q" class="alert alert-danger mt-4">
            <h5 class="alert-heading">คำแนะนำเพิ่มเติม - การประเมินความเสี่ยงการฆ่าตัวตาย</h5>
            <p>จากผลการประเมิน แนะนำให้ทำแบบประเมินการฆ่าตัวตาย 8Q เพิ่มเติม เพื่อประเมินความเสี่ยงและให้การช่วยเหลือที่เหมาะสม</p>
            <router-link to="/assessment/8q" class="btn btn-danger mt-2">
              ทำแบบประเมิน 8Q
            </router-link>
          </div>

          <div v-else-if="shouldTake9Q" class="alert alert-warning mt-4 d-none">
            <h5 class="alert-heading">คำแนะนำเพิ่มเติม</h5>
            <p>จากผลการประเมิน แนะนำให้ทำแบบประเมินโรคซึมเศร้า 9Q เพิ่มเติม</p>
            <router-link to="/assessment/9q" class="btn btn-primary mt-2">
              ทำแบบประเมิน 9Q
            </router-link>
          </div>

          <div v-else-if="hasRisk" class="mt-4 d-none">
            <div class="alert alert-warning mb-3">
              <h5 class="alert-heading">คำแนะนำเพิ่มเติม</h5>
              <p>จากผลการประเมิน แนะนำให้ท่านจองคิวเพื่อรับการบำบัดและคำปรึกษาจากผู้เชี่ยวชาญ</p>
            </div>
            <div class="text-center">
              <router-link to="/booking" class="btn btn-primary btn-lg mb-3">
                <i class="fas fa-calendar-check me-2"></i>จองคิวรับการบำบัด
              </router-link>
            </div>
          </div>

          <div class="text-center mt-3">
            <router-link to="/" class="btn btn-outline-secondary">
              กลับหน้าหลัก
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container mt-5" v-if="assessmentData && assessmentData.nineQ">
    <div class="card">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">ผลการประเมิน 9Q</h2>
        
        <div v-if="getNineQResult()" :class="['alert', getNineQResult().class]">
          <h4 class="alert-heading">คะแนนรวม: {{ getNineQResult().score }}</h4>
          <p class="mb-0">{{ getNineQResult().text }}</p>
        </div>

        <div class="mt-4">
          <h5>คำแนะนำเพิ่มเติม:</h5>
          <ul class="list-group">
            <li class="list-group-item" v-if="getNineQResult().score < 7">
              ท่านไม่มีอาการของโรคซึมเศร้าหรือมีน้อยมาก แต่ควรดูแลสุขภาพจิตใจให้แข็งแรงอยู่เสมอ
            </li>
            <li class="list-group-item" v-if="getNineQResult().score >= 7 && getNineQResult().score < 13">
              ท่านมีอาการของโรคซึมเศร้าระดับน้อย ควรพักผ่อนให้เพียงพอและทำกิจกรรมที่ช่วยผ่อนคลาย
            </li>
            <li class="list-group-item" v-if="getNineQResult().score >= 13">
              ท่านควรพบแพทย์เพื่อประเมินอาการและรับคำแนะนำในการรักษาที่เหมาะสม
            </li>
          </ul>
        </div>

        <div class="text-center mt-4">
          <router-link to="/" class="btn btn-success btn-lg">กลับสู่หน้าหลัก</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store/assessment'
import { submitTestResults, sendTelegramNotification } from '@/services/assessmentService'

export default {
  name: 'AssessmentResult',
  data() {
    return {
      results: [
        {
          name: 'depression',
          title: 'ด้านภาวะซึมเศร้า',
          ranges: {
            normal: [0, 4],
            mild: [5, 6],
            moderate: [7, 10],
            severe: [11, 13],
            extremely_severe: [14, 21]
          },
          levels: {
            normal: 'มีภาวะซึมเศร้าปกติ (Normal)',
            mild: 'มีภาวะซึมเศร้าเล็กน้อย (Mild)',
            moderate: 'มีภาวะซึมเศร้าปานกลาง (Moderate)',
            severe: 'มีภาวะซึมเศร้ารุนแรง (Severe)',
            extremely_severe: 'มีภาวะซึมเศร้ารุนแรงมาก (Extremely Severe)'
          }
        },
        {
          name: 'anxiety',
          title: 'ด้านภาวะวิตกกังวล',
          ranges: {
            normal: [0, 3],
            mild: [4, 5],
            moderate: [6, 7],
            severe: [8, 9],
            extremely_severe: [10, 21]
          },
          levels: {
            normal: 'มีภาวะวิตกกังวลปกติ (Normal)',
            mild: 'มีภาวะวิตกกังวลเล็กน้อย (Mild)',
            moderate: 'มีภาวะวิตกกังวลปานกลาง (Moderate)',
            severe: 'มีภาวะวิตกกังวลรุนแรง (Severe)',
            extremely_severe: 'มีภาวะวิตกกังวลรุนแรงมาก (Extremely Severe)'
          }
        },
        {
          name: 'stress',
          title: 'ด้านความเครียด',
          ranges: {
            normal: [0, 7],
            mild: [8, 9],
            moderate: [10, 12],
            severe: [13, 16],
            extremely_severe: [17, 21]
          },
          levels: {
            normal: 'มีความเครียดปกติ (Normal)',
            mild: 'มีความเครียดเล็กน้อย (Mild)',
            moderate: 'มีความเครียดปานกลาง (Moderate)',
            severe: 'มีความเครียดรุนแรง (Severe)',
            extremely_severe: 'มีความเครียดรุนแรงมาก (Extremely Severe)'
          }
        }
      ],
      isSubmitting: false,
      submitError: null
    }
  },
  computed: {
    assessmentData() {
      return store.state.assessmentData
    },
    is8QAssessment() {
      return this.$route.query.type === '8q'
    },
    getResults() {
      if (!this.assessmentData?.scores) return [];
      
      return [
        {
          type: 'depression',
          score: this.assessmentData.scores.depression,
          level: this.getLevel('depression', this.assessmentData.scores.depression)
        },
        {
          type: 'anxiety',
          score: this.assessmentData.scores.anxiety,
          level: this.getLevel('anxiety', this.assessmentData.scores.anxiety)
        },
        {
          type: 'stress',
          score: this.assessmentData.scores.stress,
          level: this.getLevel('stress', this.assessmentData.scores.stress)
        }
      ];
    },
    shouldTake8Q() {
      const depressionScore = this.getResults[0]?.score || 0;
      const anxietyScore = this.getResults[1]?.score || 0;
      const stressScore = this.getResults[2]?.score || 0;

      // ระดับรุนแรงของภาวะซึมเศร้า (คะแนน > 14)
      const severeDepression = depressionScore > 14;
      
      // ระดับรุนแรงของความวิตกกังวล (คะแนน > 10)
      const severeAnxiety = anxietyScore > 10;
      
      // ระดับรุนแรงของความเครียด (คะแนน > 17)
      const severeStress = stressScore > 17;

      // ให้ทำ 8Q ถ้ามีภาวะรุนแรงอย่างใดอย่างหนึ่ง
      return severeDepression || severeAnxiety || severeStress;
    },
    shouldTake9Q() {
      // ถ้าควรทำ 8Q ให้ทำ 8Q ก่อน
      if (this.shouldTake8Q) {
        return false;
      }
      const depressionScore = this.getResults[0]?.score || 0;
      return depressionScore >= 7;
    },
    hasRisk() {
      if (!this.getResults) return false;
      return this.getResults.some(result => {
        if (result.type === 'depression') return result.score >= 14;
        if (result.type === 'anxiety') return result.score >= 10;
        if (result.type === 'stress') return result.score >= 17;
        return false;
      });
    }
  },
  methods: {
    getLevel(type, score) {
      const result = this.results.find(r => r.name === type);
      if (!result) return 'normal';
      
      const { ranges } = result;
      
      if (score >= ranges.extremely_severe[0]) return 'extremely_severe';
      if (score >= ranges.severe[0]) return 'severe';
      if (score >= ranges.moderate[0]) return 'moderate';
      if (score >= ranges.mild[0]) return 'mild';
      return 'normal';
    },
    getEmotionIcon(level) {
      switch (level) {
        case 'normal':
          return 'fa-face-smile';
        case 'mild':
          return 'fa-face-meh';
        case 'moderate':
          return 'fa-face-frown';
        case 'severe':
          return 'fa-face-sad-tear';
        case 'extremely_severe':
          return 'fa-face-sad-cry';
        default:
          return 'fa-face-meh';
      }
    },
    getLevelText(index, level) {
      if (!this.results[index]) return '';
      return this.results[index].levels[level];
    },
    getTextColorClass(level) {
      switch (level) {
        case 'normal':
          return 'text-success';
        case 'mild':
          return 'text-warning';
        case 'moderate':
          return 'text-orange';
        case 'severe':
        case 'extremely_severe':
          return 'text-danger';
        default:
          return '';
      }
    },
    getResultText(type, level) {
      const result = this.results.find(r => r.name === type);
      if (!result?.levels?.[level]) return '';
      return result.levels[level];
    },
    get8QEmotionIcon(riskLevel) {
      switch (riskLevel) {
        case 'น้อย':
          return 'fa-smile'
        case 'ปานกลาง':
          return 'fa-meh'
        case 'สูง':
          return 'fa-frown'
        case 'สูงมาก':
          return 'fa-sad-tear'
        default:
          return 'fa-meh'
      }
    },
    get8QTextColorClass(riskLevel) {
      switch (riskLevel) {
        case 'น้อย':
          return 'text-success'
        case 'ปานกลาง':
          return 'text-warning'
        case 'สูง':
          return 'text-danger'
        case 'สูงมาก':
          return 'text-danger'
        default:
          return 'text-warning'
      }
    },
    get8QRecommendation(riskLevel) {
      switch (riskLevel) {
        case 'น้อย':
          return 'ความเสี่ยงต่ำ ให้ติดตามเฝ้าระวังห่างๆ'
        case 'ปานกลาง':
          return 'ควรพบผู้เชี่ยวชาญเพื่อประเมินอาการและให้การปรึกษา'
        case 'สูง':
          return 'ควรพบผู้เชี่ยวชาญโดยเร็วเพื่อประเมินอาการและให้การรักษา'
        case 'สูงมาก':
          return 'ควรได้รับการดูแลรักษาจากผู้เชี่ยวชาญโดยทันที'
        default:
          return 'ควรพบผู้เชี่ยวชาญเพื่อประเมินอาการเพิ่มเติม'
      }
    },
    getNineQResult() {
      if (!this.assessmentData || !this.assessmentData.nineQ) return null;
      const score = this.assessmentData.nineQ.total;
      const level = this.getNineQLevel(score);
      return {
        score,
        class: level === 0 ? 'alert-success' : level === 1 ? 'alert-warning' : 'alert-danger',
        text: this.getNineQText(level)
      };
    },
    getNineQLevel(score) {
      if (score >= 19) return 3; // Severe
      if (score >= 13) return 2; // Moderate
      if (score >= 7) return 1;  // Mild
      return 0; // Normal
    },
    getNineQText(level) {
      const texts = {
        0: 'ท่านไม่มีอาการของโรคซึมเศร้าหรือมีน้อยมาก แต่ควรดูแลสุขภาพจิตใจให้แข็งแรงอยู่เสมอ',
        1: 'ท่านมีอาการของโรคซึมเศร้าระดับน้อย ควรพักผ่อนให้เพียงพอและทำกิจกรรมที่ช่วยผ่อนคลาย',
        2: 'ท่านควรพบแพทย์เพื่อประเมินอาการและรับคำแนะนำในการรักษาที่เหมาะสม'
      }
      return texts[level]
    },
    getChoiceText(choice) {
      const choices = {
        0: 'ไม่ตรงกับฉันเลย',
        1: 'ตรงกับฉันบ้าง หรือเกิดขึ้นเป็นบางครั้ง',
        2: 'ตรงกับฉันมาก หรือเกิดขึ้นบ่อย',
        3: 'ตรงกับฉันมากที่สุด หรือเกิดขึ้นเกือบทั้งเวลา'
      };
      return choices[choice] || 'ไม่ได้เลือกคำตอบ';
    },
    async submitResults() {
      if (this.isSubmitting) return

      try {
        this.isSubmitting = true
        this.submitError = null

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
          dass21_score: this.assessmentData?.scores?.depression + this.assessmentData?.scores?.anxiety + this.assessmentData?.scores?.stress,
          eightq_score: null,
          eightq_result: null
        }

        await submitTestResults(data)
        console.log('Test results submitted successfully')
      } catch (error) {
        console.error('Failed to submit test results:', error)
        this.submitError = 'ไม่สามารถบันทึกผลการประเมินได้ กรุณาลองใหม่อีกครั้ง'
      } finally {
        this.isSubmitting = false
      }
    },
    shouldSubmitResults() {
      // ตรวจสอบว่าคะแนนไม่ถึงระดับที่ต้องทำ 8Q
      const { depression, anxiety, stress } = this.assessmentData?.scores || {}
      
      // ระดับที่ไม่ต้องทำ 8Q (ต่ำกว่าระดับรุนแรง)
      return (
        depression < 21 && // น้อยกว่าระดับรุนแรง
        anxiety < 15 &&    // น้อยกว่าระดับรุนแรง
        stress < 26        // น้อยกว่าระดับรุนแรง
      )
    },
    async sendNotification() {
      try {
        const { depression, anxiety, stress } = this.assessmentData?.scores || {}
        const studentInfo = `👨‍🎓 นักศึกษา: ${this.assessmentData?.fullname}, 🆔 รหัส: ${this.assessmentData?.studentId}, 📚 ชั้นปี: ${this.assessmentData?.year}, 🏫 หลักสูตร: ${this.assessmentData?.program}`
        const scoreInfo = `📊 คะแนน DASS-21: 😢 ซึมเศร้า=${depression}, 😰 วิตกกังวล=${anxiety}, 😫 ความเครียด=${stress}`
        const message = `⚠️ แจ้งเตือน: ${studentInfo}\n${scoreInfo}\n✅ นักศึกษามีคะแนนไม่ถึงระดับที่ต้องทำแบบทดสอบถัดไป`
        
        await sendTelegramNotification(message)
        console.log('Telegram notification sent successfully')
      } catch (error) {
        console.error('Failed to send Telegram notification:', error)
      }
    }
  },
  mounted() {
    if (!this.assessmentData) {
      this.$router.push('/assessment')
      return
    }

    // ถ้าคะแนนถึงเกณฑ์ที่ต้องทำ 8Q ให้ redirect ไปหน้า 8Q ทันที
    if (this.shouldTake8Q) {
      this.$router.push('/assessment/8q')
      return
    }

    // Log complete assessment data including DASS-21 summary
    console.log('Complete Assessment Data:', JSON.stringify({
      DASS21: this.assessmentData.summary,
      scores: this.assessmentData.scores,
      answers: this.assessmentData.answers
    }, null, 2))

    // ถ้าคะแนนไม่ถึงระดับ ให้ส่งผลไปยัง API
    if (this.shouldSubmitResults()) {
      this.submitResults()
      this.sendNotification()
    }
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

.result-text {
  font-size: 1.1em;
  font-weight: 500;
}

.card {
  height: 100%;
  border: 1px solid rgba(0,0,0,.125);
  box-shadow: 0 2px 4px rgba(0,0,0,.05);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0,0,0,.125);
  padding: 1rem;
}

.card-body {
  padding: 1.5rem;
}

.result-section i {
  margin-bottom: 1rem;
}

.text-orange {
  color: #fd7e14;
}

.result-section {
  max-width: 800px;
  margin: 0 auto;
}

table {
  background-color: white;
}

.table td {
  vertical-align: middle;
}

.text-success {
  color: #28a745 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

@media (max-width: 768px) {
  .card {
    margin-bottom: 1rem;
  }
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
</style>
