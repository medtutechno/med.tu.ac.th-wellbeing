<template>
  <div class="container mt-5 mb-5">
    <div class="">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">จองคิวรับการบำบัด</h2>
        
        <form @submit.prevent="submitBooking" class="needs-validation" novalidate>
          <!-- ข้อมูลส่วนตัว -->
          <div class="mb-4">
            <h4 class="mb-3">ข้อมูลส่วนตัว</h4>
            
            <div class="row g-3">
              <div class="col-md-6">
                <label for="fullname" class="form-label">ชื่อ-นามสกุล <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="fullname" 
                  v-model="formData.fullname"
                  placeholder="กรุณากรอกชื่อ-นามสกุล"
                  required
                >
                <div class="invalid-feedback">
                  กรุณากรอกชื่อ-นามสกุล
                </div>
              </div>

              <div class="col-md-6">
                <label for="studentId" class="form-label">รหัสนักศึกษา <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="studentId" 
                  v-model="formData.studentId"
                  placeholder="กรุณากรอกรหัสนักศึกษา"
                  pattern="[0-9]{10}"
                  required
                >
                <div class="invalid-feedback">
                  กรุณากรอกรหัสนักศึกษา 10 หลัก
                </div>
              </div>

              <div class="col-md-6">
                <label for="faculty" class="form-label">คณะ <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="faculty" 
                  v-model="formData.faculty"
                  required
                >
                <div class="invalid-feedback">
                  กรุณาระบุคณะ
                </div>
              </div>

              <div class="col-md-6">
                <label for="department" class="form-label">ภาควิชา <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="department" 
                  v-model="formData.department"
                  required
                >
                <div class="invalid-feedback">
                  กรุณาระบุภาควิชา
                </div>
              </div>

              <div class="col-md-6">
                <label for="year" class="form-label">ชั้นปี <span class="text-danger">*</span></label>
                <select 
                  class="form-select" 
                  id="year" 
                  v-model="formData.year"
                  required
                >
                  <option value="">เลือกชั้นปี</option>
                  <option v-for="year in 6" :key="year" :value="year">
                    ปี {{ year }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  กรุณาเลือกชั้นปี
                </div>
              </div>

              <div class="col-md-6">
                <label for="phone" class="form-label">เบอร์โทรศัพท์ <span class="text-danger">*</span></label>
                <input 
                  type="tel" 
                  class="form-control" 
                  id="phone" 
                  v-model="formData.phone"
                  pattern="[0-9]{10}"
                  required
                >
                <div class="invalid-feedback">
                  กรุณาระบุเบอร์โทรศัพท์ที่ถูกต้อง (10 หลัก)
                </div>
              </div>

              <div class="col-12">
                <label for="email" class="form-label">อีเมล <span class="text-danger">*</span></label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="formData.email"
                  required
                >
                <div class="invalid-feedback">
                  กรุณาระบุอีเมลที่ถูกต้อง
                </div>
              </div>
            </div>
          </div>

          <!-- ข้อมูลการจอง -->
          <div class="mb-4">
            <h4 class="mb-3">ข้อมูลการจอง</h4>
            
            <div class="row g-3">
              <div class="col-md-6">
                <label for="date" class="form-label">วันที่ต้องการจอง <span class="text-danger">*</span></label>
                <input 
                  type="date" 
                  class="form-control" 
                  id="date" 
                  v-model="formData.bookingDate"
                  :min="minDate"
                  required
                >
                <div class="invalid-feedback">
                  กรุณาเลือกวันที่ต้องการจอง
                </div>
              </div>

              <div class="col-md-6">
                <label for="time" class="form-label">เวลาที่ต้องการจอง <span class="text-danger">*</span></label>
                <select 
                  class="form-select" 
                  id="time" 
                  v-model="formData.bookingTime"
                  required
                >
                  <option value="">เลือกเวลา</option>
                  <option 
                    v-for="time in availableTimes" 
                    :key="time.value" 
                    :value="time.value"
                  >
                    {{ time.label }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  กรุณาเลือกเวลาที่ต้องการจอง
                </div>
              </div>
            </div>
          </div>

          <div class="d-grid gap-2">
            <button class="btn btn-primary btn-lg" type="submit">
              ยืนยันการจองคิว
            </button>
            <router-link to="/" class="btn btn-outline-secondary">
              กลับหน้าหลัก
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingFormWithName',
  data() {
    return {
      formData: {
        fullname: '',
        studentId: '',
        faculty: '',
        department: '',
        year: '',
        phone: '',
        email: '',
        bookingDate: '',
        bookingTime: ''
      },
      availableTimes: [
        { value: '1', label: 'คิวที่ 1' },
        { value: '2', label: 'คิวที่ 2' },
        { value: '3', label: 'คิวที่ 3' },
        { value: '4', label: 'คิวที่ 4' },
        { value: '5', label: 'คิวที่ 5' },
        { value: '6', label: 'คิวที่ 6' },
        { value: '7', label: 'คิวที่ 7' },
        { value: '8', label: 'คิวที่ 8' },
        { value: '9', label: 'คิวที่ 9' },
        { value: '10', label: 'คิวที่ 10' }
      ]
    }
  },
  computed: {
    minDate() {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().split('T')[0]
    }
  },
  methods: {
    submitBooking() {
      // เพิ่ม class was-validated เพื่อแสดง validation
      this.$el.querySelector('form').classList.add('was-validated')

      // ตรวจสอบว่าฟอร์มถูกต้องหรือไม่
      if (this.$el.querySelector('form').checkValidity()) {
        // TODO: ส่งข้อมูลไปยัง API หรือ store
        console.log('Booking Data:', this.formData)
        
        // แสดง alert แจ้งสำเร็จ
        alert('จองคิวสำเร็จ! เราจะติดต่อกลับไปทางอีเมลที่ท่านระบุ')
        
        // กลับไปหน้าหลัก
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
/* ซ่อน arrow ใน input type number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
