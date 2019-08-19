<template>
  <el-form :model="choiceForm" status-icon :rules="addrules" ref="choiceForm">
    <el-form-item label="题干" prop="questionTitle" :label-width="formLabelWidth">
      <el-input type="textarea" v-model="choiceForm.questionTitle" autocomplete="off"></el-input>
    </el-form-item>
    <ul class="redio-ul">
      <li v-for="(item,index) in choiceForm.chooseQuestion" :key="index">
        <el-checkbox
          v-model="item.cqIsRight"
          style="width:68px;padding-left:20px;"
        >{{ liList[index] }}、</el-checkbox>
        <el-input type="text" v-model="item.cqOption" autocomplete="off"></el-input>
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          @click="deleteLi(index)"
          v-show="choiceForm.chooseQuestion.length>2"
        ></el-button>
      </li>
    </ul>
    <el-form-item label="分值" :label-width="formLabelWidth">
      <el-input-number v-model="choiceForm.tpqScore" :min="5" :max="10" label="描述文字"></el-input-number>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth">
      <el-button round @click="resetForm('choiceForm')">重置</el-button>
      <el-button
        type="info"
        round
        @click="addLi"
        :disabled="choiceForm.chooseQuestion.length>=liList.length"
      >新增选项</el-button>
      <el-button
        type="primary"
        round
        icon="el-icon-document-checked"
        @click="AddChoice('choiceForm')"
      >保存题目</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      liList: ["A", "B", "C", "D", "E", "F"],
      formLabelWidth: "100px", //表单lable宽度
      choiceForm: {
        tpqScore: 5, //分值
        questionTitle: "", //题目的标题
        questionTypeId: 1, //题目的类型 1=选择题 2=填空题 3=问答题
        chooseQuestion: [
          {
            cqOption: "",
            cqIsRight: false
          },
          {
            cqOption: "",
            cqIsRight: false
          },
          {
            cqOption: "",
            cqIsRight: false
          },
          {
            cqOption: "",
            cqIsRight: false
          }
        ]
      },
      setChoice: {
        tpqScore: 5,
        questionTitle: "",
        questionTypeId: 1,
        chooseQuestion: [
          {
            cqOption: "",
            cqIsRight: false
          },
          {
            cqOption: "",
            cqIsRight: false
          }
        ]
      },
      addrules: {
        questionTitle: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    /**
     * 增加选项
     */
    addLi() {
      var _this = this;
      _this.choiceForm.chooseQuestion.push({ cqOption: "", cqIsRight: false });
    },
    /**
     * 删除选项
     * @param {Number} index 选项下标
     */
    deleteLi(index) {
      var _this = this;
      _this.choiceForm.chooseQuestion.splice(index, 1);
    },
    /**
     * 增加题目
     */
    AddChoice(formName) {
      let _this = this;
      let boolen = false;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.choiceForm.chooseQuestion.forEach(item => {
            if (item.cqIsRight) {
              boolen = true;
            }
          });
          if (boolen) {
            _this.$emit("setChoice", _this.choiceForm);
            // 重新定义变量,解除绑定
            let choice = JSON.parse(JSON.stringify(_this.setChoice))
            // 提交成功后重置
            _this.choiceForm = choice;
          } else {
            _this.$message({
              message: "最少勾选一个答案",
              type: "warning"
            });
          }
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
.redio-ul {
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 20px;
    .el-button {
      margin-left: 15px;
    }
  }
}
</style>
