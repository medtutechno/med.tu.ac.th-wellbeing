<template>
  <div class="contact-page">
    <div class="container">
      <div class="row">
        <div class="col-sm-8 offset-sm-2">
          <div class="section-title text-center" data-aos="fade-up">
            <h1>ติดต่อเรา</h1>
            <p>หากคุณมีคำถามหรือต้องการความช่วยเหลือ สามารถติดต่อเราได้ผ่านช่องทางต่างๆ</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6" data-aos="fade-right">
          <div class="contact-info">
            <h3>ข้อมูลการติดต่อ</h3>
            <ul>
              <li>
                <i class="fas fa-map-marker-alt"></i>&nbsp;
                <span>หากต้องการติดต่อ คลินิกสบายใจ รพ.ธรรมศาสตร์</span>
              </li>
              <li>
                <i class="fas fa-phone"></i>&nbsp;
                <span>02-926-9899  ในเวลาทำการ 8.00 - 16.00</span>
              </li>
              
              <li>
                <i class="fas fa-map-marker-alt"></i>&nbsp;
                <span>หากต้องการติดต่อ งานกิจการนักศึกษา</span>
              </li>
              <li>
                <i class="fas fa-phone"></i>&nbsp;
                <span>02-926-9701  ในเวลาทำการ 8.30 - 16.30</span>
               
              </li>
              
           

              <li> <i class="fas fa-map-marker-alt"></i>&nbsp; หรือ <a class="mobile-link" href="line://ti/p/@957rwkpy" style="text-decoration: none;">
   
    <span style="margin-left: 8px; color: #00B900;">LINE ACCOUNT @MdeTu.Well.Being</span> &nbsp; 
    <img src="https://scdn.line-apps.com/n/line_add_friends/btn/en.png" alt="Add LINE" style="height: 40px; vertical-align: middle;">
</a>
</li>
</ul>

            <div class="alert-box w-100">
              <p><strong>แจ้งเตือน:</strong> หากมีการติดต่อจากนักจิตวิทยาเพื่อยืนยันหรือเปลี่ยนนัด</p>
              <p>โปรดรับสายหมายเลข <strong>029-778-319</strong></p>
              <p>และติดต่อผ่าน Line Official Account: <strong>@MdeTu.Well.Being</strong></p>

              
            </div>
          </div>
        </div>
        <div class="col-md-6" data-aos="fade-left">
          <div class="contact-form">
            <h3>ส่งข้อความถึงเรา</h3>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <input 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.full_name }"
                  placeholder="ชื่อ-นามสกุล" 
                  v-model.trim="formData.full_name" 
                  required
                >
                <div class="invalid-feedback" v-if="errors.full_name">{{ errors.full_name }}</div>
              </div>
              <div class="form-group">
                <input 
                  type="tel" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.phone }"
                  placeholder="เบอร์โทร" 
                  v-model.trim="formData.phone"
                  @input="validatePhoneInput"
                  maxlength="10"
                  pattern="[0-9]*"
                  required
                >
                <div class="invalid-feedback" v-if="errors.phone">{{ errors.phone }}</div>
              </div>
              <div class="form-group">
                <input 
                  type="email" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="อีเมล" 
                  v-model.trim="formData.email" 
                  required
                >
                <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
              </div>
              <div class="form-group">
                <input 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.subject }"
                  placeholder="หัวข้อ" 
                  v-model.trim="formData.subject" 
                  required
                >
                <div class="invalid-feedback" v-if="errors.subject">{{ errors.subject }}</div>
              </div>
              <div class="form-group">
                <textarea 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.message }"
                  rows="5" 
                  placeholder="ข้อความ" 
                  v-model.trim="formData.message" 
                  required
                ></textarea>
                <div class="invalid-feedback" v-if="errors.message">{{ errors.message }}</div>
              </div>
              <div class="form-group hcaptcha-container">
                <HCaptcha
                  :sitekey="'dec27dba-c32c-4e48-8c06-34ca6a66f28e'"
                  @verify="onCaptchaVerify"
                  @error="onCaptchaError"
                  @expired="onCaptchaExpired"
                  ref="hcaptcha"
                  :language="'th'"
                ></HCaptcha>
              </div>
              <div class="form-group text-center">
                <button type="submit" class="btn btn-primary w-50" :disabled="isSubmitting || !captchaToken">ส่งข้อความ</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_CONFIG } from '@/config/api'
import Swal from 'sweetalert2'
import HCaptcha from '@hcaptcha/vue3-hcaptcha'

