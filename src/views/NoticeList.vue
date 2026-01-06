<template>
  <div class="notice-list">
    <h2>系统公告</h2>
    <el-card v-for="notice in notices" :key="notice.id" style="margin-bottom: 15px;" shadow="hover">
      <div class="notice-header">
        <h3>{{ notice.title }}</h3>
        <span class="date">{{ notice.createTime }}</span>
      </div>
      <p class="content">{{ notice.content }}</p>
      <el-button text type="primary" @click="viewDetail(notice)">查看详情</el-button>
    </el-card>
    <el-empty v-if="notices.length === 0" description="暂无公告"></el-empty>

    <el-dialog v-model="detailVisible" title="公告详情" width="600px">
      <div v-if="currentNotice">
        <h3>{{ currentNotice.title }}</h3>
        <p style="color: #999; font-size: 14px;">发布时间：{{ currentNotice.createTime }}</p>
        <el-divider />
        <div style="white-space: pre-wrap;">{{ currentNotice.content }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllNotices } from '@/api/notice'

export default {
  data() {
    return {
      notices: [],
      detailVisible: false,
      currentNotice: null
    }
  },
  created() {
    this.fetchNotices()
  },
  methods: {
    async fetchNotices() {
      try {
        const res = await getAllNotices()
        this.notices = Array.isArray(res) ? res : (res.data || [])
      } catch (e) {
        console.error(e)
      }
    },
    viewDetail(notice) {
      this.currentNotice = notice
      this.detailVisible = true
    }
  }
}
</script>

<style scoped>
.notice-list {
  padding: 20px;
}
.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.date {
  color: #999;
  font-size: 14px;
}
.content {
  margin: 15px 0;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
