<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">ผลการประเมิน 9Q</h2>
        
        <template v-if="getResult">
          <h3 class="mb-3">ผลการประเมิน: {{ getResult.level }}</h3>
          <p class="lead">{{ getResult.description }}</p>
          
          <div v-if="getResult.risk" class="alert alert-warning mt-4">
            <h5 class="alert-heading">คำแนะนำเพิ่มเติม</h5>
            <p>จากผลการประเมิน แนะนำให้ท่านจองคิวเพื่อรับการบำบัดและคำปรึกษาจากผู้เชี่ยวชาญ</p>
          </div>
        </template>

        <div class="text-center mt-4">
          <router-link 
            v-if="getResult && getResult.risk"
            to="/booking" 
            class="btn btn-primary btn-lg mb-3"
          >
            <i class="fas fa-calendar-check me-2"></i>จองคิวรับการบำบัด
          </router-link>
          <br>
          <router-link to="/" class="btn btn-outline-secondary">
            กลับหน้าหลัก
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store/assessment'
import { nextTick } from 'vue'

export default {
  name: 'Result9Q',
  data() {
    return {
      assessmentData: store.assessmentData,
      score: store.assessmentData.nineQ.total
    }
  },
  computed: {
    getResult() {
      const score = this.score;
      if (score >= 0 && score <= 6) {
        return {
          level: 'ไม่มีอาการของโรคซึมเศร้าหรือมีน้อยมาก',
          description: 'สามารถดำเนินชีวิตได้ตามปกติ ควรพักผ่อนให้เพียงพอและออกกำลังกายสม่ำเสมอ',
          risk: false
        };
      } else if (score >= 7 && score <= 12) {
        return {
          level: 'มีอาการของโรคซึมเศร้า ระดับน้อย',
          description: 'ควรพักผ่อนให้เพียงพอ ออกกำลังกายสม่ำเสมอ และติดตามอาการอย่างใกล้ชิด',
          risk: true
        };
      } else if (score >= 13 && score <= 18) {
        return {
          level: 'มีอาการของโรคซึมเศร้า ระดับปานกลาง',
          description: 'ควรพบแพทย์เพื่อประเมินอาการและรับคำปรึกษา',
          risk: true
        };
      } else {
        return {
          level: 'มีอาการของโรคซึมเศร้า ระดับรุนแรง',
          description: 'ควรพบแพทย์โดยเร็วที่สุดเพื่อประเมินอาการและรับการรักษา',
          risk: true
        };
      }
    }
  },
  async created() {
    await nextTick();
    
    if (!this.assessmentData?.nineQ?.total) {
      this.$router.replace('/');
      return;
    }

    // Log assessment data
    console.log('========= ผลการประเมินทั้งหมด =========');
    console.log('ชื่อผู้ทำแบบประเมิน:', this.assessmentData.fullname);
    
    console.log('\n-------- ผลการประเมิน DASS --------');
    console.log('คำตอบแต่ละข้อ DASS:', JSON.stringify(this.assessmentData.answers, null, 2));
    console.log('คะแนนแยกตามด้าน:');
    console.log('- ความเครียด:', this.assessmentData.scores.stress);
    console.log('- ความวิตกกังวล:', this.assessmentData.scores.anxiety);
    console.log('- ภาวะซึมเศร้า:', this.assessmentData.scores.depression);
    
    console.log('\n-------- ผลการประเมิน 9Q --------');
    console.log('คำตอบแต่ละข้อ 9Q:', JSON.stringify(this.assessmentData.nineQ.answers, null, 2));
    console.log('คะแนนรวม 9Q:', this.assessmentData.nineQ.total);
    console.log('================================');
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style>
