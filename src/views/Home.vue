<template>
  <div class="home">
    <h1>这个是首页</h1>
    <div class="nav">
      <ul>
        <li v-for="(value,index) in NavList" :key="index">
          <router-link :to="value.path">{{ value.name }}</router-link>
        </li>
      </ul>
    </div>
    <router-view name="sidebar"/>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      NavList: [
        {
          name: "学生管理",
          path: "/studentManage"
        },
        {
          name: "老师管理",
          path: "/teacherManage"
        },
        {
          name: "班级管理",
          path: "/gradeManage"
        },
        {
          name: "修改密码",
          path: "/changePassword"
        },
        {
          name: "制作试卷",
          path: "/makeExamination"
        },
        {
          name: "安排测试",
          path: "/testExamination"
        },
        {
          name: "试卷管理",
          path: "/examManage"
        },
        {
          name: "查看成绩",
          path: "/lookExamination"
        },
        {
          name: "批阅试卷",
          path: "/readExamination"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.home {
  margin-top: 60px;
  line-height: 60px;
}
h1 {
  font-size: 30px;
  font-weight: 600px;
}
.nav {
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
}
</style>
