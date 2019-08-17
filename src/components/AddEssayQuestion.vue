<template>
  <el-form :model="essayForm" status-icon :rules="addrules" ref="essayForm">
    <el-form-item label="题干2" prop="questionTitle" :label-width="formLabelWidth">
      <el-input type="textarea" v-model="essayForm.questionTitle" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="参考答案" prop="answerQuestion.aqAnswer" :label-width="formLabelWidth">
      <el-input type="textarea" v-model="essayForm.answerQuestion.aqAnswer" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="分值" :label-width="formLabelWidth">
      <el-input-number v-model="essayForm.tpqScore" :min="5" :max="10" label="描述文字"></el-input-number>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth">
      <el-button round @click="resetForm('essayForm'),essayForm.tpqScore = 5">重置</el-button>
      <el-button
        type="primary"
        round
        icon="el-icon-document-checked"
        @click="AddEssay('essayForm')"
      >保存题目</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      formLabelWidth: "100px", //表单lable宽度
      essayForm: {
        tpqScore: 5, //分值
        redactShow: true,
        questionTitle: "", //题目的标题
        questionTypeId: 3, //题目的类型 1=选择题 2=填空题 3=问答题
        answerQuestion: {
          aqAnswer: "" //问答题的答案
        }
      },
      setEssay: { //用于重置
        tpqScore: 5,
        redactShow: true,
        questionTitle: "",
        questionTypeId: 3,
        answerQuestion: {
          aqAnswer: ""
        }
      },
      addrules: {
        questionTitle: [
            { required: true, message: "请输入标题", trigger: "blur" }
          ],
        answerQuestion: {
          aqAnswer: [
            { required: true, message: "请输入参考答案", trigger: "blur" }
          ]
        }
      }
    };
  },
  methods: {
    /**
     * 增加题目
     */
    AddEssay(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.$emit("setEssay", _this.essayForm);
          // 提交成功后重置
          _this.essayForm = JSON.parse(JSON.stringify(_this.setEssay));
          // _this.$refs['essayForm'].resetFields() //会把传入的参数清空
        }
      });
    },
    /**
     * 取消重置表单
     * @param {Obj} formName 表单对象
     */
    resetForm(formName) {
      let _this = this;
      _this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>