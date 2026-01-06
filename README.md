# 教育课程管理系统

## 项目简介

本项目是一个完整的在线教育课程管理平台，采用前后端分离架构开发。系统支持学生选课学习、教师管理课程、管理员系统管理等核心功能。

## 核心功能模块

### 👨‍🎓 学生端
- 用户注册与登录
- 浏览课程列表
- 课程报名与学习
- 个人学习进度跟踪
- 在线笔记记录

### 👨‍🏫 教师端
- 课程创建与编辑
- 章节内容管理
- 作业任务发布
- 学生学习情况统计

### 🔧 管理员端
- 用户权限管理
- 系统数据统计分析
- 课程审核管理

## 技术实现方案

### 后端技术
- **框架**: Spring Boot 2.7.0
- **数据访问**: Spring Data JPA
- **安全认证**: Spring Security + JWT
- **数据库**: MySQL 8.0
- **构建工具**: Maven

### 前端技术
- **框架**: Vue 3.x
- **路由管理**: Vue Router 4.x
- **状态管理**: Vuex 4.x
- **UI组件库**: Element Plus
- **HTTP客户端**: Axios

## 快速开始

### 环境要求
- JDK 17+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+

### 数据库初始化
```bash
# 1. 创建数据库
mysql -u root -p
CREATE DATABASE edu_course_db DEFAULT CHARACTER SET utf8mb4;

# 2. 导入数据表
mysql -u root -p edu_course_db < learning_platform.sql
```

### 后端启动
```bash
# 进入后端目录
cd CourseManagement-backend

# 编译打包
mvn clean package

# 运行应用
java -jar target/edu-course-system-1.0.0.jar
# 或使用 Maven 运行
mvn spring-boot:run
```

后端服务默认运行在 `http://localhost:8082`

### 前端启动
```bash
# 进入前端目录
cd CourseManagement-frontend

# 安装依赖包
npm install

# 启动开发服务器
npm run dev
```

前端应用默认运行在 `http://localhost:8080`

## 项目目录说明

```
ProjectManagementCourses/
├── CourseManagement-backend/    # 后端项目
│   ├── src/main/
│   │   ├── java/com/student/edu/
│   │   │   ├── controller/      # 控制器
│   │   │   ├── service/         # 业务逻辑
│   │   │   ├── repository/      # 数据访问
│   │   │   ├── entity/          # 实体模型
│   │   │   ├── dto/             # 数据传输对象
│   │   │   ├── config/          # 配置类
│   │   │   └── util/            # 工具类
│   │   └── resources/
│   │       ├── application.yml   # 主配置文件
│   │       └── application-local.yml  # 本地配置
│   └── pom.xml                   # Maven配置
├── CourseManagement-frontend/    # 前端项目
│   ├── src/
│   │   ├── api/                  # API接口定义
│   │   ├── views/                # 页面视图
│   │   ├── router/               # 路由配置
│   │   ├── store/                # Vuex状态管理
│   │   └── styles/               # 样式文件
│   ├── package.json
│   └── vue.config.js
└── learning_platform.sql         # 数据库脚本
```

## 功能使用指南

### 用户注册登录
访问系统首页，可选择注册新账号或直接登录。注册时需选择角色类型（学生/教师）。

### 学生功能操作
1. **浏览课程**: 登录后在课程列表页查看所有可选课程
2. **课程报名**: 点击感兴趣的课程，进入详情页后点击"报名"
3. **在线学习**: 在"我的课程"中查看已报名课程并进行学习
4. **学习记录**: 系统自动记录学习进度

### 教师功能操作
1. **创建课程**: 在教师课程管理页面创建新课程
2. **编辑课程**: 修改课程信息、添加章节内容
3. **发布作业**: 为课程发布作业任务
4. **查看统计**: 查看学生选课和学习情况

### 管理员功能
- 用户管理：查看所有注册用户，进行权限分配
- 课程管理：审核教师创建的课程
- 数据统计：查看系统整体运营数据

## API接口说明

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 课程相关
- `GET /api/courses/public` - 获取公开课程列表
- `POST /api/courses` - 创建课程（教师权限）
- `PUT /api/courses/{id}` - 更新课程
- `DELETE /api/courses/{id}` - 删除课程

### 学生选课
- `POST /api/student-courses/enroll` - 课程报名
- `GET /api/student-courses/student/{id}` - 我的课程列表

## 配置说明

### 数据库配置
编辑 `application-local.yml` 文件，修改数据库连接参数：
```yaml
course:
  datasource:
    host: localhost
    port: 3306
    database: edu_course_db
    username: root
    password: your_password
```

### JWT配置
```yaml
jwt:
  secret: your-secret-key
  expiration: 86400000  # 24小时
```

## 开发计划

- [x] 用户认证与授权
- [x] 课程基础CRUD
- [x] 学生选课功能
- [ ] 章节学习进度跟踪
- [ ] 作业提交与批改
- [ ] 在线讨论区
- [ ] 数据可视化统计

## 技术支持

如有问题，请查阅项目文档或提交Issue。

## 许可协议

MIT License

