<template>
  <div class="mobile-menu-overlay" :class="{ active: isOpen }" @click="$emit('close')">
    <div class="mobile-menu-container" @click.stop>
      <div class="mobile-menu-header">
        <button class="close-button" @click="$emit('close')">
          <span></span>
          <span></span>
        </button>
      </div>
      <nav class="mobile-nav">
        <ul class="mobile-menu-list">
          <li>
            <router-link to="/" exact-active-class="active" @click="$emit('close')">หน้าหลัก</router-link>
          </li>
          <li>
            <router-link to="/assessment" active-class="active" @click="$emit('close')">ประเมินสุขภาพใจตัวเอง</router-link>
          </li>
          <li>
            <router-link to="/self-care" active-class="active" @click="$emit('close')">Self-care : วิธีดูแลสุขภาพใจตัวเอง</router-link>
          </li>
          <li>
            <router-link to="/chatbot" active-class="active" @click="$emit('close')">หน่วยงาน&แชทบอทดูแลใจ</router-link>
          </li>
          <li>
            <router-link to="/contact" active-class="active" @click="$emit('close')">ติดต่อเรา</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileNavMenu',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

.mobile-menu-container {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100%;
  background: #fff;
  padding: 20px;
  transition: 0.3s;
  overflow-y: auto;
}

.mobile-menu-overlay.active .mobile-menu-container {
  right: 0;
}

.mobile-menu-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  position: relative;
  width: 40px;
  height: 40px;
}

.close-button span {
  position: absolute;
  width: 25px;
  height: 2px;
  background: #333;
  top: 50%;
  left: 50%;
}

.close-button span:first-child {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-button span:last-child {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.mobile-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-menu-list li {
  margin: 15px 0;
}

.mobile-menu-list a {
  color: #333;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  display: block;
  padding: 10px 0;
  transition: color 0.3s ease;
}

.mobile-menu-list a:hover,
.mobile-menu-list a.active {
  color: var(--home4-primary);
}
</style>
