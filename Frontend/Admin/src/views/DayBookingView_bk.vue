<template>
  <div class="container mt-5">
    <!-- Filter -->
    <div class="mb-4">
      <label for="filter" class="form-label">Filter by:</label>
      <select id="filter" class="form-select">
        <option>ผู้เชี่ยวชาญ (Therapist) (All)</option>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
    </div>

    <!-- Date & Time Section -->
    <h4>เลือกวันและเวลา (Select Date & Time)</h4>
    <div class="row">
      <!-- Calendar -->
      <div class="col-md-6">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <button @click="prevMonth" class="btn btn-outline-primary btn-sm">◀</button>
          <h5>{{ currentMonthName }} {{ currentYear }}</h5>
          <button @click="nextMonth" class="btn btn-outline-primary btn-sm">▶</button>
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
               :class="['calendar-day', { active: selectedDate === day }]">
            {{ day }}
          </div>
        </div>
      </div>

      <!-- Time Slots -->
      <div class="col-md-6">
        <h5>{{ selectedFullDate }}</h5>
        <div v-if="isLoadingTimeSlots" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else class="d-flex flex-wrap">
          <div v-for="(slot, index) in timeSlots" 
               :key="index" 
               @click="selectTime(slot)" 
               :class="['time-slot', { active: selectedTime === slot }]">
            {{ slot }}
          </div>
        </div>
      </div>
    </div>

    <!-- Details Section -->
    <div class="mt-4 details">
      <h5>รายละเอียดบริการ</h5>
      <p>คุยกับนักจิตวิทยา 30 นาที</p>
      <p>{{ selectedFullDate }} at {{ selectedTime }}</p>
      <p>ทางโทรศัพท์<br>กับ iSTRONG แนะนำผู้เชี่ยวชาญ<br>30 min<br>฿990</p>
      <button class="btn btn-danger w-100">ต่อไป</button>
    </div>
  </div>
</template>

<script>
import { bookingService } from '../services/bookingService'

export default {
  name: 'DayBookingView',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      selectedDate: null,
      selectedTime: null,
      weekDays: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
      timeSlots: [],
      isLoadingTimeSlots: false
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
      return new Date(this.currentYear, this.currentMonth).toLocaleString("default", { month: "long" })
    },
    selectedFullDate() {
      if (this.selectedDate) {
        const date = new Date(this.currentYear, this.currentMonth, this.selectedDate)
        return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
      }
      return "Please select a date"
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
    async selectDate(day) {
      if (!day) return
      this.selectedDate = day
      this.selectedTime = null
      
      // Fetch time slots for the selected date
      this.isLoadingTimeSlots = true
      try {
        const date = new Date(this.currentYear, this.currentMonth, day)
        this.timeSlots = await bookingService.getTimeSlots(date)
      } catch (error) {
        console.error('Error fetching time slots:', error)
        this.timeSlots = []
      } finally {
        this.isLoadingTimeSlots = false
      }
    },
    selectTime(slot) {
      this.selectedTime = slot
    }
  }
}
</script>

<style scoped>
.calendar-day {
  width: 14.28%;
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
  min-height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.day-name {
  font-weight: bold;
  background-color: #f8f9fa;
  cursor: default;
  border-bottom: 2px solid #ddd;
}
.calendar-day.active {
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
}
.time-slot {
  margin: 5px;
  padding: 10px;
  border: 1px solid #ddd;
  cursor: pointer;
  border-radius: 5px;
}
.time-slot.active {
  background-color: #007bff;
  color: white;
}
.details {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
}
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
