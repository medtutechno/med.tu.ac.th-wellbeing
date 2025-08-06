<template>
  <div class="online-team-area padding-area">
    <div class="ota-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-sm-6 offset-sm-3">
            <div class="section-title text-center" data-aos="fade-up">
              <h1>ดูแลสุขภาพใจตัวเอง</h1>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="ota-items">
              <div v-for="(item, index) in knowledgeItems" :key="index" 
                   class="ota-item" data-aos="fade-up">
                <a :href="item.link">
                  <div class="ota-overlay">
                    <div class="ota-content">
                      <h4 class="ota-heading" style="font-weight: 300;color:white;">
                        {{ item.description }}
                      </h4>
                      <hr>
                    </div>
                  </div>
                </a>
                <a :href="item.link">
                  <img :src="item.image" :alt="item.title">
                </a>
                <div class="ota-content">
                  <h4 class="ota-heading">
                    <a :href="item.link">{{ item.title }}</a>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ota-pattern patterns" data-aos="slide-left" data-aos-duration="2000">
      <img src="assets/img/pattern/Coursetitle.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'MentalHealthKnowledge',
  data() {
    return {
      knowledgeItems: [
        {
          title: 'Hhshw',
          description: 'Hhhh',
          image: 'https://www.med.tu.ac.th/medical-student/assets/default-thumbnail-medtu.png',
          link: 'https://www.med.tu.ac.th/medical-student/content/knowledge/47'
        },
        {
          title: 'self care activities : ดูแลตัวเอง ดูแลใจ',
          description: 'nnvnvn',
          image: 'https://www.med.tu.ac.th/medical-student/assets/default-thumbnail-medtu.png',
          link: 'https://www.med.tu.ac.th/medical-student/content/knowledge/29'
        },
        {
          title: 'การใช้สารเสพติด',
          description: 'เคยไหมที่รู้สึกเครียดและกดดันจากการเรียน การใช้ชีวิตช่วงกลางวันก็แสนน่าเบื่อกว่าจะผ่านไปได้แต่แม้จะเบื่อหรือเหนื่อยหน่ายแค่ไหน',
          image: 'https://www.med.tu.ac.th/medical-student/assets/default-thumbnail-medtu.png',
          link: 'https://www.med.tu.ac.th/medical-student/content/knowledge/22'
        },
        {
          title: 'ความเครียด',
          description: 'ความเครียด แม้จะเป็นคำที่ดูเหมือนจะได้ยินกันบ่อยๆ แต่หลายต่อหลายคนก็มักจะชะล่าใจต่อคำนี้',
          image: 'https://www.med.tu.ac.th/cms-medical-student/images/2022-08-04/content_3.png',
          link: 'https://www.med.tu.ac.th/medical-student/content/knowledge/21'
        },
        {
          title: 'ความกังวล',
          description: '',
          image: 'https://www.med.tu.ac.th/cms-medical-student/images/2022-08-04/content_2.png',
          link: 'https://www.med.tu.ac.th/medical-student/content/knowledge/20'
        },
        {
          title: 'ซึมเศร้า',
          description: 'ซึมเศร้า',
          image: 'https://www.med.tu.ac.th/medical-student/assets/default-thumbnail-medtu.png',
          link: 'https://www.med.tu.ac.th/medical-student/content/knowledge/1'
        }
      ]
    }
  }
}
</script>

<style scoped>
.padding-area {
  padding: 100px 0;
  position: relative;
  overflow: hidden;
  background: #fff;
}

.ota-wrapper {
  position: relative;
  z-index: 1;
}

.section-title h1 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.ota-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 2rem;
}

.ota-item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  background: #fff;
}

.ota-item:hover {
  transform: translateY(-5px);
}

.ota-item img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.ota-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1;
}

.ota-item:hover .ota-overlay {
  opacity: 1;
}

.ota-content {
  padding: 20px;
}

.ota-heading {
  font-size: 1.2rem;
  margin: 0;
  line-height: 1.4;
}

.ota-heading a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.ota-heading a:hover {
  color: var(--home4-primary);
}

.ota-pattern {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.ota-pattern img {
  max-width: 300px;
  opacity: 0.1;
}

hr {
  border-color: rgba(255,255,255,0.3);
  margin: 15px 0;
}

@media (max-width: 768px) {
  .section-title h1 {
    font-size: 2rem;
  }
  
  .ota-items {
    grid-template-columns: 1fr;
  }
  
  .ota-pattern img {
    max-width: 200px;
  }
}
</style>
