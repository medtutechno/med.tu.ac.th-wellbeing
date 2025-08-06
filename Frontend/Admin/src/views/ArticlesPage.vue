<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <h1 class="text-center mb-4">บทความด้านสุขภาพใจ</h1>
        
        <!-- บทความที่ 1 -->
        <div class="card mb-4">
          <div class="card-body">
            <h2>ความเครียดและการจัดการ</h2>
            <p class="text-muted mb-3">
              <i class="fas fa-calendar-alt me-2"></i>14 มกราคม 2567
            </p>
            <p>ความเครียดเป็นส่วนหนึ่งของชีวิตที่ทุกคนต้องเผชิญ แต่การจัดการความเครียดที่ดีจะช่วยให้เราสามารถใช้ชีวิตได้อย่างมีความสุขมากขึ้น...</p>
            <a href="#" class="btn btn-outline-primary">อ่านเพิ่มเติม</a>
          </div>
        </div>

        <!-- บทความที่ 2 -->
        <div class="card mb-4">
          <div class="card-body">
            <h2>การนอนหลับที่มีคุณภาพ สำคัญต่อสุขภาพใจอย่างไร</h2>
            <p class="text-muted mb-3">
              <i class="fas fa-calendar-alt me-2"></i>12 มกราคม 2567
            </p>
            <p>การนอนหลับที่เพียงพอและมีคุณภาพ ไม่เพียงแต่ส่งผลดีต่อร่างกาย แต่ยังมีความสำคัญต่อสุขภาพจิตใจอย่างมาก...</p>
            <a href="#" class="btn btn-outline-primary">อ่านเพิ่มเติม</a>
          </div>
        </div>

        <!-- บทความที่ 3 -->
        <div class="card mb-4">
          <div class="card-body">
            <h2>ความสัมพันธ์ระหว่างการออกกำลังกายและสุขภาพจิต</h2>
            <p class="text-muted mb-3">
              <i class="fas fa-calendar-alt me-2"></i>10 มกราคม 2567
            </p>
            <p>การออกกำลังกายไม่เพียงแต่ช่วยให้ร่างกายแข็งแรง แต่ยังส่งผลดีต่อสุขภาพจิตใจ ช่วยลดความเครียด และเพิ่มความสุข...</p>
            <a href="#" class="btn btn-outline-primary">อ่านเพิ่มเติม</a>
          </div>
        </div>

        <!-- บทความที่ 4 -->
        <div class="card mb-4">
          <div class="card-body">
            <h2>การดูแลสุขภาพจิตในวัยทำงาน</h2>
            <p class="text-muted mb-3">
              <i class="fas fa-calendar-alt me-2"></i>8 มกราคม 2567
            </p>
            <p>ชีวิตการทำงานที่เร่งรีบและความกดดันต่างๆ อาจส่งผลต่อสุขภาพจิต เรียนรู้วิธีการดูแลตัวเองและรักษาสมดุลระหว่างงานกับชีวิตส่วนตัว...</p>
            <a href="#" class="btn btn-outline-primary">อ่านเพิ่มเติม</a>
          </div>
        </div>

        <!-- Pagination -->
        <nav aria-label="Page navigation" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item disabled">
              <a class="page-link" href="#" tabindex="-1">Previous</a>
            </li>
            <li class="page-item active"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item">
              <a class="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticlesPage'
}
</script>

<style scoped>
h1 {
  color: #2c3e50;
}

h2 {
  color: #42b983;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.card {
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.card-body {
  padding: 2rem;
}

.btn-outline-primary {
  color: #42b983;
  border-color: #42b983;
}

.btn-outline-primary:hover {
  background-color: #42b983;
  border-color: #42b983;
  color: white;
}

.pagination .page-link {
  color: #42b983;
}

.pagination .active .page-link {
  background-color: #42b983;
  border-color: #42b983;
}
</style>
