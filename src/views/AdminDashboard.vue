<template>
  <div class="admin-dashboard">
    <h2>管理员控制台</h2>
    
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="6">
        <el-card>
          <el-statistic title="总用户数" :value="stats.userCount || 0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="总课程数" :value="stats.courseCount || 0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="总报名数" :value="stats.enrollmentCount || 0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="总作业数" :value="stats.assignmentCount || 0" />
        </el-card>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="用户管理" name="users">
        <div class="header">
          <el-input v-model="searchKeyword" placeholder="搜索用户" style="width: 300px;" clearable />
        </div>
        <el-table :data="users" v-loading="loading">
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="realName" label="真实姓名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色">
            <template #default="{ row }">
              <el-tag :type="row.role === 'STUDENT' ? 'success' : 'primary'">{{ row.role }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button size="small" type="danger" @click="handleDeleteUser(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="公告管理" name="notices">
        <div class="header">
          <el-button type="primary" @click="showNoticeDialog()">发布公告</el-button>
        </div>
        <el-table :data="notices" v-loading="noticeLoading">
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="content" label="内容" show-overflow-tooltip />
          <el-table-column prop="createTime" label="发布时间" width="180" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="showNoticeDialog(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteNotice(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="noticeDialogVisible" :title="editNoticeId ? '编辑公告' : '发布公告'" width="600px">
      <el-form :model="noticeForm" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="noticeForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="noticeForm.content" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="noticeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveNotice">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUsers, deleteUser } from '@/api/user'
import { getAllNotices, createNotice, updateNotice, deleteNotice } from '@/api/notice'
import { getPlatformStatistics } from '@/api/statistics'
import { mapGetters } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  data() {
    return {
      activeTab: 'users',
      stats: {},
      users: [],
      notices: [],
      loading: false,
      noticeLoading: false,
      searchKeyword: '',
      noticeDialogVisible: false,
      editNoticeId: null,
      noticeForm: {
        title: '',
        content: ''
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.fetchStats()
    this.fetchUsers()
    this.fetchNotices()
  },
  methods: {
    async fetchStats() {
      try {
        const res = await getPlatformStatistics()
        this.stats = res || {}
      } catch (e) {
        console.error(e)
      }
    },
    async fetchUsers() {
      this.loading = true
      try {
        const res = await getAllUsers()
        this.users = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async fetchNotices() {
      this.noticeLoading = true
      try {
        const res = await getAllNotices()
        this.notices = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        this.noticeLoading = false
      }
    },
    handleDeleteUser(id) {
      ElMessageBox.confirm('确定删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteUser(id)
          ElMessage.success('删除成功')
          this.fetchUsers()
        } catch (e) {
          console.error(e)
        }
      }).catch(() => {})
    },
    showNoticeDialog(row = null) {
      if (row) {
        this.editNoticeId = row.id
        this.noticeForm = { ...row }
      } else {
        this.editNoticeId = null
        this.noticeForm = {
          title: '',
          content: ''
        }
      }
      this.noticeDialogVisible = true
    },
    async handleSaveNotice() {
      try {
        const data = {
          ...this.noticeForm,
          publisherId: this.user.id
        }
        if (this.editNoticeId) {
          await updateNotice(this.editNoticeId, data)
          ElMessage.success('更新成功')
        } else {
          await createNotice(data)
          ElMessage.success('发布成功')
        }
        this.noticeDialogVisible = false
        this.fetchNotices()
      } catch (e) {
        console.error(e)
      }
    },
    handleDeleteNotice(id) {
      ElMessageBox.confirm('确定删除该公告吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteNotice(id)
          ElMessage.success('删除成功')
          this.fetchNotices()
        } catch (e) {
          console.error(e)
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}
.header {
  margin-bottom: 20px;
}
</style>
