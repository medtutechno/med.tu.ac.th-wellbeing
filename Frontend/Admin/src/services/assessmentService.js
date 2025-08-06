import axios from 'axios'
import { API_CONFIG } from '@/config/api'

const API_URL = API_CONFIG.API_URL

export const submitTestResults = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/test_results`, data)
    return response.data
  } catch (error) {
    console.error('Error submitting test results:', error)
    throw error
  }
}

export const sendTelegramNotification = async (message) => {
  try {
    const encodedMessage = encodeURIComponent(message)
    const response = await axios.get(`https://med.tu.ac.th/wellbeing/api/send-message-telegram?message=${encodedMessage}`)
    return response.data
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    throw error
  }
}
