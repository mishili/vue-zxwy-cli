<template>
  <div class="headers">
    <ul>
      <li v-for="(value,index) in NavList" :key="index">
        <router-link :to="value.path">{{ value.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Headers",
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
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
</style>
