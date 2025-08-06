import { ref } from 'vue'

const themeStore = {
  isDarkMode: ref(localStorage.getItem('darkMode') === 'true'),

  toggleTheme() {
    this.isDarkMode.value = !this.isDarkMode.value
    localStorage.setItem('darkMode', this.isDarkMode.value)
    this.applyTheme()
  },

  applyTheme() {
    document.documentElement.classList.toggle('dark-mode', this.isDarkMode.value)
  },

  init() {
    this.applyTheme()
  }
}

// Initialize theme on load
themeStore.init()

export default themeStore
