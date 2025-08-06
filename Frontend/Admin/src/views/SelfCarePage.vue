<template>
  <div class="selfcare-page">
    <div class="container">
    <div class="row">
        <div class="col-sm-8 offset-sm-2">
          <div class="section-title text-center" data-aos="fade-up">
            <h1>Self-care : วิธีดูแลสุขภาพใจตัวเอง</h1>
            <p>เรียนรู้วิธีการดูแลสุขภาพจิตด้วยตนเองผ่านบทความและคำแนะนำที่เป็นประโยชน์</p>
          </div>
        </div>
        </div>
      <div class="row">
        <div class="col-12">
          <SelfCareSectionNoHead />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelfCareSectionNoHead from '@/components/SelfCareSectionNoHead.vue'

export default {
  name: 'SelfCarePage',
  components: {
    SelfCareSectionNoHead
  }
}
</script>

<style scoped>
.selfcare-page {
  padding: 120px 0 60px;
}

.section-title {
  margin-bottom: 40px;
}

.section-title h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.section-title p {
  color: #666;
  font-size: 1.1rem;
}
</style>
