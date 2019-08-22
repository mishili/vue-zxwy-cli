<template>
  <div>
    <!-- 选择题 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          一、选择题（本题共{{ choiceData.length }}道小题，共
          <a>{{ sumChoice }}/{{ sumData }}</a>分）
        </span>
      </div>
      <ol class="add-ol">
        <li v-for="(item,index) in choiceData" :key="index" class="li-number">
          <span v-show="item.redactShow">{{ item.tpqQuestion.questionTitle}}</span>
          <el-input
            type="textarea"
            v-show="!item.redactShow"
            v-model="item.tpqQuestion.questionTitle"
            autocomplete="off"
          ></el-input>
          <el-input-number
            v-show="item.redactShow"
            v-model="cancelData1[index].tpqScore"
            @change="addScore(cancelData1[index],1)"
            :min="1"
          />
          <ul class="ul_choice">
            <li v-for="(liItem,liIndex) in item.tpqQuestion.chooseQuestion" :key="liIndex">
              <el-checkbox
                v-model="liItem.cqIsRight"
                :disabled="item.redactShow"
                style="width:68px;padding-left:20px;"
              >{{ liList[liIndex] }}、</el-checkbox>
              <span v-show="item.redactShow">{{ liItem.cqOption }}</span>
              <p v-show="!item.redactShow" style="width:100%;margin-right:20px;">
                <el-input type="text" v-model="liItem.cqOption"></el-input>
              </p>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteLi(index,liIndex)"
                v-if="item.tpqQuestion.chooseQuestion.length>2"
                v-show="!item.redactShow"
              ></el-button>
            </li>
          </ul>
          <el-button
            style="margin:0 12px 0 50px;"
            round
            @click="handleEdit(item,index,1)"
            :disabled="!item.redactShow"
          >编辑</el-button>
          <span v-if="!item.redactShow">
            <el-button round @click="cancelEdit(item,index,1)">取消</el-button>
            <el-button
              type="info"
              round
              @click="addEdit(item,index)"
              :disabled="item.tpqQuestion.chooseQuestion.length>=liList.length"
            >新增选项</el-button>
            <el-button type="primary" round @click="saveEdit(item,index,1)">保存更改</el-button>
            <el-button type="warning" round @click="delEdit(item,index,1)">删除题目</el-button>
          </span>
        </li>
      </ol>
    </el-card>
    <!-- 填空题 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          二、填空题（本题共{{ GapData.length }}道小题，共
          <a>{{ sumGap }}/{{ sumData }}</a>分）
        </span>
      </div>
      <ol class="add-ol">
        <li v-for="(item,index) in GapData" :key="index" class="li-number">
          <span class="gapTitle" v-show="item.redactShow">
            <p v-for="(items,indexs) in item.gapTitle" :key="indexs">
              {{ items }}
              <template v-if="item.tpqQuestion.fillQuestion[indexs]">
                <span>{{item.tpqQuestion.fillQuestion[indexs].fqAnswer}}</span>
                <el-input-number
                  size="small"
                  v-model="item.tpqQuestion.fillQuestion[indexs].fillQuestionScore[0].fqsScore"
                  :min="1"
                  @change="addScore(item,2)"
                />
              </template>
            </p>
          </span>
          <el-form
            status-icon
            @submit.native.prevent
            v-show="!item.redactShow"
          >
            <el-form-item
              label="题干"
              style="position: relative;top: -25px;margin-bottom: 0;margin-top: 20px;"
            >
              <el-button
                size="small"
                round
                icon="el-icon-document-add"
                @click="insertion(item,index)"
                :disabled="item.tpqQuestion.fillQuestion.length>=6"
              >插入填空</el-button>
              <el-input
                type="textarea"
                v-model="item.tpqQuestion.questionTitle"
                autocomplete="off"
                :id="'inputGaps'+index"
                @keyup.native="delTitle(item,index)"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="insertion"
              v-for="(items,indexs) in item.tpqQuestion.fillQuestion"
              :key="indexs"
            >
              <el-button
                type="danger"
                circle
                v-show="items.fqOrder==indexs+1?items.fqOrder:items.fqOrder=indexs+1"
              >{{ items.fqOrder }}</el-button>
              <el-input
                type="text"
                v-model="items.fqAnswer"
                autocomplete="off"
                style=" margin: 0 13px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="题目预览" :label-width="formLabelWidth" style="margin-bottom: 0;">
              <span class="gapTitle">
                <p v-for="(items,indexs) in item.gapTitle" :key="indexs">
                  {{ items }}
                  <template v-if="item.tpqQuestion.fillQuestion[indexs]">
                    <span>{{item.tpqQuestion.fillQuestion[indexs].fqAnswer}}</span>
                    ({{ item.tpqQuestion.fillQuestion[indexs].fillQuestionScore[0].fqsScore }}分)
                  </template>
                </p>
              </span>
            </el-form-item>
          </el-form>
          <el-button
            style="margin:0 12px 0 50px;"
            round
            @click="handleEdit(item,index,2)"
            :disabled="!item.redactShow"
          >编辑</el-button>
          <span v-if="!item.redactShow">
            <el-button round @click="cancelEdit(item,index,2)">取消</el-button>
            <el-button type="primary" round @click="saveEdit(item,index,2)">保存更改</el-button>
            <el-button type="warning" round @click="delEdit(item,index,2)">删除题目</el-button>
          </span>
        </li>
      </ol>
    </el-card>
    <!-- 问答题 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          三、问答题（本题共{{ essayData.length }}道小题，共
          <a>{{ sumEssay }}/{{ sumData }}</a>分）
        </span>
      </div>
      <ol class="add-ol">
        <li v-for="(item,index) in essayData" :key="index" class="li-number">
          <span v-show="item.redactShow">{{ item.tpqQuestion.questionTitle}}</span>
          <el-input
            type="textarea"
            v-show="!item.redactShow"
            v-model="item.tpqQuestion.questionTitle"
            autocomplete="off"
          ></el-input>
          <el-input-number
            v-show="item.redactShow"
            v-model="cancelData3[index].tpqScore"
            @change="addScore(cancelData3[index],3)"
            :min="1"
          />
          <ul class="ul_choice">
            <li style="padding-left: 30px;">
              <el-button type="info" size="mini" plain disabled>参考答案</el-button>
            </li>
            <li style="padding-left: 30px;">
              <span v-show="item.redactShow">{{ item.tpqQuestion.answerQuestion.aqAnswer }}</span>
              <p v-show="!item.redactShow" style="width:100%;margin-right:20px;">
                <el-input type="text" v-model="item.tpqQuestion.answerQuestion.aqAnswer"></el-input>
              </p>
            </li>
          </ul>
          <el-button
            style="margin:0 12px 0 50px;"
            round
            @click="handleEdit(item,index,3)"
            :disabled="!item.redactShow"
          >编辑</el-button>
          <span v-if="!item.redactShow">
            <el-button round @click="cancelEdit(item,index,3)">取消</el-button>
            <el-button type="primary" round @click="saveEdit(item,index,3)">保存更改</el-button>
            <el-button type="warning" round @click="delEdit(item,index,3)">删除题目</el-button>
          </span>
        </li>
      </ol>
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    TestPaper: {
      type: Array,
      required: true
    }
    // 简写
    // "parent-msg":String
    //多种类型用数组
    // "parent-msg": [String, Number]
  },
  data() {
    return {
      // redactShow 编辑状态(自己定义)
      formLabelWidth: "100px", //表单lable宽度
      liList: ["A", "B", "C", "D", "E", "F"],
      choiceData: [], //选择题数据
      cancelData1: [], //取消选择题编辑
      GapData: [], //填空题数据
      cancelData2: [], //取消填空题编辑
      essayData: [], //填空题数据
      cancelData3: [] //取消问答题编辑
    };
  },
  methods: {
    /**
     * 插入填空
     * @param {Object} data input填空数据
     * @param {Number} index 节点id
     */
    insertion(data,index) {
      var elInput = document.getElementById("inputGaps" + index);
      var startPos = elInput.selectionStart; // input 第0个字符到选中的字符
      var endPos = elInput.selectionEnd; // 选中的字符到最后的字符
      if (startPos === undefined || endPos === undefined) return;
      var txt = elInput.value;
      // 将_添加到选中的光标位置
      var result = txt.substring(0, startPos) + "▁" + txt.substring(endPos);
      elInput.value = result; // 赋值给input的value
      // 重新定义 光标位置
      elInput.focus();
      elInput.selectionStart = startPos + 1;
      elInput.selectionEnd = startPos + 1;
      // 绑定表单输入框内容
      data.tpqQuestion.questionTitle = elInput.value;
      data.gapTitle = data.tpqQuestion.questionTitle.split("▁");
      // // 上一个input输入的值
      data.title = JSON.parse(JSON.stringify(data.tpqQuestion.questionTitle));
      // 添加填空内容对象
      console.log(data)
      data.tpqQuestion.fillQuestion.push({
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
     * 删除填空
     * @param {Object} data input填空数据
     * @param {Number} index 节点id
     */
    delTitle(data,index) {
      let _this = this;
      // 输入时拆分
      data.gapTitle = data.tpqQuestion.questionTitle.split("▁");
      if (data.title) {
        //上一个是否为空
        // 长度改变判定为删除_
        if (data.tpqQuestion.questionTitle.length < data.title.length) {
          var elInput = document.getElementById("inputGaps" + index);
          var startPos = elInput.selectionStart; // input 第0个字符到选中的字符
          var endPos = elInput.selectionEnd; // 选中的字符到最后的字符
          if (startPos === undefined || endPos === undefined) return;
          // 得到当前删除的字符
          var txt1 = data.title.substring(endPos, endPos + 1);
          // 当前光标之前的字符串并拆分为数组集合
          var txt2 = data.tpqQuestion.questionTitle
            .substring(0, startPos)
            .split("▁");
          // 删除的字符是否为_
          if (txt1 == "▁") {
            var txtLength = 0;
            txt2.forEach((item, index) => {
              // _字符在最后一个的时候,集合会相同,根据长度删除
              if (item == data.gapTitle[index]) {
                txtLength += 1;
              }
              // 光标之前的数组集合与现在的集合字符串不相等删除
              if (item != data.gapTitle[index]) {
                data.tpqQuestion.fillQuestion.splice(index, 1);
              }
            });
            // 集合相同,_字符在最后，也删除
            if (txtLength == txt2.length) {
              data.tpqQuestion.fillQuestion.splice(txtLength - 1, 1);
            }
          }
        }
      }
      data.title = JSON.parse(JSON.stringify(data.tpqQuestion.questionTitle));
      _this.$forceUpdate();
    },
    /**
     *修改分数
     * @param {Object} data 题目对象
     * @param {Number} id 题目取消操作
     */
    addScore(data, id) {
      let _this = this;
      let paramsBody = {
        tpqId: data.tpqId,
        tpqScore: data.tpqScore
      };
      if (id == 2) {
        paramsBody.fillQuestionScore = data.tpqQuestion.fillQuestion;
      }
      console.log(data)
      _this.axios
        .post("/TestPaper/ModifyScore", paramsBody)
        .then(res => {
          let code = res.data.code;
          let message = res.data.message;
          let reData = res.data.data;
          _this.formMessage(code, message);
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 编辑题目
     * @param {Object} data 题目对象
     * @param {Number} index 数据下标
     * @param {Number} id 题目取消操作
     */
    handleEdit(data, index, id) {
      let _this = this;
      switch (id) {
        case 1:
          _this.cancelData1 = JSON.parse(JSON.stringify(_this.cancelData1));
          break;
        case 2:
          _this.cancelData2 = JSON.parse(JSON.stringify(_this.cancelData2));
          break;
        case 3:
          _this.cancelData3 = JSON.parse(JSON.stringify(_this.cancelData3));
          break;
      }
      data.redactShow = false;
      // 强制Vue 实例重新渲染
      _this.$forceUpdate();
    },
    /**
     * 取消编辑
     * @param {Object} data 题目对象
     * @param {Number} index 数据下标
     * @param {Number} id 题目取消操作
     */
    cancelEdit(data, index, id) {
      let _this = this;
      // data.redactShow = true;
      switch (id) {
        case 1:
          _this.choiceData[index] = _this.cancelData1[index];
          break;
        case 2:
          _this.GapData[index] = _this.cancelData2[index];
          break;
        case 3:
          _this.essayData[index] = _this.cancelData3[index];
          break;
      }
      _this.$forceUpdate();
    },
    /**
     * 新增选项
     * @param {Object} data 题目对象
     * @param {Number} index 数据下标
     */
    addEdit(data, index) {
      let _this = this;
      data.tpqQuestion.chooseQuestion.push({
        cqOption: "",
        cqIsRight: false
      });
    },
    /**
     * 删除选项
     * @param {Number} index 选择题数据下标
     * @param {Number} liIndex 第几个选择下标
     */
    deleteLi(index, liIndex) {
      let _this = this;
      _this.choiceData[index].tpqQuestion.chooseQuestion.splice(liIndex, 1);
    },
    /**
     * 保存更改
     * @param {Object} data 当前选项数据对象
     * @param {Number} index 数据下标
     * @param {Number} id 题目取消操作
     */
    saveEdit(data, index, id) {
      let _this = this;
      let boolen = false;
      if (id == 1) {
        data.tpqQuestion.chooseQuestion.forEach(item => {
          if (item.cqIsRight) {
            boolen = true;
          }
        });
        if (!boolen) {
          _this.$message({
            message: "最少勾选一个答案",
            type: "warning"
          });
          return;
        }
      }
      // console.log(data.tpqQuestion);
      _this.axios
        .post("/TestPaper/ModifyQuestion", data.tpqQuestion)
        .then(res => {
          console.log(res);
          let code = res.data.code;
          let message = res.data.message;
          let reData = res.data.data;
          _this.formMessage(code, message);
          if (code == 1) {
            switch (id) {
              case 1:
                _this.cancelData1[index].chooseQuestion = reData.chooseQuestion;
                _this.cancelData1[index].questionTitle = reData.questionTitle;
                break;
              case 2:
                _this.cancelData2[index].fillQuestion = reData.fillQuestion;
                _this.cancelData2[index].questionTitle = reData.questionTitle;
                break;
              case 3:
                _this.cancelData3[index].answerQuestion = reData.answerQuestion;
                _this.cancelData3[index].questionTitle = reData.questionTitle;
                break;
            }
            data.redactShow = true;
            _this.$forceUpdate();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 删除题目
     * @param {Object} data 题目对象
     * @param {Number} index 数据下标
     * @param {Number} id 题目取消操作
     */
    delEdit(data, index, id) {
      let _this = this;
      console.log(data.tpqQuestionId);
      _this
        .$confirm("此操作将删除题目, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.axios
            .post("/TestPaper/RemoveQuestionFromTestPaper", null, {
              params: {
                paperQuestionId: data.tpqId
              }
            })
            .then(res => {
              console.log(res);
              let code = res.data.code;
              let message = res.data.message;
              _this.formMessage(code, message);
              if (code == 1) {
                switch (id) {
                  case 1:
                    _this.choiceData.splice(index, 1);
                    _this.cancelData1.splice(index, 1);
                    break;
                  case 2:
                    _this.GapData.splice(index, 1);
                    _this.cancelData2.splice(index, 1);
                    break;
                  case 3:
                    _this.essayData.splice(index, 1);
                    _this.cancelData3.splice(index, 1);
                    break;
                }
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * 操作表单提示消息
     * @param {Number} code 请求返回参数
     * @param {String} msg 请求返回参数
     */
    formMessage(code, msg) {
      let _this = this;
      let type = "warning";
      let message = "其它错误";
      // 返回代码 0：没有改变 1：成功 -1：系统异常 -2：参数错误 除此之外就是其它错误
      switch (code) {
        case -1:
          message = msg;
          break;
        case -2:
          message = msg;
          break;
        case 0:
          message = msg;
          type = "info";
          break;
        case 1:
          message = msg;
          type = "success";
          break;
        default:
          message = msg;
          break;
      }
      _this.$message({
        //确定后提示语句
        message: message,
        type: type
      });
    },
    submitMake() {
      let _this = this;
      _this.$emit("geNext");
    }
  },
  computed: {
    //选择题分数
    sumChoice() {
      let _this = this;
      let sum = 0;
      _this.cancelData1.forEach(item => {
        sum += item.tpqScore;
      });
      return sum;
    },
    //填空题分数
    sumGap() {
      let _this = this;
      let sum = 0;
      _this.GapData.forEach(item => {
        item.tpqQuestion.fillQuestion.forEach(items => {
          sum += items.fillQuestionScore[0].fqsScore;
        });
        item.tpqScore = sum;
      });
      return sum;
    },
    //填空题分数
    sumEssay() {
      let _this = this;
      let sum = 0;
      _this.cancelData3.forEach(item => {
        sum += item.tpqScore;
      });
      return sum;
    },
    //总分数
    sumData() {
      let _this = this;
      let sum = _this.sumChoice + _this.sumGap + _this.sumEssay;
      return sum;
    }
  },
  watch: {
    TestPaper() {
      let _this = this;
      //过滤选择题数据
      _this.choiceData = _this.TestPaper.filter(
        item => item.tpqQuestion.questionTypeId == 1
      );
      _this.choiceData.forEach(item => (item.redactShow = true));
      _this.cancelData1 = JSON.parse(JSON.stringify(_this.choiceData));
      //过滤填空题数据
      _this.GapData = _this.TestPaper.filter(
        item => item.tpqQuestion.questionTypeId == 2
      );
      _this.GapData.forEach((item, index) => {
        item.redactShow = true;
        item.gapTitle = item.tpqQuestion.questionTitle.split("▁");
        item.title = item.tpqQuestion.questionTitle;
      });
      _this.cancelData2 = JSON.parse(JSON.stringify(_this.GapData));
      //过滤问答题数据
      _this.essayData = _this.TestPaper.filter(
        item => item.tpqQuestion.questionTypeId == 3
      );
      _this.essayData.forEach(item => (item.redactShow = true));
      _this.cancelData3 = JSON.parse(JSON.stringify(_this.essayData));
    }
  }
};
</script>
<style lang="scss" scoped>
.li-number {
  margin-left: 20px;
  list-style-type: unset;
}
.ul_choice {
  li {
    display: flex;
    align-items: center;
    margin: 10px 20px;
  }
}
.add-ol {
  li:nth-child(n + 1) {
    padding-top: 20px;
  }
}
.box-card:nth-child(n + 1) {
  margin-top: 20px;
}
/deep/.insertion {
  .el-button.is-circle {
    padding: 6px 9px;
  }
  .el-form-item__content {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
.gapTitle {
  margin-left: 10px !important;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  p {
    line-height: 40px;
    height: 40px;
    display: flex;
    /deep/ .el-input-number {
      margin: 0 5px;
    }
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

