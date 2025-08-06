// export const API_CONFIG = {
//   BASE_URL: 'https://api.sinothaitrade.com',
//   API_URL: 'https://api.sinothaitrade.com/api',
//   PUBLIC_URL: 'https://api.sinothaitrade.com/api/public'
// }


// export const API_CONFIG = {
//   BASE_URL: 'http://localhost:3000',
//   API_URL: 'http://localhost:3000/api',
//   PUBLIC_URL: 'http://localhost:3000/api/public' 
// }


export const API_CONFIG = {
    BASE_URL: 'https://med.tu.ac.th/wellbeing/backend/',
    API_URL: 'https://med.tu.ac.th/wellbeing/api',
    PUBLIC_URL: 'https://med.tu.ac.th/wellbeing/api/public'
  }
  
export const getImageUrl = (url) => `${API_CONFIG.BASE_URL}${url}`
