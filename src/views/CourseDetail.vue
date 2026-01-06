<template>
  <div class="course-detail" v-if="course">
    <el-card>
      <template #header>
        <div class="header">
          <h2>{{ course.title }}</h2>
          <el-tag v-if="isEnrolled" type="success">已报名</el-tag>
        </div>
      </template>
      <div class="info">
        <p><strong>课程描述:</strong> {{ course.description || '暂无描述' }}</p>
        <p><strong>授课教师:</strong> {{ course.teacherName || course.teacher?.realName || '未知' }}</p>
        <div class="actions">
          <el-button 
            type="primary" 
            v-if="isStudent && !isEnrolled" 
            @click="handleEnroll" 
            :loading="enrollLoading"
          >
            立即报名
          </el-button>
          <el-button v-if="!isLoggedIn" @click="$router.push('/login')">登录后报名</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px;">
      <template #header>
        <h3>课程内容</h3>
      </template>
      <el-timeline>
        <el-timeline-item v-for="(chapter, index) in chapters" :key="chapter.id" :timestamp="'第 ' + (index + 1) + ' 章'">
          <h4>{{ chapter.title }}</h4>
          <p>{{ chapter.content }}</p>
          <div v-if="isEnrolled || isTeacher">
             <el-link v-if="chapter.videoUrl" :href="chapter.videoUrl" target="_blank" type="primary">观看视频</el-link>
             <el-divider direction="vertical" v-if="chapter.videoUrl && chapter.documentUrl" />
             <el-link v-if="chapter.documentUrl" :href="chapter.documentUrl" target="_blank" type="info">下载文档</el-link>
          </div>
          <div v-else>
            <small>报名后查看资料</small>
          </div>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-if="chapters.length === 0" description="暂无章节"></el-empty>
    </el-card>
  </div>
</template>

<script>
import { getCourseDetail, getCourseChapters, enrollCourse, getStudentCourses } from '@/api/course'
import { mapGetters } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      course: null,
      chapters: [],
      isEnrolled: false,
      enrollLoading: false
    }
  },
  computed: {
    ...mapGetters(['user', 'userRole', 'token']),
    isLoggedIn() {
      return !!this.token
    },
    isStudent() {
      return this.userRole === 'STUDENT'
    },
    isTeacher() { // To allow teachers to see content (e.g. own course)
      return this.userRole === 'TEACHER'
    }
  },
  async created() {
    const courseId = this.$route.params.id
    await this.fetchCourse(courseId)
    await this.fetchChapters(courseId)
    if (this.isStudent) {
      await this.checkEnrollment(courseId)
    }
  },
  methods: {
    async fetchCourse(id) {
      try {
        const res = await getCourseDetail(id)
        this.course = res
      } catch (e) {
        console.error(e)
      }
    },
    async fetchChapters(id) {
      try {
        const res = await getCourseChapters(id)
        this.chapters = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      }
    },
    async checkEnrollment(courseId) {
      try {
        const res = await getStudentCourses(this.user.id) // Assuming user.id is studentId
        const myCourses = Array.isArray(res) ? res : (res.data || [])
        // Check if courseId is in myCourses. Assuming myCourses returns Course objects or StudentCourse objects containing courseId
        // The API returns "Student's courses". Usually it wraps the course or implies it.
        // I'll check if any item has courseId == this.course.id.
        // It might be `item.course.id` or `item.courseId`.
        this.isEnrolled = myCourses.some(item => (item.courseId == courseId || (item.course && item.course.id == courseId) || item.id == courseId)) 
      } catch (e) {
        console.error(e)
      }
    },
    async handleEnroll() {
      if (!this.user.id) return
      this.enrollLoading = true
      try {
        await enrollCourse({
          studentId: this.user.id,
          courseId: this.course.id
        })
        ElMessage.success('Enrolled successfully!')
        this.isEnrolled = true
      } catch (e) {
        console.error(e)
      } finally {
        this.enrollLoading = false
      }
    }
  }
}
</script>

<style scoped>
.course-detail {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
