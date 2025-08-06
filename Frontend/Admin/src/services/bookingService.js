import axios from 'axios'
import { API_CONFIG } from '@/config/api'

export const bookingService = {
  // Fetch available time slots for a specific date
  async getTimeSlots(date) {
    try {
      const response = await axios.get(`${API_CONFIG.API_URL}/time-slots`, { params: { date } })
      return response.data
    } catch (error) {
      console.error('Error fetching time slots:', error)
      // Return default time slots if API fails
      return ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00']
    }
  },
  createBooking: async (bookingData) => {
    try {
      const response = await axios.post(`${API_CONFIG.API_URL}/queue_bookings`, bookingData)
      return response.data
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }
}
