import { reactive } from 'vue'

const state = reactive({
  assessmentData: null
})

const mutations = {
  setAssessmentData(data) {
    state.assessmentData = data
  },
  
  setNineQData(data) {
    if (!state.assessmentData) {
      state.assessmentData = {}
    }
    state.assessmentData.nineQ = data
  }
}

const getters = {
  getAssessmentData: () => state.assessmentData
}

export default {
  state,
  mutations,
  getters
}
