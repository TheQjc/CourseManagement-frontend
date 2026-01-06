<template>
  <div class="course-list">
    <h2>课程列表</h2>
    <el-row :gutter="20">
      <el-col :span="6" v-for="course in courses" :key="course.id" style="margin-bottom: 20px;">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" @click="goToDetail(course.id)">
          <div style="padding: 14px;">
            <h3>{{ course.title }}</h3>
            <p class="description">{{ course.description || '暂无描述' }}</p>
            <div class="bottom">
              <span class="teacher">教师: {{ course.teacherName || course.teacher?.realName || '未知' }}</span>
              <el-button type="text" class="button">查看详情</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div v-if="courses.length === 0" class="no-data">
      <el-empty description="暂无课程"></el-empty>
    </div>
  </div>
</template>

<script>
import { getPublicCourses } from '@/api/course'

export default {
  data() {
    return {
      courses: []
    }
  },
  created() {
    this.fetchCourses()
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await getPublicCourses()
        // Assuming response is array or response.data is array
        this.courses = Array.isArray(response) ? response : (response.data || [])
      } catch (error) {
        console.error(error)
      }
    },
    goToDetail(id) {
      this.$router.push(`/course/${id}`)
    }
  }
}
</script>

<style scoped>
.description {
  color: #666;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 40px;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.teacher {
  font-size: 12px;
  color: #999;
}
.course-list {
  padding: 20px 0;
}
.no-data {
  text-align: center;
  padding: 50px;
}
</style>
