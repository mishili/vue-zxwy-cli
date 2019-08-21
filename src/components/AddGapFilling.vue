<template>
  <el-form :model="gapForm" status-icon :rules="addrules" ref="gapForm" @submit.native.prevent>
    <el-form-item label="题干" prop="questionTitle" :label-width="formLabelWidth">
      <el-button
        size="small"
        round
        icon="el-icon-document-add"
        @click="insertion"
        :disabled="gapForm.fillQuestion.length>=6"
      >插入填空</el-button>
      <el-input
        type="textarea"
        v-model="gapForm.questionTitle"
        autocomplete="off"
        id="inputGaps"
        @keyup.native="delTitle"
      ></el-input>
    </el-form-item>
    <el-form-item class="insertion" v-for="(item,index) in gapForm.fillQuestion" :key="index">
      <el-button
        type="danger"
        circle
        v-show="item.fqOrder==index+1?item.fqOrder:item.fqOrder=index+1"
      >{{ item.fqOrder }}</el-button>
      <el-input type="text" v-model="item.fqAnswer" autocomplete="off" style=" margin: 0 13px;"></el-input>
      <el-input-number v-model="item.fillQuestionScore[0].fqsScore" :min="2" :max="10" label="描述文字"></el-input-number>
    </el-form-item>
    <el-form-item label="题目预览" :label-width="formLabelWidth" class="gapTitle">
      <p v-for="(item,index) in gapTitle" :key="index">
        {{ item }}
        <template v-if="gapForm.fillQuestion[index]">
          <span>{{gapForm.fillQuestion[index].fqAnswer}}</span>
          ({{ gapForm.fillQuestion[index].fillQuestionScore[0].fqsScore }}分)
        </template>
      </p>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth">
      <el-button round @click="resetForm('gapForm')">重置</el-button>
      <el-button
        type="primary"
        round
        icon="el-icon-document-checked"
        @click="AddGap('gapForm')"
      >保存题目</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      formLabelWidth: "100px", //表单lable宽度
      gapTitle: [], //添加_时的拆分的字段集合
      title: "", //键盘事件时上一个的值
      gapForm: {
        tpqScore: 0, //分值
        questionTitle: "", //填空题的标题
        questionTypeId: 2, //题目类型 1=选择题 2=填空题 3=问题
        fillQuestion: []
      },
      setGap: {
        //用于重置
        tpqScore: 0,
        questionTitle: "",
        questionTypeId: 2,
        fillQuestion: []
      },
      addrules: {
        questionTitle: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ],
        aqAnswer: [
          { required: true, message: "请输入参考答案", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    /**
     * 插入填空
     */
    insertion() {
      let _this = this;
      var elInput = document.getElementById("inputGaps");
      var startPos = elInput.selectionStart; // input 第0个字符到选中的字符
      var endPos = elInput.selectionEnd; // 选中的字符到最后的字符
      if (startPos === undefined || endPos === undefined) return;
      var txt = elInput.value;
      // 将_添加到选中的光标位置
      var result = txt.substring(0, startPos) + "▁" + txt.substring(endPos);
      elInput.value = result; // 赋值给input的value
      // 重新定义光标位置
      elInput.focus();
      elInput.selectionStart = startPos + 1;
      elInput.selectionEnd = startPos + 1;
      // 绑定表单输入框内容
      _this.gapForm.questionTitle = elInput.value;
      _this.gapTitle = _this.gapForm.questionTitle.split("▁");
      // 上一个input输入的值
      _this.title = JSON.parse(JSON.stringify(_this.gapForm.questionTitle));
      // 添加填空内容对象
      _this.gapForm.fillQuestion.push({
        fqOrder: 1, //填空序号
        fqAnswer: "", //第一个空的答案
        fillQuestionScore: [
          {
            fqsScore: 2 //第一个空的分值
          }
        ]
      });
    },
    /**
     * keyup.native 键盘弹起事件
     */
    delTitle() {
      let _this = this;
      // 输入时拆分
      _this.gapTitle = _this.gapForm.questionTitle.split("▁");
      if (_this.title) {
        //上一个是否为空
        // 长度改变判定为删除_
        if (_this.gapForm.questionTitle.length < _this.title.length) {
          var elInput = document.getElementById("inputGaps");
          var startPos = elInput.selectionStart; // input 第0个字符到选中的字符
          var endPos = elInput.selectionEnd; // 选中的字符到最后的字符
          if (startPos === undefined || endPos === undefined) return;
          // 得到当前删除的字符
          var txt1 = _this.title.substring(endPos, endPos + 1);
          // 当前光标之前的字符串并拆分为数组集合
          var txt2 = _this.gapForm.questionTitle
            .substring(0, startPos)
            .split("▁");
          // console.log(txt1, txt2, _this.gapTitle);
          // 删除的字符是否为_
          if (txt1 == "▁") {
            var txtLength = 0;
            txt2.forEach((item, index) => {
              // _字符在最后一个的时候,集合会相同,根据长度删除
              if (item == _this.gapTitle[index]) {
                txtLength += 1;
              }
              // 光标之前的数组集合与现在的集合字符串不相等删除
              if (item != _this.gapTitle[index]) {
                _this.gapForm.fillQuestion.splice(index, 1);
              }
            });
            // 集合相同,_字符在最后，也删除
            if (txtLength == txt2.length) {
              _this.gapForm.fillQuestion.splice(txtLength - 1, 1);
            }
          }
        }
      }
      _this.title = JSON.parse(JSON.stringify(_this.gapForm.questionTitle));
    },
    /**
     * 增加题目
     */
    AddGap(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.gapForm.fillQuestion.forEach((item, index) => {
            _this.gapForm.tpqScore += Number(
              item.fillQuestionScore[0].fqsScore
            );
          });
          _this.gapForm.gapTitle = JSON.parse(JSON.stringify(_this.gapTitle));
          _this.$emit("setGap", _this.gapForm);
          //提交成功后重置
          _this.resetContent();
        }
      });
    },
    /**
     * 取消重置表单提示
     * @param {Obj} formName 表单对象
     */
    resetForm(formName) {
      let _this = this;
      _this.$refs[formName].resetFields();
      _this.resetContent();
    },
    /**
     * 取消重置表单内容
     */
    resetContent() {
      let _this = this;
      _this.gapTitle = [];
      _this.gapForm = JSON.parse(JSON.stringify(_this.setGap));
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.insertion {
  .el-button.is-circle {
    padding: 6px 9px;
  }
  .el-form-item__content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-left: 60px;
  }
}
.gapTitle {
  /deep/ .el-form-item__content {
    margin-left: 10px !important;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  p {
    line-height: 40px;
    height: 40px;
    display: flex;
    span {
      text-align: center;
      display: inline-block;
      min-width: 60px;
      padding: 0 15px;
      border-bottom: 1px solid black;
    }
  }
}
</style>