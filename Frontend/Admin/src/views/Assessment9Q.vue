<template>
  <div class="assessment-page">
    <div class="container">
      <div class="assessment-container">
        <!-- Header -->
        <div class="assessment-header">
          <h1>แบบประเมินโรคซึมเศร้า 9 คำถาม (9Q)</h1>
          <p>ในช่วง 2 สัปดาห์ที่ผ่านมา รวมทั้งวันนี้ ท่านมีอาการเหล่านี้บ่อยแค่ไหน</p>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container">
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
          <h2>กรุณากรอกชื่อของคุณ</h2>
          <div class="form-group">
            <input 
              type="text" 
              v-model="name" 
              class="form-control" 
              placeholder="ชื่อ-นามสกุล"
              required
            >
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="button-container">
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

export default {
  name: 'Assessment9Q',
  data() {
    return {
      currentQuestionIndex: 0,
      answers: Array(9).fill(null),
      name: '',
      options: [
        'ไม่มีเลย',
        'เป็นบางวัน',
        'เป็นบ่อย',
        'เป็นทุกวัน'
      ],
      questions: [
        { text: '1. เบื่อ ไม่สนใจอยากทำอะไร' },
        { text: '2. ไม่สบายใจ ซึมเศร้า ท้อแท้' },
        { text: '3. หลับยาก หรือหลับๆ ตื่นๆ หรือหลับมากไป' },
        { text: '4. เหนื่อยง่าย หรือ ไม่ค่อยมีแรง' },
        { text: '5. เบื่ออาหาร หรือกินมากเกินไป' },
        { text: '6. รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลว หรือทำให้ตนเองหรือครอบครัวผิดหวัง' },
        { text: '7. สมาธิไม่ดีเวลาทำอะไร เช่น ดูโทรทัศน์ ฟังวิทยุ หรือทำงานที่ต้องใช้ความตั้งใจ' },
        { text: '8. พูดช้า ทำอะไรช้าลง จนคนอื่นสังเกตเห็นได้ หรือกระสับกระส่ายไม่สามารถอยู่นิ่งได้เหมือนที่เคยเป็น' },
        { text: '9. คิดทำร้ายตนเอง หรือคิดว่าถ้าตายไปคงจะดี' }
      ]
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
        return this.name.trim() !== ''
      }
      return this.currentAnswer !== null
    }
  },
  methods: {
    selectAnswer(index) {
      this.answers[this.currentQuestionIndex] = index
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
    async submitAssessment() {
      // คำนวณคะแนนรวม
      const total = this.answers.reduce((sum, answer) => sum + answer, 0);
      
      // บันทึกข้อมูลลงใน store
      store.assessmentData = {
        ...store.assessmentData,
        nineQ: {
          answers: this.answers,
          total: total,
          date: new Date().toISOString()
        }
      };

      // แสดงข้อความแจ้งเตือน
      alert('บันทึกแบบประเมินเรียบร้อยแล้ว');

      // นำทางไปยังหน้าผลลัพธ์
      this.$router.push({
        name: 'Result9Q',
        query: { score: total }
      });
    }
  }
}
</script>

<style scoped>
.assessment-page {
  padding: 80px 0;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.assessment-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  /* box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); */
}

.assessment-header {
  text-align: center;
  margin-bottom: 2rem;
}

.assessment-header h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
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
  background-color:#28bf7e;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 0.5rem;
  color: #6c757d;
}

.question-container {
  margin-bottom: 2rem;
}

.question h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option {
  padding: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option:hover {
  background-color: #f8f9fa;
}

.option.selected {
  background-color: #e9ecef;
  border-color: #28bf7e;
}

.name-input-container {
  margin-bottom: 2rem;
}

.form-control {
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 8px;
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

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
