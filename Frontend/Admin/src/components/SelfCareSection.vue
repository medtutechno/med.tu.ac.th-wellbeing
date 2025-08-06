<template>
  <div class="online-team-area padding-area">
    <div class="ota-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-sm-6 offset-sm-3">
            <div class="section-title text-center" data-aos="fade-up">
              <h1>วิธีดูแลสุขภาพใจเบื้องต้น</h1>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="ota-items">
              <div v-for="(item, index) in selfCareItems" :key="index" 
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
  name: 'SelfCareSection',
  data() {
    return {
      selfCareItems: [
        {
          title: 'Stress relief : ทำอะไรได้บ้างเพื่อคลายเครียด',
          description: 'ถึงจะเครียด แต่เรารู้แล้วว่าการผ่อนคลายความเครียดนั้นไม่ยากเลย',
          image: 'https://www.med.tu.ac.th/cms-medical-student/images/2022-08-06/content_8.png',
          link: 'https://www.med.tu.ac.th/medical-student/content/selfcare/28'
        },
        {
          title: 'Grounding : กลับมาอยู่กับปัจจุบัน',
          description: 'บ่อยครั้งเมื่อเรารู้สึกไม่สบายใจหรือกังวล แว่บหนึ่งที่เรารู้ตัวกลับพบว่าเราเองกำลังวิ่งวนอยู่กับความคิดมากมายที่จู่โจมเข้ามาไม่หยุดหย่อนจนทำให้มีอารมณ์ท่วมท้นเข้มข้นมากขึ้น',
          image: 'https://www.med.tu.ac.th/cms-medical-student/images/2022-08-06/content_10.png',
          link: 'https://www.med.tu.ac.th/medical-student/content/selfcare/27'
        },
        {
          title: 'Relaxation technique : เทคนิคช่วยผ่อนคลาย',
          description: 'การเรียนรู้เพื่อควบคุมความรู้สึกเครียดหรือกังวล มีประโยชน์สำหรับการทำให้ร่างกายและจิตใจสงบลง ลดความตึงเครียดของกล้ามเนื้อได้',
          image: 'https://www.med.tu.ac.th/cms-medical-student/images/2022-08-06/content_7.png',
          link: 'https://www.med.tu.ac.th/medical-student/content/selfcare/26'
        },
        {
          title: 'Manage your anxiety : เข้าใจความกังวล',
          description: 'วิธีจัดการกับความกังวลแท้จริงแล้วมีหลายวิธี เพียงแต่ต้องทำความรู้จักกับเครื่องมือเหล่านี้ก่อนและทดลองฝึกใช้จนกลายเป็นทักษะส่วนบุคคล เมื่อเผชิญกับความกังวลเราจึงสามารถควบคุมมันได้เร็วและไม่ให้โอกาสมันครอบงำเรา',
          image: 'https://www.med.tu.ac.th/cms-medical-student/images/2022-08-06/content_9.png',
          link: 'https://www.med.tu.ac.th/medical-student/content/selfcare/25'
        },
        {
          title: 'Improving your mood : ดูแลความเศร้าของเราเอง',
          description: 'ในช่วงชีวิตหนึ่ง เราทุกคนคงเคยผ่านช่วงเวลาที่รู้สึกไม่มีความสุขมาบ้างและบางครั้งเราก็อาจรู้สึกเศร้า ในช่วงนั้นเรารับรู้ได้ว่ามันยากเหลือเกินที่จะบังคับตัวเองให้ลุกขึ้นมาทำอะไรบางอย่าง เราเบื่อที่จะทำอะไรที่เราเคยชื่นชอบ แท้จริงแล้วประสบการณ์เหล่านี้ต่างเป็นส่วนหนึ่งของชีวิตและเราทุกคนล้วนเผชิญกับประสบการณ์เหล่านี้ในบางเวลาของชีวิต',
          image: 'https://www.med.tu.ac.th/cms-medical-student/images/2022-08-06/content_6.png',
          link: 'https://www.med.tu.ac.th/medical-student/content/selfcare/24'
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
