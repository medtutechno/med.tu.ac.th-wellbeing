<template>
  <div class="assessment-page">
    <div class="container" style="margin-top: 20px;">
      <div class="assessment-container">
        <!-- Header -->
        <div class="assessment-header">
          <h4>แบบประเมิน 8Q</h4>
          <p>กรุณาเลือกคำตอบที่ตรงกับความรู้สึกของคุณมากที่สุดในช่วง 1 เดือนที่ผ่านมา</p>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }"></div>
          </div>
          <div class="progress-text">{{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</div>
        </div>

        <!-- Question Display -->
        <div class="question-container">
          <div class="question" :key="currentQuestionIndex">
            <h2>{{ currentQuestion.text }}</h2>
            <p v-if="currentQuestion.period">ในช่วง {{ currentQuestion.period }}</p>
            <div class="options">
              <div
                v-for="(option, index) in currentOptions"
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
  name: 'Assessment8Q',
  data() {
    return {
      currentQuestionIndex: 0,
      answers: Array(9).fill(null),
      questions: [
        { 
          text: '1. คิดอยากตาย หรือคิดว่าตายไปจะดีกว่า',
          score: 1,
          period: 'ช่วง 1 เดือนที่ผ่านมา'
        },
        { 
          text: '2. อยากทำร้ายตัวเอง หรือทำให้ตัวเองบาดเจ็บ',
          score: 2,
          period: 'ช่วง 1 เดือนที่ผ่านมา'
        },
        { 
          text: '3. คิดเกี่ยวกับการฆ่าตัวตาย',
          score: 6,
          period: 'ช่วง 1 เดือนที่ผ่านมา',
          hasSubQuestion: true
        },
        { 
          text: '3.2. ท่านสามารถควบคุมความอยากฆ่าตัวตายที่ท่านคิดอยู่นั้นได้หรือไม่ หรือบอกได้ไหมว่าคงจะไม่ทำตามความคิดนั้นในขณะนี้',
          score: 8,
          isSubQuestion: true,
          invertScore: true,
          customOptions: ['ได้', 'ไม่ได้']
        },
        { 
          text: '4. มีแผนการที่จะฆ่าตัวตาย',
          score: 8,
          period: 'ช่วง 1 เดือนที่ผ่านมา'
        },
        { 
          text: '5. ได้เตรียมการที่จะทำร้ายตนเอง หรือเตรียมการจะฆ่าตัวตาย โดยตั้งใจว่าจะให้ตายจริงๆ',
          score: 9,
          period: 'ช่วง 1 เดือนที่ผ่านมา'
        },
        { 
          text: '6. ได้ทำให้ตนเองบาดเจ็บ แต่ไม่ตั้งใจที่จะทำให้เสียชีวิต',
          score: 4,
          period: 'ช่วง 1 เดือนที่ผ่านมา'
        },
        { 
          text: '7. ได้พยายามฆ่าตัวตาย โดยคาดหวัง/ตั้งใจที่จะให้ตาย',
          score: 10,
          period: 'ช่วง 1 เดือนที่ผ่านมา'
        },
        { 
          text: '8. ท่านเคยพยายามฆ่าตัวตาย',
          score: 4,
          period: 'ตลอดชีวิตที่ผ่านมา'
        }
      ],
      options: [
        'ไม่มี',
        'มี'
      ]
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex]
    },
    currentOptions() {
      return this.currentQuestion.customOptions || this.options
    },
    currentAnswer() {
      return this.answers[this.currentQuestionIndex]
    },
    totalQuestions() {
      return this.questions.length
    },
    isFirstQuestion() {
      return this.currentQuestionIndex === 0
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1
    },
    canProceed() {
      return this.currentAnswer !== null
    },
    assessmentData: {
      get() {
        return store.state.assessmentData
      },
      set(value) {
        store.commit('updateAssessmentData', value)
      }
    }
  },
  methods: {
    selectAnswer(index) {
      this.answers[this.currentQuestionIndex] = index
    },
    calculateScore() {
      let totalScore = 0
      this.answers.forEach((answer, index) => {
        if (answer === null) return

        const question = this.questions[index]
        if (question.isSubQuestion) {
          if (question.invertScore) {
            totalScore += answer === 1 ? question.score : 0
          }
        } else {
          totalScore += answer === 1 ? question.score : 0
        }
      })
      return totalScore
    },
    getRiskLevel(score) {
      if (score >= 17) return 'รุนแรง'
      if (score >= 9) return 'ปานกลาง'
      if (score >= 1) return 'น้อย'
      return 'ไม่มี'
    },
    nextQuestion() {
      if (this.isLastQuestion) {
        this.submitAssessment()
      } else {
        if (this.currentQuestionIndex === 2 && this.currentAnswer === 0) {
          this.answers[3] = 0
          this.currentQuestionIndex += 2
        } else {
          this.currentQuestionIndex++
        }
      }
    },
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        if (this.currentQuestionIndex === 4 && this.answers[2] === 0) {
          this.currentQuestionIndex = 2
        } else {
          this.currentQuestionIndex--
        }
      }
    },
    submitAssessment() {
      const score = this.calculateScore()
      const riskLevel = this.getRiskLevel(score)
      
      const summary = {
        assessment8Q: {
          name: this.assessmentData?.fullname,
          score,
          riskLevel,
          responses: this.answers.map((answer, index) => ({
            question: this.questions[index].text,
            answer: this.currentOptions[answer],
            score: answer
          }))
        }
      }

      console.log('8Q Assessment Summary:', JSON.stringify(summary, null, 2))
      
      this.$router.push({
        path: '/assessment/8q/result',
        query: {
          score,
          riskLevel,
          name: this.assessmentData?.fullname,
          summary: JSON.stringify(summary)
        }
      })
    }
  },
  mounted() {
    if (!this.assessmentData?.fullname) {
      this.$router.push('/assessment')
    }
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
</style>
