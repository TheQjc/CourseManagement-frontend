<template>
  <div class="chapter-manage">
    <div class="header">
      <h3>章节管理 - {{ courseName }}</h3>
      <el-button type="primary" @click="showDialog()">添加章节</el-button>
    </div>

    <el-table :data="chapters" style="width: 100%" v-loading="loading">
      <el-table-column prop="orderIndex" label="序号" width="80" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column label="资料" width="150">
        <template #default="{ row }">
          <el-tag v-if="row.videoUrl" size="small" type="success">视频</el-tag>
          <el-tag v-if="row.documentUrl" size="small" type="info" style="margin-left: 5px;">文档</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="showDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editId ? '编辑章节' : '添加章节'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="序号">
          <el-input-number v-model="form.orderIndex" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="视频URL">
          <el-input v-model="form.videoUrl" placeholder="可选"></el-input>
        </el-form-item>
        <el-form-item label="文档URL">
          <el-input v-model="form.documentUrl" placeholder="可选"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCourseChapters } from '@/api/course'
import { createChapter, updateChapter, deleteChapter } from '@/api/chapter'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  props: {
    courseId: {
      type: [String, Number],
      required: true
    },
    courseName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chapters: [],
      loading: false,
      dialogVisible: false,
      editId: null,
      form: {
        title: '',
        content: '',
        videoUrl: '',
        documentUrl: '',
        orderIndex: 1
      }
    }
  },
  created() {
    this.fetchChapters()
  },
  methods: {
    async fetchChapters() {
      this.loading = true
      try {
        const res = await getCourseChapters(this.courseId)
        this.chapters = Array.isArray(res) ? res : (res.data || [])
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
          content: '',
          videoUrl: '',
          documentUrl: '',
          orderIndex: this.chapters.length + 1
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
          await updateChapter(this.editId, data)
          ElMessage.success('更新成功')
        } else {
          await createChapter(data)
          ElMessage.success('创建成功')
        }
        this.dialogVisible = false
        this.fetchChapters()
      } catch (e) {
        console.error(e)
      }
    },
    handleDelete(id) {
      ElMessageBox.confirm('确定删除该章节吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteChapter(id)
          ElMessage.success('删除成功')
          this.fetchChapters()
        } catch (e) {
          console.error(e)
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.chapter-manage {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
