// loading.js
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loadingCount: 0,
    isLoading: false
  }),
  actions: {
    startLoading() {
      this.loadingCount++
      this.isLoading = this.loadingCount > 0
    },
    stopLoading() {
      this.loadingCount = Math.max(0, this.loadingCount - 1)
      this.isLoading = this.loadingCount > 0
    }
  }
})
