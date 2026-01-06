<template>
  <div class="teacher-dashboard">
    <div class="header">
      <h2>我的课程</h2>
      <el-button type="primary" @click="dialogVisible = true">创建课程</el-button>
    </div>

    <el-table :data="courses" style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template #default="{ row }">
          <el-button size="small" @click="$router.push('/course/' + row.id)">查看</el-button>
          <el-button size="small" type="primary" @click="manageChapter(row)">章节</el-button>
          <el-button size="small" @click="$router.push('/teacher/course/' + row.id + '/assignments')">作业</el-button>
          <el-button 
            v-if="row.status !== 'PUBLISHED'" 
            size="small" 
            type="success" 
            @click="handleStatus(row, 'PUBLISHED')"
          >
            发布
          </el-button>
          <el-button 
            v-if="row.status === 'PUBLISHED'" 
            size="small" 
            type="warning" 
            @click="handleStatus(row, 'OFFLINE')"
          >
            下架
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create Course Dialog -->
    <el-dialog v-model="dialogVisible" title="创建新课程">
      <el-form :model="form" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreate">创建</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Chapter Management Dialog -->
    <el-dialog v-model="chapterDialogVisible" title="章节管理" width="80%">
      <ChapterManage v-if="chapterDialogVisible" :courseId="currentCourseId" :courseName="currentCourseName" />
    </el-dialog>
  </div>
</template>

<script>
import { getTeacherCourses, createCourse, updateCourseStatus } from '@/api/course'
import { mapGetters } from 'vuex'
import { ElMessage } from 'element-plus'
import ChapterManage from '@/components/ChapterManage.vue'

export default {
  components: {
    ChapterManage
  },
  data() {
    return {
      courses: [],
      loading: false,
      dialogVisible: false,
      chapterDialogVisible: false,
      currentCourseId: null,
      currentCourseName: '',
      form: {
        title: '',
        description: ''
      }
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
      this.loading = true
      try {
        const res = await getTeacherCourses(this.user.id)
        this.courses = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async handleCreate() {
      try {
        await createCourse(this.form, this.user.id)
        ElMessage.success('Course created')
        this.dialogVisible = false
        this.fetchCourses()
        this.form = { title: '', description: '' }
      } catch (e) {
        console.error(e)
      }
    },
    async handleStatus(row, status) {
      try {
        await updateCourseStatus(row.id, status)
        ElMessage.success('Status updated')
        this.fetchCourses()
      } catch (e) {
        console.error(e)
      }
    },
    getStatusType(status) {
      const map = {
        'PUBLISHED': 'success',
        'DRAFT': 'info',
        'OFFLINE': 'warning'
      }
      return map[status] || ''
    },
    manageChapter(row) {
      this.currentCourseId = row.id
      this.currentCourseName = row.title
      this.chapterDialogVisible = true
    }
  }
}
</script>

<style scoped>
.teacher-dashboard {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
