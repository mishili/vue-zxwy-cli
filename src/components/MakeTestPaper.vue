<template>
  <el-form :model="makeForm" status-icon :rules="rules" ref="makeForm">
    <el-form-item label="试卷名称" prop="tpTitle" :label-width="formLabelWidth">
      <el-input type="text" v-model="makeForm.tpTitle" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="课程名称" prop="courseName" :label-width="formLabelWidth">
      <el-select v-model="makeForm.courseName" placeholder="请选择" @change="selectMajor">
        <el-option v-for="(item,index) in majorData" :key="index" :value="item.courseName"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitMake('makeForm')">下一步</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      makeForm: {
        tpTitle: "", //试卷名称
        tpCourseId: 0, //课程id
        courseName: "" //课程名称
      },
      formLabelWidth: "100px", //表单lable宽度
      majorData: [], //课程数据
      rules: {
        //验证规则
        tpTitle: [{ required: true, message: "请输入名称", trigger: "blur" }],
        courseName: [
          { required: true, message: "请选择课程", trigger: "change" }
        ]
      }
    }
  },
  mounted() {
    this.majorMessage();
  },
  methods: {
      /**
     * 课程信息查询
     */
    majorMessage() {
      let _this = this;
      _this.axios
        .get("/Class/GetAllCourse")
        .then(res => {
          _this.majorData = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 课程名称下拉框返回位置
     * @param {String} courseName 课程选择框数据
     */
    selectMajor(courseName) {
      let _this = this;
      let index = _this.majorData.findIndex(
        item => item.courseName == courseName
      );
      _this.makeForm.tpCourseId = _this.majorData[index].courseId;
    },
    /**
     * 制作试卷
     */
    submitMake(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.axios
            .post(
              "/TestPaper/MakeTestPaper",
              _this.makeForm, //body传参
              {
                // query传参
                params: {
                  uid: sessionStorage.getItem("userUid") //登录用户id
                }
              }
            )
            .then(res => {
              console.log(res);
              let data = res.data;
              if (data.code == 1) {
                _this.$emit('geNext')
                sessionStorage.setItem('testPaperId',data.data.testPaperId);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.el-select {
    display: flex;
    flex: 1;
}
</style>
