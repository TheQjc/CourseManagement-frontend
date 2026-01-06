import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/CourseList.vue')
      },
      {
        path: 'course/:id',
        name: 'CourseDetail',
        component: () => import('@/views/CourseDetail.vue')
      },
      {
        path: 'notices',
        name: 'NoticeList',
        component: () => import('@/views/NoticeList.vue')
      },
      {
        path: 'teacher',
        name: 'TeacherDashboard',
        component: () => import('@/views/TeacherDashboard.vue'),
        meta: { requiresAuth: true, role: 'TEACHER' }
      },
      {
        path: 'teacher/course/:courseId/assignments',
        name: 'AssignmentManage',
        component: () => import('@/views/AssignmentManage.vue'),
        meta: { requiresAuth: true, role: 'TEACHER' }
      },
      {
        path: 'teacher/questions',
        name: 'TeacherQuestions',
        component: () => import('@/views/QuestionList.vue'),
        meta: { requiresAuth: true, role: 'TEACHER' }
      },
      {
        path: 'student',
        name: 'StudentDashboard',
        component: () => import('@/views/StudentDashboard.vue'),
        meta: { requiresAuth: true, role: 'STUDENT' }
      },
      {
        path: 'student/assignments',
        name: 'StudentAssignments',
        component: () => import('@/views/StudentAssignments.vue'),
        meta: { requiresAuth: true, role: 'STUDENT' }
      },
      {
        path: 'student/questions',
        name: 'StudentQuestions',
        component: () => import('@/views/QuestionList.vue'),
        meta: { requiresAuth: true, role: 'STUDENT' }
      },
      {
        path: 'student/notes',
        name: 'StudentNotes',
        component: () => import('@/views/NoteList.vue'),
        meta: { requiresAuth: true, role: 'STUDENT' }
      },
      {
        path: 'discussions',
        name: 'DiscussionList',
        component: () => import('@/views/DiscussionList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'admin',
        name: 'AdminDashboard',
        component: () => import('@/views/AdminDashboard.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = store.getters.token
  const userRole = store.getters.userRole

  if (to.meta.requiresAuth) {
    if (token) {
      if (to.meta.role && to.meta.role !== userRole) {
        next('/') // Unauthorized role
      } else {
        next()
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
