<template>
  <div class="student-dashboard">
    <h2>我的学习</h2>
    <el-row :gutter="20">
      <el-col :span="8" v-for="item in courses" :key="item.id" style="margin-bottom: 20px;">
        <el-card shadow="hover">
          <h3>{{ item.course ? item.course.title : 'Course ' + item.courseId }}</h3>
          <p v-if="item.course" class="desc">{{ item.course.description }}</p>
          <div class="progress">
            <span>进度:</span>
            <el-progress :percentage="item.progress || 0"></el-progress>
          </div>
          <div style="margin-top: 15px;">
             <el-button type="primary" size="small" @click="$router.push('/course/' + (item.courseId || item.course.id))">继续学习</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="courses.length === 0" description="您还未报名任何课程"></el-empty>
  </div>
</template>

<script>
import { getStudentCourses } from '@/api/course'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      courses: []
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.fetchCourses()
  },
  methods: {
    async fetchCourses() {
      try {
        const res = await getStudentCourses(this.user.id)
        this.courses = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style scoped>
.student-dashboard {
  padding: 20px;
}
.desc {
  color: #666;
  font-size: 14px;
  height: 40px;
  overflow: hidden;
}
.progress {
  margin-top: 10px;
}
</style>
