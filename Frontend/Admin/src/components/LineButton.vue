<template>
  <a class="line-button" href="line://ti/p/@957rwkpy" target="_blank" title="ติดต่อเราทาง LINE">
    <i class="fab fa-line" style="font-size: 30px;"></i>
  </a>

</template>

<script>
export default {
  name: 'LineButton'
}
</script>

<style scoped>
.line-button {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #05C755;
  border-radius: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1000;
}

.line-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.line-button i {
  font-size: 32px;
}

/* ปรับขนาดปุ่มสำหรับมือถือ */
@media (max-width: 768px) {
  .line-button {
    width: 50px;
    height: 50px;
    bottom: 75px;
    right: 20px;
  }

  .line-button i {
    font-size: 28px;
  }
}




</style>
