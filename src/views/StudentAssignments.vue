<template>
  <div class="student-assignments">
    <h2>我的作业</h2>
    
    <el-table :data="assignments" v-loading="loading">
      <el-table-column prop="assignmentTitle" label="作业标题" />
      <el-table-column prop="courseName" label="课程" width="200" />
      <el-table-column prop="deadline" label="截止时间" width="180" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.submitted" type="success">已提交</el-tag>
          <el-tag v-else type="warning">未提交</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分数" width="100">
        <template #default="{ row }">
          {{ row.score !== null && row.score !== undefined ? row.score : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="detailDialogVisible" title="作业详情" width="700px">
      <div v-if="currentAssignment">
        <h3>{{ currentAssignment.title }}</h3>
        <p>{{ currentAssignment.description }}</p>
        <p><strong>截止时间：</strong>{{ currentAssignment.deadline }}</p>
        
        <el-divider />
        
        <div v-if="!currentSubmission">
          <h4>提交作业</h4>
          <el-form :model="submitForm" label-width="100px">
            <el-form-item label="作业内容">
              <el-input type="textarea" v-model="submitForm.content" :rows="6"></el-input>
            </el-form-item>
            <el-form-item label="附件URL">
              <el-input v-model="submitForm.fileUrl" placeholder="可选"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <div v-else>
          <h4>我的提交</h4>
          <p><strong>提交内容：</strong>{{ currentSubmission.content }}</p>
          <p v-if="currentSubmission.fileUrl"><strong>附件：</strong><el-link :href="currentSubmission.fileUrl" target="_blank">查看</el-link></p>
          <p><strong>分数：</strong>{{ currentSubmission.score !== null ? currentSubmission.score : '待批改' }}</p>
          <p v-if="currentSubmission.comment"><strong>评语：</strong>{{ currentSubmission.comment }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStudentSubmissions, getAssignmentDetail, submitAssignment } from '@/api/assignment'
import { mapGetters } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      assignments: [],
      loading: false,
      detailDialogVisible: false,
      currentAssignment: null,
      currentSubmission: null,
      submitForm: {
        content: '',
        fileUrl: ''
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.fetchAssignments()
  },
  methods: {
    async fetchAssignments() {
      this.loading = true
      try {
        const res = await getStudentSubmissions(this.user.id)
        this.assignments = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async viewDetail(row) {
      try {
        const assignmentRes = await getAssignmentDetail(row.assignmentId)
        this.currentAssignment = assignmentRes
        this.currentSubmission = row.submitted ? row : null
        this.submitForm = {
          content: '',
          fileUrl: ''
        }
        this.detailDialogVisible = true
      } catch (e) {
        console.error(e)
      }
    },
    async handleSubmit() {
      try {
        const data = {
          studentId: this.user.id,
          ...this.submitForm
        }
        await submitAssignment(this.currentAssignment.id, data)
        ElMessage.success('提交成功')
        this.detailDialogVisible = false
        this.fetchAssignments()
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style scoped>
.student-assignments {
  padding: 20px;
}
</style>
