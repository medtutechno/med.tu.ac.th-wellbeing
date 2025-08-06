<template>
  <div class="assessment-page">
    <!-- Privacy Popup -->
    <div class="privacy-popup" v-if="showPrivacyPopup">
      <div class="privacy-popup-content">
        <h4>ข้อมูลความเป็นส่วนตัว</h4>
        <p>ข้อมูลส่วนบุคคลและผลการประเมินสุขภาพจิต ถือเป็นความลับภายใต้การดูแลของ Med TU Well-Bing Center และจะใช้เพื่อการช่วยเหลือดูแลปัญหาทางจิตใจ</p>
        <button class="btn btn-primary" @click="acceptPrivacy">ตกลง</button>
      </div>
    </div>
    <div class="container" style="margin-top: 20px;">
      <div class="assessment-container">
        <!-- Header -->
        <div class="assessment-header" v-if="!showNameInput">
          <h4>แบบประเมินความเครียด ความวิตกกังวล และภาวะซึมเศร้า (DASS-21)</h4>
          <p>กรุณาเลือกคำตอบที่ตรงกับความรู้สึกของคุณมากที่สุดในช่วง 1 สัปดาห์ที่ผ่านมา</p>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container" v-if="!showNameInput">
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }"></div>
          </div>
          <div class="progress-text">{{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</div>
        </div>

        <!-- Question Display -->
        <div class="question-container" v-if="!showNameInput">
          <div class="question" :key="currentQuestionIndex">
            <h2>{{ currentQuestion.text }}</h2>
            <div class="options">
              <div
                v-for="(option, index) in options"
                :key="index"
                class="option"
                :class="{ selected: currentAnswer === index }"
                @click="selectAnswer(index)"
              >
                {{ option }}
              </div>
            </div>
          </div>
        </div>

        <!-- Name Input -->
        <div class="name-input-container" v-else>
          <h5>รายละเอียดประเมินสุขภาพใจเพื่อทำนัด</h5>
          <b>ข้อมูลสำหรับติดต่อนัดหมาย</b>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">ชื่อ-นามสกุล <span class="text-danger">*</span></label>
              <input 
                type="text" 
                v-model="name" 
                class="form-control " 
                placeholder="ชื่อ-นามสกุล"
                required
              >
            </div>
            <div class="col-md-6">
              <label class="form-label">รหัสนักศึกษา <span class="text-danger">*</span></label>
              <input 
                type="text" 
                v-model="studentId" 
                class="form-control" 
                placeholder="รหัสนักศึกษา"
                required
                maxlength="10"
                @input="validateStudentId"
                :class="{'is-invalid': !isValidStudentId}"
              >
              <div class="invalid-feedback" v-if="!isValidStudentId">
                กรุณากรอกรหัสนักศึกษาเป็นตัวเลข 10 หลัก
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">ชั้นปี <span class="text-danger">*</span></label>
              <select 
                v-model="year" 
                class="form-select"
                required
              >
                <option value="">เลือกชั้นปี</option>
                <option v-for="year in 6" :key="year" :value="year">ปี {{ year }}</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">หลักสูตร <span class="text-danger">*</span></label>
              <select 
                v-model="program" 
                class="form-select"
                required
              >
                <option value="">เลือกหลักสูตร</option>
                <option v-for="program in programs" :key="program" :value="program">{{ program }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">อีเมล <span class="text-danger">*</span></label>
              <input 
                type="email" 
                v-model="email" 
                class="form-control" 
                placeholder="อีเมล"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                :class="{'is-invalid': !isValidEmail}"
              >
              <div class="invalid-feedback" v-if="!isValidEmail">
                กรุณากรอกอีเมลให้ถูกต้อง
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">เบอร์โทรศัพท์ <span class="text-danger">*</span></label>
              <input 
                type="tel" 
                v-model="phone" 
                class="form-control" 
                placeholder="เบอร์โทรศัพท์"
                required
                maxlength="10"
                @input="validatePhone"
                :class="{'is-invalid': !isValidPhone}"
              >
              <div class="invalid-feedback" v-if="!isValidPhone">
                กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลข 10 หลัก
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mb-3">
          <HCaptcha v-if="showNameInput"
                  :sitekey="'dec27dba-c32c-4e48-8c06-34ca6a66f28e'"
                  @verify="onCaptchaVerified"
                  @error="onCaptchaError"
                  @expired="onCaptchaExpired"
                  ref="hcaptcha"
                  :language="'th'"
                ></HCaptcha>
        </div>

        <!-- Navigation Buttons -->
        <div class="button-container" :class="{ 'form-buttons': showNameInput }">
          <button 
            v-if="!isFirstQuestion" 
            class="btn btn-secondary"
            @click="previousQuestion"
          >
            ย้อนกลับ
          </button>
          <button 
            class="btn btn-primary"
            @click="nextQuestion"
            :disabled="!canProceed"
          >
            {{ isLastQuestion ? 'ดูผลการประเมิน' : 'ถัดไป' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store/assessment'
import { checkAssessmentAvailability, setAssessmentDate } from '../utils/storageManager'
import HCaptcha from '@hcaptcha/vue3-hcaptcha'
export default {
  name: 'AssessmentPage',
  components: {
    HCaptcha
  },
  data() {
    return {
      showPrivacyPopup: true,
      currentQuestionIndex: -1,
      name: '',
      studentId: '',
      year: '',
      program: '',
      email: '',
      phone: '',
      answers: Array(21).fill(null),
      canTakeAssessment: true,
      nextDate: null,
      daysLeft: 0,
      hasStarted: false,
      captchaToken: '',
      captchaVerified: false,
      programs: [
       'แพทยศาสตร์บัณฑิต',
        'แพทยศาสตร์บัณฑิต(หลักสูตรภาษาอังกฤษ)',
        'การแพทย์แผนไทยประยุกต์บัณฑิต',
        'ปริญญาโท',
        'ปริญญาเอก',
        'แพทย์ฝึกหัด'
      ],
      questions: [
      { text: '1. ฉันรู้สึกยากที่สงบจิตใจลง' },
        { text: '2. ฉันรู้สึกปากแห้งคอแห้ง' },
        { text: '3. ฉันแทบไม่รู้สึกอะไรดีๆ เลย' },
        { text: '4. ฉันมีอาการหายใจผิดปกติ (เช่น หายใจเร็วเกินเหตุ หายใจไม่ทันแม้ว่าจะไม่ได้ออกแรง)' },
        { text: '5. ฉันพบว่ามันยากที่จะคิดริเริ่มทำสิ่งใดสิ่งหนึ่ง' },
        { text: '6. ฉันมีแนวโน้มที่จะตอบสนองเกินเหตุต่อสถานการณ์' },
        { text: '7. ฉันรู้สึกว่าร่างกายบางส่วนสั่นผิดปกติ (เช่น มือสั่น)' },
        { text: '8. ฉันรู้สึกเสียพลังงานไปมากกับการคิดกังวล' },
        { text: '9. ฉันรู้สึกกังวลกับเหตุการณ์ที่อาจทำให้ฉันรู้สึกตื่นกลัวและกระทำบางสิ่งที่น่าอับอาย' },
        { text: '10. ฉันรู้สึกไม่มีเป้าหมายในชีวิต' },
        { text: '11. ฉันรู้สึกกระวนกระวายใจ' },
        { text: '12. ฉันรู้สึกยากที่จะผ่อนคลายตัวเอง' },
        { text: '13. ฉันรู้สึกจิตใจเหงาหงอยเศร้าซึม' },
        { text: '14. ฉันรู้สึกทนไม่ได้เวลามีอะไรมาขัดขวางสิ่งที่ฉันกำลังทำอยู่' },
        { text: '15. ฉันรู้สึกคล้ายจะอาการตื่นตระหนก' },
        { text: '16. ฉันรู้สึกไม่กระตือรือร้นต่อสิ่งใด' },
        { text: '17. ฉันรู้สึกเป็นคนไม่มีคุณค่า' },
        { text: '18. ฉันรู้สึกค่อนข้างฉุนเฉียวง่าย' },
        { text: '19. ฉันรับรู้ถึงการทำงานของหัวใจแม้ว่าจะไม่ได้ออกแรง (เช่น รู้สึกว่าหัวใจเต้นเร็วขึ้นหรือเต้นไม่เป็นจังหวะ)' },
        { text: '20. ฉันรู้สึกกลัวโดยไม่มีเหตุผล' },
        { text: '21. ฉันรู้สึกว่าชีวิตไม่มีความหมาย' }
      ],
      options: [
        'ไม่ตรงกับฉันเลย',
        'ตรงกับฉันบางครั้ง หรือเป็นบางเวลา',
        'ตรงกับฉันค่อนข้างมาก หรือบ่อยครั้ง',
        'ตรงกับฉันมากที่สุด หรือเกือบตลอดเวลา'
      ],
      isValidStudentId: true,
      isValidPhone: true,
      isValidEmail: true
    }
  },
  computed: {
    showNameInput() {
      return this.currentQuestionIndex === -1
    },
    currentQuestion() {
      return this.questions[this.currentQuestionIndex]
    },
    currentAnswer() {
      return this.answers[this.currentQuestionIndex]
    },
    totalQuestions() {
      return this.questions.length
    },
    isFirstQuestion() {
      return this.currentQuestionIndex <= 0
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1
    },
    canProceed() {
      if (this.showNameInput) {
        return this.name && 
               this.studentId && 
               this.isValidStudentId && 
               this.year && 
               this.program && 
               this.email && 
               this.isValidEmail && 
               this.phone && 
               this.isValidPhone &&
               this.captchaVerified
      }
      return this.currentAnswer !== null && this.captchaVerified
    }
  },
  methods: {
    acceptPrivacy() {
      this.showPrivacyPopup = false;
      this.hasStarted = true;
    },
    onCaptchaVerified(token) {
      this.captchaToken = token;
      this.captchaVerified = true;
    },
    onCaptchaExpired() {
      this.captchaToken = '';
      this.captchaVerified = false;
    },
    onCaptchaError() {
      this.captchaToken = '';
      this.captchaVerified = false;
    },
    selectAnswer(index) {
      this.answers[this.currentQuestionIndex] = index
      // บันทึก localStorage เมื่อเริ่มทำข้อแรก
      if (!this.hasStarted) {
        setAssessmentDate()
        this.hasStarted = true
      }
    },
    previousQuestion() {
      if (this.currentQuestionIndex > -1) {
        this.currentQuestionIndex--
      }
    },
    nextQuestion() {
      if (!this.canProceed) return

      if (this.isLastQuestion) {
        this.submitAssessment()
      } else {
        this.currentQuestionIndex++
      }
    },
    calculateScore(category) {
      const scoreMap = {
        depression: [2, 4, 9, 12, 15, 16, 20],
        anxiety: [1, 3, 5, 7, 8, 13, 17],
        stress: [0, 6, 10, 11, 14, 18, 19]
      }

      return scoreMap[category].reduce((sum, index) => {
        return sum + (this.answers[index] || 0)
      }, 0)
    },
    getLevel(category, score) {
      const levels = {
        depression: [
          { min: 0, max: 9, level: 'ปกติ' },
          { min: 10, max: 13, level: 'มีอาการน้อย' },
          { min: 14, max: 20, level: 'มีอาการปานกลาง' },
          { min: 21, max: 27, level: 'มีอาการมาก' },
          { min: 28, max: 100, level: 'มีอาการมากที่สุด' }
        ],
        anxiety: [
          { min: 0, max: 6, level: 'ปกติ' },
          { min: 7, max: 9, level: 'มีอาการน้อย' },
          { min: 10, max: 14, level: 'มีอาการปานกลาง' },
          { min: 15, max: 19, level: 'มีอาการมาก' },
          { min: 20, max: 100, level: 'มีอาการมากที่สุด' }
        ],
        stress: [
          { min: 0, max: 14, level: 'ปกติ' },
          { min: 15, max: 18, level: 'มีอาการน้อย' },
          { min: 19, max: 25, level: 'มีอาการปานกลาง' },
          { min: 26, max: 33, level: 'มีอาการมาก' },
          { min: 34, max: 100, level: 'มีอาการมากที่สุด' }
        ]
      }

      const level = levels[category].find((level) => score >= level.min && score <= level.max)
      return level ? level.level : 'ไม่ทราบ'
    },
    submitAssessment() {
      // Calculate scores for each category
      const depressionScore = this.calculateScore('depression')
      const anxietyScore = this.calculateScore('anxiety')
      const stressScore = this.calculateScore('stress')

      // Create summary object
      const summary = {
        assessmentDASS21: {
          name: this.name,
          studentId: this.studentId,
          year: this.year,
          program: this.program,
          email: this.email,
          phone: this.phone,
          scores: {
            depression: {
              score: depressionScore,
              level: this.getLevel('depression', depressionScore)
            },
            anxiety: {
              score: anxietyScore,
              level: this.getLevel('anxiety', anxietyScore)
            },
            stress: {
              score: stressScore,
              level: this.getLevel('stress', stressScore)
            }
          },
          responses: this.answers.map((answer, index) => ({
            question: this.questions[index].text,
            answer: answer !== null ? ['ไม่เลย', 'บางครั้ง', 'บ่อย', 'เป็นประจำ'][answer] : null,
            score: answer
          }))
        }
      }

      // Log summary
      console.log('DASS-21 Assessment Summary:', JSON.stringify(summary, null, 2))

      // Store assessment data
      store.mutations.setAssessmentData({
        fullname: this.name,
        studentId: this.studentId,
        year: this.year,
        program: this.program,
        email: this.email,
        phone: this.phone,
        scores: {
          depression: depressionScore,
          anxiety: anxietyScore,
          stress: stressScore
        },
        answers: this.answers,
        summary: summary
      })

      // Set assessment date
      setAssessmentDate()

      // Navigate to results
      this.$router.push('/assessment/result')
    },
    validateStudentId() {
      const numberPattern = /^\d+$/
      this.studentId = this.studentId.replace(/[^\d]/g, '')
      this.isValidStudentId = numberPattern.test(this.studentId) && this.studentId.length === 10
    },
    validatePhone() {
      const numberPattern = /^\d+$/
      this.phone = this.phone.replace(/[^\d]/g, '')
      this.isValidPhone = numberPattern.test(this.phone) && this.phone.length === 10
    },
    validateEmail() {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      this.isValidEmail = emailPattern.test(this.email)
    }
  },
  watch: {
    email() {
      this.validateEmail()
    }
  },
  mounted() {
    // ตรวจสอบว่าสามารถทำแบบประเมินได้หรือไม่เมื่อโหลดหน้า
    const availability = checkAssessmentAvailability();
    if (!availability.canTake) {
      // ถ้าทำไม่ได้ ให้ redirect ไปหน้าแจ้งเตือน
      this.$router.replace({
        path: '/assessment/unavailable',
        query: {
          daysLeft: availability.daysLeft,
          nextDate: availability.nextDate
        }
      })
    }
    this.currentQuestionIndex = -1
  }
}
</script>

<style scoped>
.assessment-page {
  min-height: 50vh;
  padding: 2rem 0;
  background-color: #f8f9fa;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.assessment-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.assessment-header {
  text-align: center;
  margin-bottom: 2rem;
}

.assessment-header h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.assessment-header p {
  color: #666;
  font-size: 1.1rem;
}

.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #28bf7e;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 0.5rem;
  color: #666;
}

.question {
  margin-bottom: 2rem;
}

.question h2 {
  color: #2c3e50;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option {
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option:hover {
  border-color: #28bf7e;
  background-color: #f8f9fa;
}

.option.selected {
  border-color: #28bf7e;
  background-color: #e8f5e9;
}

.name-input-container {
  margin-bottom: 2rem;
}

.name-input-container h5 {
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-label {
  text-align: left;
  width: 100%;
  display: block;
  margin-bottom: 0.5rem;
}

.form-group {
  max-width: 400px;
  margin: 0 auto;
}
/* 
.form-control {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: border-color 0.2s ease;
} */

.form-control:focus {
  outline: none;
  border-color: #28bf7e;
}

.button-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
}

.btn-primary {
  background-color: #28bf7e;
  border-color: #28bf7e;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.cooldown-message {
  text-align: center;
  margin-bottom: 2rem;
}

.back-home-btn {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  background-color: #28bf7e;
  border-color: #28bf7e;
  color: white;
  text-decoration: none;
}

.button-container.form-buttons {
  justify-content: center;
}

.button-container.form-buttons .btn-primary {
  width: 100%;
  max-width: 400px;
}

.privacy-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.privacy-popup-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.privacy-popup-content h4 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.privacy-popup-content p {
  margin-bottom: 25px;
  line-height: 1.6;
}

.privacy-popup-content button {
  min-width: 120px;
  font-weight: 500;
}
</style>
