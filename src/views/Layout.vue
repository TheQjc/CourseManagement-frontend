<template>
  <el-container>
    <el-header>
      <div class="header-content">
        <router-link to="/" class="logo">课程管理平台</router-link>
        <div class="menu">
          <router-link to="/">课程</router-link>
          <router-link to="/notices">公告</router-link>
          <template v-if="isLoggedIn">
            <router-link to="/discussions" v-if="isStudent || isTeacher">讨论区</router-link>
            <span class="welcome">欢迎, {{ user.realName || user.username }}</span>
            <template v-if="isTeacher">
              <router-link to="/teacher">课程管理</router-link>
              <router-link to="/teacher/questions">答疑</router-link>
            </template>
            <template v-if="isStudent">
              <router-link to="/student">我的课程</router-link>
              <router-link to="/student/assignments">作业</router-link>
              <router-link to="/student/questions">提问</router-link>
              <router-link to="/student/notes">笔记</router-link>
            </template>
            <template v-if="isAdmin">
              <router-link to="/admin">管理后台</router-link>
            </template>
            <a href="#" @click.prevent="handleLogout">退出</a>
          </template>
          <template v-else>
            <router-link to="/login">登录</router-link>
            <router-link to="/register">注册</router-link>
          </template>
        </div>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer>
      <p>&copy; 2026 在线学习平台 - 课程设计项目</p>
    </el-footer>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['token', 'user', 'userRole']),
    isLoggedIn() {
      return !!this.token
    },
    isTeacher() {
      return this.userRole === 'TEACHER'
    },
    isStudent() {
      return this.userRole === 'STUDENT'
    },
    isAdmin() {
      return this.userRole === 'ADMIN'
    }
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #409EFF;
  color: white;
  line-height: 60px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}
.menu a {
  color: white;
  text-decoration: none;
  margin-left: 20px;
}
.welcome {
  margin-left: 20px;
  font-weight: bold;
}
.el-main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 120px);
}
.el-footer {
  text-align: center;
  color: #666;
  padding: 20px;
}
</style>
