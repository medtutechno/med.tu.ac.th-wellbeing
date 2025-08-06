<template>
  <div class="hero-area">
    <div class="hero-items" style="background-image: url(https://www.med.tu.ac.th/medical-student/assets/background_top.png)">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <div class="hero-main-content" data-aos="fade-up">
              <h1>ประเมินสุขภาพใจ<br><span>ตัวเอง</span></h1>
              <p>แบบประเมินนี้จะช่วยประเมินอารมณ์ซึมเศร้า วิตกกังวล และความเครียด เบื้องต้น ใช้เวลาทำประมาณ 5-10 นาที เมื่อทำเสร็จแล้ว นักศึกษาจะได้ทราบว่าตนเองมีภาวะต่างๆอยู่ในระดับใด พร้อมคำแนะนำเพื่อนำไปใช้ดูแลตัวเองเบื้องต้น</p>
              <div class="get-started-btn">
                <router-link to="/assessment" class="assessment-link">
                  แบบประเมินภาวะเศร้า วิตกกังวล และเครียด
                  <span><i class="fa-solid fa-arrow-right"></i></span>
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-5 d-none d-lg-block">
            <div class="hero-image" data-aos="fade-left">
              <slot name="hero-image">
                <img src="@/assets/top-img.png" style="max-height: 80vh;" class="img-fluid rounded" alt="hero image">
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroSection'
}
</script>

<style scoped>
.hero-area {
  position: relative;
  overflow: hidden;
  background-color: transparent;
}

.hero-items {
  position: relative;
  padding: 50px 0;
  background-size: cover;
  background-position: center;
  min-height: 600px;
  display: flex;
  align-items: center;
}

.hero-main-content {
  position: relative;
  z-index: 3;
  padding-right: 20px;
}

.hero-main-content h1 {
  font-size: 4rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  line-height: 1.2;
}

.hero-main-content h1 span {
  color: #28bf7e;
}

.hero-main-content p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
  max-width: 600px;
}

.hero-image {
  position: relative;
  text-align: center;
  z-index: 2;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.get-started-btn {
  text-align: center;
}

.assessment-link {
  font-size: 28px;
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #28bf7e;
  color: #fff;
  padding: 15px 30px;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.assessment-link:hover {
  background: #219d68;
  transform: translateY(-2px);
  color: #fff;
}

.assessment-link span {
  margin-left: 10px;
}

/* Large devices (desktops, less than 1200px) */
@media (max-width: 1199.98px) {
  .hero-main-content h1 {
    font-size: 3.5rem;
  }
  
  .hero-items {
    padding: 80px 0;
  }
}

/* Medium devices (tablets, less than 992px) */
@media (max-width: 991.98px) {
  .hero-main-content h1 {
    font-size: 3rem;
  }
  
  .hero-main-content p {
    font-size: 1rem;
  }
  
  .assessment-link {
    font-size: 20px !important;
    padding: 12px 25px;
  }
  
  .hero-image {
    margin-top: 40px;
  }
  
  .hero-items {
    padding: 60px 0;
    min-height: auto;
  }
}

/* Small devices (landscape phones, less than 768px) */
@media (max-width: 767.98px) {
  .hero-main-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-main-content {
    text-align: center;
    padding-right: 0;
  }
  
  .hero-main-content p {
    margin-left: auto;
    margin-right: auto;
  }
  
  .get-started-btn {
    text-align: center;
  }
  
  .assessment-link {
    font-size: 18px !important;
    padding: 10px 20px;
  }
  
  .hero-items {
    padding: 40px 0;
  }
}

/* Extra small devices (portrait phones, less than 576px) */
@media (max-width: 575.98px) {
  .hero-main-content h1 {
    font-size: 2rem;
  }
  
  .hero-main-content p {
    font-size: 0.9rem;
  }
  
  .assessment-link {
    font-size: 16px !important;
    padding: 8px 16px;
    width: 100%;
    justify-content: center;
  }
  
  .hero-items {
    padding: 30px 0;
  }
}
</style>
