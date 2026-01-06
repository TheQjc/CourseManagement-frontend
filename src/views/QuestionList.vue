<template>
  <div class="question-list">
    <div class="header">
      <h2>在线提问</h2>
      <el-button v-if="isStudent" type="primary" @click="showAskDialog">我要提问</el-button>
    </div>

    <el-table :data="questions" v-loading="loading">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="问题内容" show-overflow-tooltip />
      <el-table-column prop="studentName" label="提问学生" width="120" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.answer ? 'success' : 'warning'">{{ row.answer ? '已回答' : '待回答' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetail(row)">查看</el-button>
          <el-button v-if="isTeacher && !row.answer" size="small" type="primary" @click="answerQuestion(row)">回答</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="askDialogVisible" title="提问" width="600px">
      <el-form :model="askForm" label-width="80px">
        <el-form-item label="课程">
          <el-select v-model="askForm.courseId" placeholder="选择课程">
            <el-option v-for="course in myCourses" :key="course.id" :label="course.title || course.course?.title" :value="course.courseId || course.course?.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="askForm.title"></el-input>
        </el-form-item>
        <el-form-item label="问题">
          <el-input type="textarea" v-model="askForm.content" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="askDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAsk">提交</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="问题详情" width="600px">
      <div v-if="currentQuestion">
        <h3>{{ currentQuestion.title }}</h3>
        <p><strong>提问学生：</strong>{{ currentQuestion.studentName }}</p>
        <p><strong>问题：</strong></p>
        <div style="white-space: pre-wrap; padding: 10px; background: #f5f5f5;">{{ currentQuestion.content }}</div>
        
        <el-divider />
        
        <div v-if="currentQuestion.answer">
          <h4>教师回答</h4>
          <p><strong>回答教师：</strong>{{ currentQuestion.teacherName }}</p>
          <div style="white-space: pre-wrap; padding: 10px; background: #e8f4f8;">{{ currentQuestion.answer }}</div>
        </div>
        <div v-else>
          <p style="color: #999;">等待教师回答...</p>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="answerDialogVisible" title="回答问题" width="600px">
      <el-form :model="answerForm" label-width="80px">
        <el-form-item label="回答">
          <el-input type="textarea" v-model="answerForm.answer" :rows="8"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="answerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAnswer">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCourseQuestions, askQuestion, answerQuestion, getStudentQuestions, getTeacherQuestions } from '@/api/question'
import { getStudentCourses } from '@/api/course'
import { mapGetters } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      questions: [],
      myCourses: [],
      loading: false,
      askDialogVisible: false,
      detailDialogVisible: false,
      answerDialogVisible: false,
      currentQuestion: null,
      askForm: {
        courseId: null,
        title: '',
        content: ''
      },
      answerForm: {
        answer: ''
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'userRole']),
    isStudent() {
      return this.userRole === 'STUDENT'
    },
    isTeacher() {
      return this.userRole === 'TEACHER'
    }
  },
  created() {
    this.fetchQuestions()
    if (this.isStudent) {
      this.fetchMyCourses()
    }
  },
  methods: {
    async fetchQuestions() {
      this.loading = true
      try {
        let res
        if (this.isStudent) {
          res = await getStudentQuestions(this.user.id)
        } else if (this.isTeacher) {
          res = await getTeacherQuestions(this.user.id)
        }
        this.questions = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async fetchMyCourses() {
      try {
        const res = await getStudentCourses(this.user.id)
        this.myCourses = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      }
    },
    showAskDialog() {
      this.askForm = {
        courseId: null,
        title: '',
        content: ''
      }
      this.askDialogVisible = true
    },
    async handleAsk() {
      try {
        const data = {
          ...this.askForm,
          studentId: this.user.id
        }
        await askQuestion(data)
        ElMessage.success('提问成功')
        this.askDialogVisible = false
        this.fetchQuestions()
      } catch (e) {
        console.error(e)
      }
    },
    viewDetail(row) {
      this.currentQuestion = row
      this.detailDialogVisible = true
    },
    answerQuestion(row) {
      this.currentQuestion = row
      this.answerForm.answer = ''
      this.answerDialogVisible = true
    },
    async handleAnswer() {
      try {
        const data = {
          teacherId: this.user.id,
          answer: this.answerForm.answer
        }
        await answerQuestion(this.currentQuestion.id, data)
        ElMessage.success('回答成功')
        this.answerDialogVisible = false
        this.fetchQuestions()
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style scoped>
.question-list {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