export default {
  name: 'ContactPage',
  components: {
    HCaptcha
  },
  data() {
    return {
      formData: {
        full_name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      },
      errors: {
        full_name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      },
      captchaToken: null,
      isSubmitting: false
    }
  },
  watch: {
    'formData.full_name'(value) {
      if (!value.trim()) {
        this.errors.full_name = 'กรุณากรอกชื่อ-นามสกุล'
      } else if (!/^[ก-์a-zA-Z\s]{2,50}$/.test(value.trim())) {
        this.errors.full_name = 'ชื่อ-นามสกุลต้องเป็นภาษาไทยหรืออังกฤษเท่านั้น และมีความยาว 2-50 ตัวอักษร'
      } else {
        this.errors.full_name = ''
      }
    },
    'formData.phone'(value) {
      if (!value.trim()) {
        this.errors.phone = 'กรุณากรอกเบอร์โทร'
      } else if (!/^[0-9]{9,10}$/.test(value.trim())) {
        this.errors.phone = 'เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก'
      } else {
        this.errors.phone = ''
      }
    },
    'formData.email'(value) {
      if (!value.trim()) {
        this.errors.email = 'กรุณากรอกอีเมล'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        this.errors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
      } else {
        this.errors.email = ''
      }
    },
    'formData.subject'(value) {
      if (!value.trim()) {
        this.errors.subject = 'กรุณากรอกหัวข้อ'
      } else if (value.trim().length < 4 || value.trim().length > 100) {
        this.errors.subject = 'หัวข้อต้องมีความยาว 4-100 ตัวอักษร'
      } else {
        this.errors.subject = ''
      }
    },
    'formData.message'(value) {
      if (!value.trim()) {
        this.errors.message = 'กรุณากรอกข้อความ'
      } else if (value.trim().length < 10 || value.trim().length > 500) {
        this.errors.message = 'ข้อความต้องมีความยาว 10-500 ตัวอักษร'
      } else {
        this.errors.message = ''
      }
    }
  },
  methods: {
    validateForm() {
      let isValid = true
      
      // ตรวจสอบชื่อ-นามสกุล
      if (!this.formData.full_name.trim()) {
        this.errors.full_name = 'กรุณากรอกชื่อ-นามสกุล'
        isValid = false
      } else if (!/^[ก-์a-zA-Z\s]{2,50}$/.test(this.formData.full_name.trim())) {
        this.errors.full_name = 'ชื่อ-นามสกุลต้องเป็นภาษาไทยหรืออังกฤษเท่านั้น และมีความยาว 2-50 ตัวอักษร'
        isValid = false
      }

      // ตรวจสอบเบอร์โทร
      if (!this.formData.phone.trim()) {
        this.errors.phone = 'กรุณากรอกเบอร์โทร'
        isValid = false
      } else if (!/^[0-9]{9,10}$/.test(this.formData.phone.trim())) {
        this.errors.phone = 'เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก'
        isValid = false
      }

      // ตรวจสอบอีเมล
      if (!this.formData.email.trim()) {
        this.errors.email = 'กรุณากรอกอีเมล'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email.trim())) {
        this.errors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
        isValid = false
      }

      // ตรวจสอบหัวข้อ
      if (!this.formData.subject.trim()) {
        this.errors.subject = 'กรุณากรอกหัวข้อ'
        isValid = false
      } else if (this.formData.subject.trim().length < 4 || this.formData.subject.trim().length > 100) {
        this.errors.subject = 'หัวข้อต้องมีความยาว 4-100 ตัวอักษร'
        isValid = false
      }

      // ตรวจสอบข้อความ
      if (!this.formData.message.trim()) {
        this.errors.message = 'กรุณากรอกข้อความ'
        isValid = false
      } else if (this.formData.message.trim().length < 10 || this.formData.message.trim().length > 500) {
        this.errors.message = 'ข้อความต้องมีความยาว 10-500 ตัวอักษร'
        isValid = false
      }

      return isValid
    },
    validatePhoneInput(event) {
      // อนุญาตให้กรอกได้เฉพาะตัวเลขเท่านั้น
      const value = event.target.value.replace(/\D/g, '')
      // จำกัดความยาวไม่เกิน 10 หลัก
      this.formData.phone = value.slice(0, 10)
    },
    onCaptchaVerify(token) {
      this.captchaToken = token
    },
    onCaptchaError(error) {
      console.error('Captcha error:', error)
      this.captchaToken = null
    },
    onCaptchaExpired() {
      this.captchaToken = null
    },
    async submitForm() {
      if (this.isSubmitting || !this.captchaToken) return
      
      if (!this.validateForm()) {
        await Swal.fire({
          icon: 'error',
          title: 'ข้อมูลไม่ถูกต้อง',
          text: 'กรุณาตรวจสอบข้อมูลที่กรอกให้ถูกต้อง',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#dc3545'
        })
        return
      }
      
      try {
        this.isSubmitting = true
        
        const formDataWithCaptcha = {
          ...this.formData,
          captchaToken: this.captchaToken
        }
        
        const response = await fetch(`${API_CONFIG.API_URL}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDataWithCaptcha)
        })

        if (!response.ok) {
          throw new Error('Failed to submit contact form')
        }

        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'ส่งข้อความสำเร็จ',
          text: 'ขอบคุณที่ติดต่อเรา เราจะตอบกลับโดยเร็วที่สุด',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#28a745'
        }).then(() => {
          // นำทางไปยังหน้าหลัก
          this.$router.push('/')
        })

        // Reset form and captcha
        this.formData = {
          full_name: '',
          phone: '',  
          email: '',
          subject: '',
          message: ''
        }
        this.captchaToken = null
        // Reset hCaptcha
        this.$refs.hcaptcha?.reset()
      } catch (error) {
        console.error('Error submitting contact form:', error)
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#dc3545'
        })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
        .alert-box {
            background-color: #fffae6;
            border: 1px solid #ffcc00;
            padding: 15px;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
        }
  .alert-box strong {
            color: #cc0000;
          }
.contact-page {
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

.contact-info, .contact-form {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.contact-info h3, .contact-form h3 {
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.contact-info ul {
  list-style: none;
  padding: 0;
}

.contact-info li {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.contact-info i {
  width: 30px;
  color: var(--home4-primary);
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 5px;
  width: 100%;
}

.hcaptcha-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
</style>
