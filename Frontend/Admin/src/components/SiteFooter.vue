<template>
  <footer class="footer-area padding-area footer-home4">
    <div class="footer-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">
            <div class="footer-widget footer-widget1">
              <div class="footer-logo">
                <a href="https://www.med.tu.ac.th/medical-student/">
                  <img style="max-height: 84px;" src="https://www.med.tu.ac.th/medical-student/assets/medtu-logo.png" alt="logo">
                </a>
              </div>
              <div class="footer-content">
                <p>Follow my social media.</p>
              </div>
              <ul class="footer-social-icons">
                <li>
                  <a target="_blank" href="https://th-th.facebook.com/studentaffairmedtu/">
                    <img src="https://www.med.tu.ac.th/medical-student/assets/img/index4/facebook.png" alt="facebook">
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="footer-widget footer-widget2">
              <ul class="footer-menu">
                <li><router-link to="/assessment">ทำแบบประเมินสุขภาพใจตัวเอง</router-link></li>
                <li><router-link to="/articles">บทความด้านสุขภาพใจ</router-link></li>
                <li><router-link to="/self-care">วิธีดูแลสุขภาพใจด้วยตัวเอง</router-link></li>
              </ul>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="footer-widget footer-widget5">
              <div class="footer-address">
                <h4>ติดต่อ</h4>
                <p>งานกิจการนักศึกษา คณะแพทยศาสตร์ มหาวิทยาลัยธรรมศาสตร์</p>
                <ul class="footer-contact-info">
                  <li><a href="#!">ชั้น 3 ตึกคุณากร</a></li>
                  <li><a tel="029269701">โทร : 02-926-9701</a></li>
                  <li><a href="https://th-th.facebook.com/studentaffairmedtu/" target="_blank">FB : งานกิจการนักศึกษา คณะแพทยศาสตร์ มหาวิทยาลัยธรรมศาสตร์</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="footer-copyright4">
            <p> 2024 MED-TU. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter'
}
</script>

<style scoped>
.footer-area {
  background-color: #edfbf5;
  padding: 80px 0 30px;
}

.footer-logo {
  margin-bottom: 20px;
}

.footer-content {
  margin-bottom: 20px;
}

.footer-social-icons {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 15px;
}

.footer-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-menu li {
  margin-bottom: 15px;
}

.footer-menu a {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.footer-menu a:hover {
  color: #28bf7e;
}

.footer-address h4 {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.footer-contact-info {
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
}

.footer-contact-info li {
  margin-bottom: 10px;
}

.footer-contact-info a {
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.footer-copyright4 {
  width: 100%;
  text-align: center;
  padding-top: 20px;
}

.footer-copyright4 p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

hr {
  margin: 40px 0;
  border-color: rgba(0, 0, 0, 0.1);
}
</style>
