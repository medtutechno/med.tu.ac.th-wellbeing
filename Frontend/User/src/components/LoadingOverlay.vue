<template>
  <Transition name="fade">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <div class="loading-text">กำลังโหลด...</div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { loadingState } from '@/store/loadingState'

export default {
  name: 'LoadingOverlay',
  setup() {
    return {
      isLoading: loadingState.isLoading
    }
  }
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #00379B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #00379B;
  font-size: 1.1rem;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
