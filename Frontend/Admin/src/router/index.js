import { createRouter, createWebHistory } from 'vue-router';
//import AssessmentResult from '../views/AssessmentResult.vue';
import SelfCarePage from '../views/SelfCarePage.vue';
import ArticlesPage from '../views/ArticlesPage.vue';
import BlogView from '../views/BlogView.vue';
import BlogPostView from '../views/BlogPostView.vue';
import NotFound from '../views/404Page.vue';
//import DayBookingView from '../views/DayBookingView.vue';
import MainMenuView from '../views/MainMenuView.vue';
import Contact from '../views/ContactPage.vue';
import AssessmentUnavailable from '../views/AssessmentUnavailable.vue';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: MainMenuView,
      meta: {
        title: 'หน้าแรก - MedTU Wellbeing Center',
        description: 'ยินดีต้อนรับสู่ระบบประเมินสุขภาพจิต MedTU Wellbeing Center'
      }
    },
    {
      path: '/assessment',
      name: 'Assessment',
      component: () => import('../views/AssessmentPage.vue'),
      meta: {
        title: 'แบบประเมินสุขภาพจิต - MedTU Wellbeing Center',
        description: 'ทำแบบประเมินสุขภาพจิตเพื่อทราบสถานะของคุณ'
      }
    },

    {
      path: '/assessment/result',
      name: 'AssessmentResult',
      component: () => import('../views/AssessmentResult.vue'),
      meta: {
        title: 'ผลการประเมินสุขภาพจิต - MedTU Wellbeing Center',
        description: 'ทำแบบประเมินสุขภาพจิตเพื่อทราบสถานะของคุณ'
      }
    },

    {
      path: '/assessment/8q',
      name: 'Assessment8Q',
      component: () => import('../views/Assessment8Q.vue'),
      meta: {
        title: 'แบบประเมินสุขภาพจิต - MedTU Wellbeing Center',
        description: 'ทำแบบประเมินสุขภาพจิตเพื่อทราบสถานะของคุณ'
      }
    },
    {
      path: '/assessment/8q/result',
      name: 'Assessment8QResult',
      component: () => import('../views/Assessment8QResult.vue'),
      meta: {
        title: 'ผลการประเมินสุขภาพจิต - MedTU Wellbeing Center',
        description: 'ทำแบบประเมินสุขภาพจิตเพื่อทราบสถานะของคุณ'
      }
    },

    {
      path: '/day-booking',
      name: 'DayBooking',
      component: () => import('../views/DayBookingView.vue'),
      meta: {
        title: 'จองคิว - MedTU Wellbeing Center',
        description: 'จองคิวเพื่อทำแบบประเมินสุขภาพจิต'
      }
    },

    


    {
      path: '/assessment/unavailable',
      name: 'AssessmentUnavailable',
      component: AssessmentUnavailable,
      meta: {
        title: 'แบบประเมินสุขภาพจิต - MedTU Wellbeing Center',
        description: 'ทำแบบประเมินสุขภาพจิตเพื่อทราบสถานะของคุณ'
      }
    },
    {
      path: '/self-care',
      name: 'self-care',
      component: SelfCarePage,
      meta: {
        title: 'ดูแลตนเอง - MedTU Wellbeing Center',
        description: 'เคล็ดลับและวิธีการดูแลสุขภาพจิตด้วยตัวเอง'
      }
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesPage,
      meta: {
        title: 'บทความสุขภาพจิต - MedTU Wellbeing Center',
        description: 'อ่านบทความเกี่ยวกับสุขภาพจิตและเคล็ดลับดี ๆ'
      }
    },
    {
      path: '/blog',
      name: 'Blog',
      component: BlogView,
      meta: {
        title: 'บล็อก - MedTU Wellbeing Center',
        description: 'บทความล่าสุดและข้อมูลสุขภาพจิตจากผู้เชี่ยวชาญ'
      }
    },
    {
      path: '/blog/:id',
      name: 'BlogPost',
      component: BlogPostView,
      props: true,
      meta: {
        title: 'บทความ - MedTU Wellbeing Center',
        description: 'อ่านบทความเกี่ยวกับสุขภาพจิตในรายละเอียด'
      }
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
      props: true,
      meta: {
        title: 'ติดต่อเรา - MedTU Wellbeing Center',
        description: 'ติดต่อเรา เพื่อรับคำปรึกษาเกี่ยวกับสุขภาพจิตจากผู้ชี่ยวชาญ'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: 'ไม่พบหน้า - MedTU Wellbeing Center',
        description: 'ขออภัย ไม่พบหน้าที่คุณต้องการ'
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 🟢 ตั้งค่า `title` และ `description` ตาม meta
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta.description) {
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', to.meta.description);
    } else {
      // ถ้าไม่มี <meta name="description"> ให้สร้างขึ้นมา
      const newMetaTag = document.createElement('meta');
      newMetaTag.name = 'description';
      newMetaTag.content = to.meta.description;
      document.head.appendChild(newMetaTag);
    }
  }
});

export default router;
