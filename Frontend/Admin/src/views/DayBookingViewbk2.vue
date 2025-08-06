<template>
  <div class="container bg-white rounded shadow p-5 ">
   <h1>จองคิวนัดหมายเพื่อรับคำปรึกษา</h1>
<hr>    <!-- Date & Time Section -->
    <h6>เลือกวันและเวลา (Select Date & Time)</h6>
    <div class="row">
      <!-- Calendar -->
      <div class="col-md-6">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <button @click="prevMonth" class="btn btn-outline-primary btn-sm rounded" style="color: #39B460; border-color: #39B460;">◀</button>
          <div class="d-flex gap-2 align-items-center">
            <select v-model="currentMonth" class="form-select form-select-sm" style="width: auto;">
              <option v-for="(month, index) in thaiMonths" :key="index" :value="index">
                {{ month }}
              </option>
            </select>
            <select v-model="currentYear" class="form-select form-select-sm" style="width: auto;">
              <option v-for="year in yearRange" :key="year" :value="year">
                {{ year + 543 }}
              </option>
            </select>
          </div>
          <button @click="nextMonth" class="btn btn-outline-primary btn-sm" style="color: #39B460; border-color: #39B460;">▶</button>
        </div>
        <div class="d-flex flex-wrap">
          <div v-for="day in weekDays" :key="day" class="calendar-day day-name">
            {{ day }}
          </div>
        </div>
        <div class="d-flex flex-wrap">
          <div v-for="(day, index) in filteredDaysInMonth" 
               :key="index" 
               @click="selectDate(day)" 
               :class="[
                 'calendar-day', 
                 { 
                   'active': selectedDate === day,
                   'disabled': isDateDisabled(day)
                 }
               ]">
            {{ day }}
          </div>
        </div>
      </div>

      <!-- Time Slots -->
      <div class="col-md-6">
        <h5 class="mt-3">{{ selectedFullDate }}</h5>
        <div v-if="isLoadingTimeSlots" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        <div v-else-if="isSameDay" class="alert alert-warning">
          <i class="fas fa-exclamation-triangle"></i> กรุณาเลือกวันถัดไป
        </div>
        <div v-else>
          <div class="d-flex flex-wrap gap-2">
            <div v-for="slot in availableSlots" 
                 :key="slot" 
                 @click="selectTime(slot)" 
                 :class="['time-slot', { active: selectedTime === slot }]">
              {{ slot }}
            </div>
          </div>
          <div v-if="bookedSlots.length > 0" class="mt-3">
            <small class="text-muted">เวลาที่ถูกจองแล้ว:</small>
            <div class="d-flex flex-wrap gap-2 mt-2">
              <div v-for="slot in bookedSlots" 
                   :key="slot" 
                   class="time-slot booked">
                {{ slot }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Section -->
    <div class="mt-4 details">
      <h5>รายละเอียดบริการ</h5>
      
      <p class="mb-3">{{ selectedFullDate }} {{ selectedDate == null ?    '' :  'เวลา' }} {{ selectedTime }}</p>
    
      <!-- Student Information Form -->
      <div class="booking-form p-3 mb-3">
        <h6 class="mb-3">ข้อมูลสำหรับติดต่อนัดหมาย</h6>
        <div v-if="submitError" class="alert alert-danger" role="alert">
          {{ submitError }}
        </div>

        <div v-if="submitSuccess" class="alert alert-success" role="alert">
          จองคิวสำเร็จ กำลังกลับไปหน้าหลัก...
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">ชื่อ-นามสกุล <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="studentInfo.fullName"  @blur="validateField('fullName')" required>
            <div v-if="errors.fullName && touched.fullName" class="text-danger">{{ errors.fullName }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label">รหัสนักศึกษา <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="studentInfo.studentId" @blur="validateField('studentId')" required>
            <div v-if="errors.studentId && touched.studentId" class="text-danger">{{ errors.studentId }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label">ชั้นปี <span class="text-danger">*</span></label>
            <select class="form-select" v-model="studentInfo.year" @blur="validateField('year')" required>
              <option value="">เลือกชั้นปี</option>
              <option v-for="year in 6" :key="year" :value="year">ปี {{ year }}</option>
            </select>
            <div v-if="errors.year && touched.year" class="text-danger">{{ errors.year }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label">หลักสูตร <span class="text-danger">*</span></label>
            <select class="form-select" v-model="studentInfo.program" @blur="validateField('program')" required>
              <option value="">เลือกหลักสูตร</option>
              <option v-for="program in programs" :key="program" :value="program">{{ program }}</option>
            </select>
            <div v-if="errors.program && touched.program" class="text-danger">{{ errors.program }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label">อีเมล <span class="text-danger">*</span></label>
            <input type="email" class="form-control" v-model="studentInfo.email" @blur="validateField('email')" required>
            <div v-if="errors.email && touched.email" class="text-danger">{{ errors.email }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label">เบอร์โทรศัพท์ <span class="text-danger">*</span></label>
            <input type="tel" class="form-control" v-model="studentInfo.phone" @blur="validateField('phone')" required>
            <div v-if="errors.phone && touched.phone" class="text-danger">{{ errors.phone }}</div>
          </div>
        </div>
      </div>
      <button class="btn btn-danger w-100" :disabled="!isFormValid" @click="submitBooking">ต่อไป</button>
    </div>
  </div>
</template>

<script>
import { bookingService } from '@/services/bookingService'
import Swal from 'sweetalert2'
import axios from 'axios'
import { API_CONFIG } from '@/config/api'

export default {
  name: 'DayBookingView',
  data() {
    const currentDate = new Date()
    return {
      currentYear: currentDate.getFullYear(),
      currentMonth: currentDate.getMonth(),
      selectedDate: null,
      selectedTime: null,
      weekDays: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
      thaiMonths: [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ],
      availableSlots: [],
      bookedSlots: [],
      allSlots: [],
      error: null,
      programs: [
        'แพทยศาสตรบัณฑิต',
        'ทันตแพทยศาสตรบัณฑิต',
        'เภสัชศาสตรบัณฑิต',
        'พยาบาลศาสตรบัณฑิต',
        'สาธารณสุขศาสตรบัณฑิต',
        'วิทยาศาสตรบัณฑิต'
      ],
      studentInfo: {
        fullName: this.$route.query.name || '',
        studentId: '',
        year: '',
        program: '',
        email: '',
        phone: ''
      },
      testResultsId: this.$route.query.id || null,
      errors: {
        fullName: '',
        studentId: '',
        year: '',
        program: '',
        email: '',
        phone: ''
      },
      touched: {
        fullName: false,
        studentId: false,
        year: false,
        program: false,
        email: false,
        phone: false
      },
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
      isLoadingTimeSlots: false,
      isSameDay: false
    }
  },
  computed: {
    daysInMonth() {
      const date = new Date(this.currentYear, this.currentMonth + 1, 0)
      const days = Array.from({ length: date.getDate() }, (_, i) => i + 1)
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay()
      
      // Create empty cells for days before the first day of the month
      const emptyCells = Array(firstDay).fill(null)
      
      // Calculate total cells needed (maximum 6 weeks * 7 days)
      const totalCells = Math.ceil((days.length + firstDay) / 7) * 7
      
      // Create empty cells for days after the last day of the month
      const endEmptyCells = Array(totalCells - (days.length + firstDay)).fill(null)
      
      return [...emptyCells, ...days, ...endEmptyCells]
    },
    filteredDaysInMonth() {
      return this.daysInMonth.map(day => day === null ? '' : day)
    },
    currentMonthName() {
      return this.thaiMonths[this.currentMonth]
    },
    selectedFullDate() {
      if (this.selectedDate) {
        const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
        const thaiMonths = [
          'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ]
        const date = new Date(this.currentYear, this.currentMonth, this.selectedDate)
        return `วัน${thaiDays[date.getDay()]}ที่ ${this.selectedDate} ${thaiMonths[this.currentMonth]} ${this.currentYear + 543}`
      }
      return ''
    },
    yearRange() {
      const currentYear = new Date().getFullYear()
      return Array.from({length: 3}, (_, i) => currentYear + i)
    },
    isFormValid() {
      const { fullName, studentId, year, program, email, phone } = this.studentInfo
      const { fullName: fullNameError, studentId: studentIdError, year: yearError, 
              program: programError, email: emailError, phone: phoneError } = this.errors
      
      return fullName && studentId && year && program && email && phone && 
             this.selectedDate && this.selectedTime &&
             !fullNameError && !studentIdError && !yearError && 
             !programError && !emailError && !phoneError
    }
  },
  methods: {
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11
        this.currentYear--
      } else {
        this.currentMonth--
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear++
      } else {
        this.currentMonth++
      }
    },
    isDateDisabled(day) {
      const today = new Date();
      const selectedDate = new Date(this.currentYear, this.currentMonth, day);
      today.setHours(0, 0, 0, 0);
      return selectedDate < today;
    },
    async selectDate(day) {
      if (this.isDateDisabled(day)) {
        return; // ไม่อนุญาตให้เลือกวันย้อนหลัง
      }

      this.selectedDate = day;
      this.selectedTime = null;
      this.isLoadingTimeSlots = true;
      this.error = null;

      try {
        // Check if selected date is today
        const today = new Date();
        const selectedDate = new Date(this.currentYear, this.currentMonth, day);
        
        this.isSameDay = today.getFullYear() === selectedDate.getFullYear() &&
                        today.getMonth() === selectedDate.getMonth() &&
                        today.getDate() === selectedDate.getDate();

        if (this.isSameDay) {
          this.isLoadingTimeSlots = false;
          return;
        }

        // Format date as YYYY-MM-DD with month+1 because JavaScript months are 0-based
        const date = new Date(this.currentYear, this.currentMonth, day);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        // Fetch available slots from API
        const response = await axios.get(`${API_CONFIG.API_URL}/available-slots`, { params: { date: formattedDate } });
        
        this.availableSlots = response.data.available_slots;
        this.bookedSlots = response.data.booked_slots;
        this.allSlots = response.data.all_slots;
      } catch (error) {
        console.error('Error fetching time slots:', error);
        this.error = 'ไม่สามารถโหลดข้อมูลช่วงเวลาได้ กรุณาลองใหม่อีกครั้ง';
      } finally {
        this.isLoadingTimeSlots = false;
      }
    },
    selectTime(slot) {
      this.selectedTime = slot
    },
    validateField(field) {
      this.touched[field] = true
      
      switch (field) {
        case 'fullName':
          if (!this.studentInfo.fullName) {
            this.errors.fullName = 'กรุณากรอกชื่อ-นามสกุล'
          } else if (this.studentInfo.fullName.length < 3) {
            this.errors.fullName = 'ชื่อ-นามสกุลต้องมีความยาวอย่างน้อย 3 ตัวอักษร'
          } else {
            this.errors.fullName = ''
          }
          break

        case 'studentId':
          if (!this.studentInfo.studentId) {
            this.errors.studentId = 'กรุณากรอกรหัสนักศึกษา'
          } else if (!/^\d{10}$/.test(this.studentInfo.studentId)) {
            this.errors.studentId = 'รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก'
          } else {
            this.errors.studentId = ''
          }
          break

        case 'year':
          if (!this.studentInfo.year) {
            this.errors.year = 'กรุณาเลือกชั้นปี'
          } else {
            this.errors.year = ''
          }
          break

        case 'program':
          if (!this.studentInfo.program) {
            this.errors.program = 'กรุณาเลือกหลักสูตร'
          } else {
            this.errors.program = ''
          }
          break

        case 'email':
          if (!this.studentInfo.email) {
            this.errors.email = 'กรุณากรอกอีเมล'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.studentInfo.email)) {
            this.errors.email = 'กรุณากรอกอีเมลให้ถูกต้อง'
          } else {
            this.errors.email = ''
          }
          break

        case 'phone':
          if (!this.studentInfo.phone) {
            this.errors.phone = 'กรุณากรอกเบอร์โทรศัพท์'
          } else if (!/^0\d{9}$/.test(this.studentInfo.phone)) {
            this.errors.phone = 'เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0 และมี 10 หลัก'
          } else {
            this.errors.phone = ''
          }
          break
      }
    },
    async submitBooking() {
      if (this.isSubmitting) return
      
      try {
        this.isSubmitting = true
        this.submitError = null
        this.submitSuccess = false

        console.log('Submitting booking with:', {
          selectedDate: this.selectedDate,
          currentYear: this.currentYear,
          currentMonth: this.currentMonth
        })

        // Format date consistently with selectDate function
        const selectedDate = new Date(this.currentYear, this.currentMonth, this.selectedDate);
        const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

        console.log('Formatted date:', formattedDate)

        const bookingData = {
          full_name: this.studentInfo.fullName,
          student_id: this.studentInfo.studentId,
          faculty: this.studentInfo.program,
          department: this.studentInfo.program,
          year: this.studentInfo.year,
          phone: this.studentInfo.phone,
          email: this.studentInfo.email,
          booking_date: formattedDate,
          booking_time: this.selectedTime,
          test_results_id: this.testResultsId,
          booking_status: 'pending'
        }

        console.log('Sending booking data:', bookingData)
        const result = await bookingService.createBooking(bookingData)
        console.log('Booking created successfully:', result)
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'จองคิวสำเร็จ',
          text: 'ระบบจะนำคุณกลับไปยังหน้าหลัก',
          timer: 2000,
          showConfirmButton: false
        })
        
        this.$router.push('/')
      } catch (error) {
        console.error('Failed to create booking:', error)
        
        // Show error message
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.message === 'Invalid date selected' 
            ? 'กรุณาเลือกวันที่นัดหมาย'
            : 'ไม่สามารถทำการจองคิวได้ กรุณาลองใหม่อีกครั้ง'
        })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.calendar-day {
  width: calc(100% / 7);
  height: 40px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calendar-day:hover:not(.disabled) {
  background-color: #e9ecef;
}

.calendar-day.active:not(.disabled) {
  background-color: #39B460;
  color: white;
}

.calendar-day.disabled {
  color: #ccc;
  cursor: not-allowed;
  background-color: #f8f9fa;
}

.day-name {
  font-weight: bold;
  color: #495057;
  cursor: default;
}

.time-slot {
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.time-slot:hover:not(.booked) {
  background-color: #e9ecef;
  border-color: #39B460;
  color: #39B460;
}

.time-slot.active {
  background-color: #39B460;
  color: white;
  border-color: #39B460;
}

.time-slot.booked {
  background-color: #dc3545;
  color: white;
  cursor: not-allowed;
  opacity: 0.7;
}

.gap-2 {
  gap: 0.5rem !important;
}

.details {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #39B460;
}

/* Override Bootstrap primary button color */
.btn-primary {
  background-color: #39B460 !important;
  border-color: #39B460 !important;
}

.btn-primary:hover {
  background-color: #2d8f4c !important;
  border-color: #2d8f4c !important;
}

.form-select:focus {
  border-color: #39B460;
  box-shadow: 0 0 0 0.25rem rgba(57, 180, 96, 0.25);
}

.btn-outline-primary:hover {
  background-color: #39B460 !important;
  color: white !important;
}
</style>
