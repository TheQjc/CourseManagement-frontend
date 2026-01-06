<template>
  <div class="note-list">
    <div class="header">
      <h2>我的笔记</h2>
      <el-button type="primary" @click="showNoteDialog()">新建笔记</el-button>
    </div>

    <el-row :gutter="20">
      <el-col :span="8" v-for="note in notes" :key="note.id" style="margin-bottom: 20px;">
        <el-card shadow="hover">
          <h3>{{ note.title }}</h3>
          <p class="course-name">课程：{{ note.courseName }}</p>
          <p class="content">{{ note.content }}</p>
          <div class="actions">
            <el-button size="small" @click="showNoteDialog(note)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(note.id)">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="notes.length === 0" description="暂无笔记"></el-empty>

    <el-dialog v-model="dialogVisible" :title="editId ? '编辑笔记' : '新建笔记'" width="700px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="课程">
          <el-select v-model="form.courseId" placeholder="选择课程">
            <el-option v-for="course in myCourses" :key="course.id" :label="course.title || course.course?.title" :value="course.courseId || course.course?.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content" :rows="10"></el-input>
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
import { getStudentNotes, createNote, updateNote, deleteNote } from '@/api/note'
import { getStudentCourses } from '@/api/course'
import { mapGetters } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  data() {
    return {
      notes: [],
      myCourses: [],
      dialogVisible: false,
      editId: null,
      form: {
        courseId: null,
        title: '',
        content: ''
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.fetchNotes()
    this.fetchMyCourses()
  },
  methods: {
    async fetchNotes() {
      try {
        const res = await getStudentNotes(this.user.id)
        this.notes = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
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
    showNoteDialog(note = null) {
      if (note) {
        this.editId = note.id
        this.form = { ...note }
      } else {
        this.editId = null
        this.form = {
          courseId: null,
          title: '',
          content: ''
        }
      }
      this.dialogVisible = true
    },
    async handleSave() {
      try {
        if (this.editId) {
          await updateNote(this.editId, this.form)
          ElMessage.success('更新成功')
        } else {
          await createNote(this.user.id, this.form)
          ElMessage.success('创建成功')
        }
        this.dialogVisible = false
        this.fetchNotes()
      } catch (e) {
        console.error(e)
      }
    },
    handleDelete(id) {
      ElMessageBox.confirm('确定删除该笔记吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteNote(id)
          ElMessage.success('删除成功')
          this.fetchNotes()
        } catch (e) {
          console.error(e)
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.note-list {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.course-name {
  color: #999;
  font-size: 14px;
  margin: 10px 0;
}
.content {
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin-bottom: 15px;
}
.actions {
  text-align: right;
}
</style>
