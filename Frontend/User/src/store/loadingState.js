import { ref } from 'vue'

const loadingCount = ref(0)
const isLoading = ref(false)

export const loadingState = {
  startLoading() {
    loadingCount.value++
    isLoading.value = loadingCount.value > 0
  },
  stopLoading() {
    loadingCount.value = Math.max(0, loadingCount.value - 1)
    isLoading.value = loadingCount.value > 0
  },
  isLoading
}
