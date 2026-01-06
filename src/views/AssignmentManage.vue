<template>
  <div class="assignment-manage">
    <div class="header">
      <h2>作业管理 - {{ courseName }}</h2>
      <el-button type="primary" @click="showDialog()">发布作业</el-button>
    </div>

    <el-table :data="assignments" v-loading="loading">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="deadline" label="截止时间" width="180" />
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button size="small" @click="viewSubmissions(row)">查看提交</el-button>
          <el-button size="small" @click="showDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editId ? '编辑作业' : '发布作业'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker v-model="form.deadline" type="datetime" placeholder="选择日期时间" value-format="YYYY-MM-DDTHH:mm:ss"></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="submissionDialogVisible" title="作业提交列表" width="80%">
      <el-table :data="submissions" v-loading="submissionLoading">
        <el-table-column prop="studentName" label="学生" width="150" />
        <el-table-column prop="content" label="提交内容" show-overflow-tooltip />
        <el-table-column prop="fileUrl" label="附件" width="100">
          <template #default="{ row }">
            <el-link v-if="row.fileUrl" :href="row.fileUrl" target="_blank" type="primary">查看</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="分数" width="100" />
        <el-table-column prop="comment" label="评语" show-overflow-tooltip />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="gradeAssignment(row)">批改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="gradeDialogVisible" title="批改作业" width="500px">
      <el-form :model="gradeForm" label-width="80px">
        <el-form-item label="分数">
          <el-input-number v-model="gradeForm.score" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="评语">
          <el-input type="textarea" v-model="gradeForm.comment" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="gradeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleGrade">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCourseAssignments, createAssignment, updateAssignment, deleteAssignment, getAssignmentSubmissions, gradeSubmission } from '@/api/assignment'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  data() {
    return {
      courseId: this.$route.params.courseId,
      courseName: '',
      assignments: [],
      submissions: [],
      loading: false,
      submissionLoading: false,
      dialogVisible: false,
      submissionDialogVisible: false,
      gradeDialogVisible: false,
      editId: null,
      currentAssignmentId: null,
      currentSubmissionId: null,
      form: {
        title: '',
        description: '',
        deadline: ''
      },
      gradeForm: {
        score: 0,
        comment: ''
      }
    }
  },
  created() {
    this.fetchAssignments()
  },
  methods: {
    async fetchAssignments() {
      this.loading = true
      try {
        const res = await getCourseAssignments(this.courseId)
        this.assignments = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    showDialog(row = null) {
      if (row) {
        this.editId = row.id
        this.form = { ...row }
      } else {
        this.editId = null
        this.form = {
          title: '',
          description: '',
          deadline: ''
        }
      }
      this.dialogVisible = true
    },
    async handleSave() {
      try {
        const data = {
          ...this.form,
          courseId: this.courseId
        }
        if (this.editId) {
          await updateAssignment(this.editId, data)
          ElMessage.success('更新成功')
        } else {
          await createAssignment(data)
          ElMessage.success('发布成功')
        }
        this.dialogVisible = false
        this.fetchAssignments()
      } catch (e) {
        console.error(e)
      }
    },
    handleDelete(id) {
      ElMessageBox.confirm('确定删除该作业吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteAssignment(id)
          ElMessage.success('删除成功')
          this.fetchAssignments()
        } catch (e) {
          console.error(e)
        }
      }).catch(() => {})
    },
    async viewSubmissions(row) {
      this.currentAssignmentId = row.id
      this.submissionLoading = true
      this.submissionDialogVisible = true
      try {
        const res = await getAssignmentSubmissions(row.id)
        this.submissions = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        this.submissionLoading = false
      }
    },
    gradeAssignment(row) {
      this.currentSubmissionId = row.id
      this.gradeForm = {
        score: row.score || 0,
        comment: row.comment || ''
      }
      this.gradeDialogVisible = true
    },
    async handleGrade() {
      try {
        await gradeSubmission(this.currentSubmissionId, this.gradeForm)
        ElMessage.success('批改成功')
        this.gradeDialogVisible = false
        this.viewSubmissions({ id: this.currentAssignmentId })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style scoped>
.assignment-manage {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
