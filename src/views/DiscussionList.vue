<template>
  <div class="discussion-list">
    <div class="header">
      <h2>讨论区</h2>
      <div class="actions">
        <el-select v-model="selectedCourseId" placeholder="选择课程" @change="handleCourseChange" style="width: 300px; margin-right: 15px;">
          <el-option v-for="course in myCourses" :key="course.id" :label="getCourseTitle(course)" :value="getCourseId(course)" />
        </el-select>
        <el-button type="primary" @click="showCreateDialog" :disabled="!selectedCourseId">发起讨论</el-button>
      </div>
    </div>

    <el-card v-for="discussion in discussions" :key="discussion.id" style="margin-bottom: 15px;" shadow="hover">
      <div class="discussion-header">
        <h3>{{ discussion.title }}</h3>
        <span class="author">{{ discussion.userName }} · {{ discussion.createTime }}</span>
      </div>
      <p class="content">{{ discussion.content }}</p>
      <el-button text type="primary" @click="viewDetail(discussion)">查看回复 ({{ discussion.replyCount || 0 }})</el-button>
    </el-card>
    <el-empty v-if="discussions.length === 0" description="暂无讨论"></el-empty>

    <el-dialog v-model="createDialogVisible" title="发起讨论" width="600px">
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="createForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="createForm.content" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">发布</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="讨论详情" width="800px">
      <div v-if="currentDiscussion">
        <h3>{{ currentDiscussion.title }}</h3>
        <p style="color: #999;">{{ currentDiscussion.userName }} · {{ currentDiscussion.createTime }}</p>
        <div style="white-space: pre-wrap; margin: 20px 0;">{{ currentDiscussion.content }}</div>
        
        <el-divider />
        
        <h4>回复列表</h4>
        <div v-for="reply in replies" :key="reply.id" style="padding: 15px; background: #f5f5f5; margin-bottom: 10px; border-radius: 4px;">
          <p><strong>{{ reply.userName }}</strong> <span style="color: #999; font-size: 12px;">{{ reply.createTime }}</span></p>
          <p style="margin-top: 10px;">{{ reply.content }}</p>
        </div>
        <el-empty v-if="replies.length === 0" description="暂无回复" :image-size="80"></el-empty>

        <el-divider />

        <el-form :model="replyForm">
          <el-form-item>
            <el-input type="textarea" v-model="replyForm.content" placeholder="写下你的回复..." :rows="3"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleReply">发表回复</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCourseDiscussions, createDiscussion, replyDiscussion, getDiscussionReplies } from '@/api/discussion'
import { getStudentCourses, getTeacherCourses } from '@/api/course'
import { mapGetters } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      discussions: [],
      replies: [],
      myCourses: [],
      selectedCourseId: null,
      createDialogVisible: false,
      detailDialogVisible: false,
      currentDiscussion: null,
      createForm: {
        courseId: null,
        title: '',
        content: ''
      },
      replyForm: {
        content: ''
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'userRole']),
    isTeacher() {
      return this.userRole === 'TEACHER'
    }
  },
  created() {
    this.fetchMyCourses()
  },
  methods: {
    async fetchMyCourses() {
      try {
        let res
        if (this.isTeacher) {
          res = await getTeacherCourses(this.user.id)
        } else {
          res = await getStudentCourses(this.user.id)
        }
        this.myCourses = Array.isArray(res) ? res : (res.data || [])
        if (this.myCourses.length > 0) {
          const firstCourseId = this.getCourseId(this.myCourses[0])
          if (firstCourseId) {
            this.selectedCourseId = firstCourseId
            this.fetchDiscussions(firstCourseId)
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    getCourseId(course) {
      return course.id || course.courseId || course.course?.id
    },
    getCourseTitle(course) {
      return course.title || course.course?.title || '未命名课程'
    },
    handleCourseChange(courseId) {
      if (courseId) {
        this.fetchDiscussions(courseId)
      }
    },
    async fetchDiscussions(courseId) {
      try {
        const res = await getCourseDiscussions(courseId)
        this.discussions = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      }
    },
    showCreateDialog() {
      this.createForm = {
        courseId: this.selectedCourseId,
        title: '',
        content: ''
      }
      this.createDialogVisible = true
    },
    async handleCreate() {
      try {
        const data = {
          ...this.createForm,
          userId: this.user.id
        }
        await createDiscussion(data)
        ElMessage.success('发布成功')
        this.createDialogVisible = false
        this.fetchDiscussions(this.createForm.courseId)
      } catch (e) {
        console.error(e)
      }
    },
    async viewDetail(discussion) {
      this.currentDiscussion = discussion
      this.detailDialogVisible = true
      this.replyForm.content = ''
      try {
        const res = await getDiscussionReplies(discussion.id)
        this.replies = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      }
    },
    async handleReply() {
      try {
        const data = {
          userId: this.user.id,
          content: this.replyForm.content
        }
        await replyDiscussion(this.currentDiscussion.id, data)
        ElMessage.success('回复成功')
        this.replyForm.content = ''
        this.viewDetail(this.currentDiscussion)
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style scoped>
.discussion-list {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.actions {
  display: flex;
  align-items: center;
}
.discussion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.author {
  color: #999;
  font-size: 14px;
}
.content {
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 10px;
}
</style>
