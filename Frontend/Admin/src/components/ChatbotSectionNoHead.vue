<template>
    <div class="clients-section4" id="chatbot">
      <div class="container">
        <div class="row">
          <div class="col-sm-6 offset-sm-3">
            <div class="section-title text-center" data-aos="fade-up">
              <!-- <h1>หน่วยงาน โปรแกรม และChat bot ที่ช่วยดูแล<br><span class="gradient-text">สุขภาพใจ</span></h1> -->
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="clients-items4" data-aos="fade-up">
              <swiper
                :modules="modules"
                :slides-per-view="1"
                :space-between="30"
                :navigation="true"
                :pagination="{ clickable: true }"
                :autoplay="{ delay: 5000, disableOnInteraction: false }"
                :loop="true"
              >
                <swiper-slide v-for="(item, index) in chatbotItems" :key="index">
                  <div class="clients-item4 section-heading4">
                    <div class="row">
                      <div v-for="(service, serviceIndex) in item" :key="serviceIndex" class="col-lg-6">
                        <div class="clients-meta4">
                          <div class="thumb">
                            <img :src="service.image" style="max-width: 80px!important;" :alt="service.title">
                          </div>
                          <div class="content">
                            <h4>{{ service.title }}</h4>
                            <span v-if="service.phone">{{ service.phone }}</span>
                            <ul class="rating">
                              <li>{{ service.hours }}</li>
                            </ul>
                          </div>
                        </div>
                        <div v-if="service.description" class="service-description" v-html="service.description"></div>
                      </div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Navigation, Pagination, Autoplay } from 'swiper/modules'
  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'
  
  export default {
    name: 'ChatbotSectionNoHead',
    components: {
      Swiper,
      SwiperSlide
    },
    data() {
      return {
        modules: [Navigation, Pagination, Autoplay],
        chatbotItems: [
          [
            {
              title: 'ศูนย์บริการให้คำปรึกษานักศึกษามหาวิทยาลัยธรรมศาสตร์',
              phone: '02-0282222 , 026966604',
              hours: 'เวลาทำการ 8.00 – 16.30 น.',
              image: 'https://www.med.tu.ac.th/cms-medical-student/images/2023-02-24/logo01.jpeg',
              description: '<p>บริการให้คำปรึกษา เช่น ด้านการเรียน การปรับตัวโดยรวม และปัญหาด้านสุขภาพจิต</p><p>สามารถติดต่อเพื่อขอรับบริการได้ที่ NOC 06 (บริเวณหอพักเอเชียนเกมส์ โซน C6) หรือ Online สามารถนัดหมายบริการผ่าน google form <a href="https://forms.gle/VCvhvMsyDyodqx6F6">สำหรับนักศึกษาทั่วไป</a> และ <a href="https://forms.gle/uQyXeujtCXcVtTtg6">สำหรับนักศึกษาต่างชาติ</a></p><p>หรือทาง <a href="https://tu.ac.th/thammasat-mental-health">website</a></p>'
            },
            {
              title: 'Hot Line กองกิจการนักศึกษามหาวิทยาลัยธรรมศาสตร์',
              phone: '098-8488421',
              hours: 'เวลาทำการ 22.00 – 04.00 น.',
              image: '/src/assets/default-app.png' 
            }
          ],
          [
            {
              title: 'Woebot : application ที่ช่วยดูแลใจ (ภาษาอังกฤษ)',
              hours: '',
              image: 'https://www.med.tu.ac.th/cms-medical-student/images/2023-02-09/woebot.png',
              description: '<p>Think through situations with step-by-step guidance using proven therapeutic frameworks like Cognitive Behavioral Therapy (CBT)</p>'
            },
            {
              title: 'สายด่วนสุขภาพจิต',
              phone: '1323',
              hours: 'เวลาทำการ วันพุธ 13.00 – 15.00 น.',
              image: 'https://www.med.tu.ac.th/cms-medical-student/images/2023-02-09/sayduan.png',
              description: '<p>สามารถประเมินอารมณ์หรือพูดคุยเบื้องต้นกับ Chatbot\nLine: @147nzgad</p>'
            }
          ],
          [
            {
              title: 'สะมาริตันส์',
              phone: '02-7136793',
              hours: 'เวลาทำการ 12.00 – 22.00 น.',
              image: 'https://www.med.tu.ac.th/cms-medical-student/images/2022-12-16/samaritans.jpg'
            },
            {
              title: 'คลินิกใจสบาย คณะพยาบาลศาสตร์',
              phone: '02-9869213 ต่อ 7362',
              hours: 'เวลาทำการ วันอังคารและวันพุธ 13.00 – 15.00 น.',
              image: '/src/assets/default-app.png'
            }
          ],
          [
            {
              title: 'คลินิกเลิกบุหรี่ คณะพยาบาลศาสตร์',
              phone: '02-9869213 ต่อ 7362',
              hours: 'เวลาทำการ วันพุธ 13.00 – 15.00 น.',
              image: 'https://www.med.tu.ac.th/cms-medical-student/images/2023-02-10/default-app.png'
            },
            {
              title: 'คลินิกสุขภาพจิต สำหรับนักศึกษาแพทย์ โรงพยาบาลธรรมศาสตร์ฯ',
              phone: '02-9269899',
              hours: 'เวลาทำการ ทุกวันพุธ 11.00 - 14.00',
              image: 'https://www.med.tu.ac.th/cms-medical-student/images/2023-02-09/clinic-psychiatry.png',
              description: '<p>โทรนัดหมายด้วยตนเอง แจ้งว่าเป็นนักศึกษาแพทย์ ต้องการนัดพบหมอที่คลีนิกสบายใจ</p>'
            }
          ]
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .clients-section4 {
    padding: 100px 50px;
    background: #f8f9fa;
    border-radius: 15px;

  }
  
  .section-title h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
  
  .gradient-text {
    background: var(--gradientPrimary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .clients-meta4 {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .clients-meta4 .thumb img {
    border-radius: 10px;
    object-fit: cover;
  }
  
  .clients-meta4 .content {
    flex: 1;
  }
  
  .clients-meta4 .content h4 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
  
  .clients-meta4 .content span {
    display: block;
    color: #666;
    margin-bottom: 0.5rem;
  }
  
  .clients-meta4 .content .rating li {
    color: #666;
    list-style: none;
  }
  
  .service-description {
    margin-bottom: 2rem;
  }
  
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    color: #333;
  }
  
  :deep(.swiper-button-next:hover),
  :deep(.swiper-button-prev:hover) {
    background: var(--gradientPrimary);
    color: #fff;
  }
  
  :deep(.swiper-button-next::after),
  :deep(.swiper-button-prev::after) {
    font-size: 18px;
  }
  
  :deep(.swiper-pagination-bullet) {
    background: #666;
  }
  
  :deep(.swiper-pagination-bullet-active) {
    background: var(--gradientPrimary);
  }
  
  @media (max-width: 768px) {
    .section-title h1 {
      font-size: 2rem;
    }
    
    .clients-meta4 {
      flex-direction: column;
      text-align: center;
      align-items: center;
    }
    
    .clients-meta4 .content {
      text-align: center;
    }
    
    .service-description {
      text-align: center;
    }
  }
  </style>
  