<template>
  <div>
    <div class="redio">
      <span>题目类型</span>
      <template>
        <el-radio-group v-model="radio">
          <el-radio :label="1">选择题</el-radio>
          <el-radio :label="2">填空题</el-radio>
          <el-radio :label="3">问答题</el-radio>
        </el-radio-group>
      </template>
    </div>
    <div class="redio-content">
      <add-choice-question v-if="radio==1" @setChoice="getChoice"/>
      <add-gap-filling v-if="radio==2"/>
      <add-essay-question v-if="radio==3" @setEssay="getEssay"/>
    </div>
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
          <el-input-number v-show="item.redactShow" v-model="cancelData1[index].tpqScore" :min="1"/>
          <ul class="ul_choice">
            <li v-for="(liItem,liIndex) in item.tpqQuestion.chooseQuestion" :key="liIndex">
              <el-checkbox
                v-model="liItem.cqIsRight"
                :disabled="item.redactShow"
                style="width:68px;padding-left:20px;"
              >{{ liList[liIndex] }}、</el-checkbox>
              <span v-show="item.redactShow">{{ liItem.cqOption }}</span>
              <p v-show="item.redactShow==false" style="width:100%;margin-right:20px;">
                <el-input type="text" v-model="liItem.cqOption"></el-input>
              </p>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteLi(index,liIndex)"
                v-if="item.tpqQuestion.chooseQuestion.length>2"
                v-show="item.redactShow==false"
              ></el-button>
            </li>
          </ul>
          <el-button
            style="margin:0 12px 0 50px;"
            round
            @click="handleEdit(item,index,1)"
            :disabled="!item.redactShow"
          >编辑</el-button>
          <span v-if="item.redactShow==false">
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
      <!-- <ol class="add-ol">
        <li v-for="(item,index) in choiceData" :key="index" class="li-number">
          {{ item.questionTitle}}
          <el-input-number v-model="item.tpqScore" :min="1"/>
          <ul class="ul_choice">
            <li v-for="(liItem,liIndex) in item.chooseQuestion" :key="liIndex">
              <el-checkbox
                v-model="liItem.cqIsRight"
                :disabled="item.redactShow"
                style="width:68px;padding-left:20px;"
              >{{ liList[liIndex] }}、</el-checkbox>
              <span v-show="item.redactShow">{{ liItem.cqOption }}</span>
              <p v-show="item.redactShow==false" style="width:100%;margin-right:20px;">
                <el-input type="text" v-model="liItem.cqOption"></el-input>
              </p>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteLi(index,liIndex)"
                v-if="item.chooseQuestion.length>2"
                v-show="item.redactShow==false"
              ></el-button>
            </li>
          </ul>
          <el-button
            style="margin:0 12px 0 50px;"
            round
            @click="handleEdit(index)"
            :disabled="!item.redactShow"
          >编辑</el-button>
          <span v-if="!item.redactShow">
            <el-button round @click="cancelEdit(index)">取消</el-button>
            <el-button
              type="info"
              round
              @click="addEdit(index)"
              :disabled="item.chooseQuestion.length>=liList.length"
            >新增选项</el-button>
            <el-button type="primary" round @click="saveEdit(index,item.chooseQuestion)">保存更改</el-button>
            <el-button type="warning" round @click="delEdit(index)">删除题目</el-button>
          </span>
        </li>
      </ol>-->
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
          <el-input-number v-show="item.redactShow" v-model="cancelData3[index].tpqScore" :min="1"/>
          <ul class="ul_choice">
            <li style="padding-left: 30px;">
              <el-button type="info" size="mini" plain disabled>参考答案</el-button>
            </li>
            <li style="padding-left: 30px;">
              <span v-show="item.redactShow">{{ item.tpqQuestion.answerQuestion.aqAnswer }}</span>
              <p v-show="item.redactShow==false" style="width:100%;margin-right:20px;">
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
    <div style="text-align: center;margin-top: 50px;">
      <el-button type="primary" @click="submitMake">下一步</el-button>
    </div>
  </div>
</template>

<script>
import AddChoiceQuestion from "@/components/AddChoiceQuestion";
import AddGapFilling from "@/components/AddGapFilling";
import AddEssayQuestion from "@/components/AddEssayQuestion";
export default {
  components: {
    AddChoiceQuestion,
    AddGapFilling,
    AddEssayQuestion
  },
  data() {
    return {
      radio: 1, //题目选项
      liList: ["A", "B", "C", "D", "E", "F"],
      // sumChoice: 0, //选择题分数
      // sumGap: 0, //填空题分数
      // sumEssay: 0, //填空题分数
      // sumData: 0, //总分数//试卷数据
      TestPaper: [
        {
          tpqId: 0, //题目在试卷上的主键编号
          tpqPaperId: 0, //试卷编号
          tpqQuestionId: 0, //题目编号
          tpqScore: 0, //分值
          tpqQuestion: {
            //题目详情
            questionId: 0, //题目编号
            questionTitle: "string", //题干
            questionTypeId: 0, //题目类型编号 1=选择题 2=填空题 3=问题
            answerQuestion: {
              //问答题
              aqQuestionId: 0, //主键编号
              aqAnswer: "string" //参考答案
            },
            chooseQuestion: [
              //选择的题的选项信息
              {
                cqId: 0, //主键编号
                cqQuestionId: 0, //题目编号
                cqOption: "string", //选项内容
                cqIsRight: true //是否为正确答案
              }
            ],
            fillQuestion: [
              //填空题，每个填空项信息
              {
                fqId: 0, //主键编号
                fqQuestionId: 0, //题目编号
                fqAnswer: "string", //答案
                fqOrder: 1, //排序号
                fillQuestionScore: {
                  fqsFilleQuestionId: 0, //题目在试卷上的编号
                  fqsPaperQuestionId: 0, //试卷编号
                  fqsScore: 0 //分值
                }
              }
            ]
          }
        }
      ],
      choiceData: [], //选择题数据
      cancelData1: [], //取消选择题编辑
      GapData: [], //填空题数据
      cancelData2: [], //取消填空题编辑
      essayData: [], //填空题数据
      cancelData3: [] //取消问答题编辑
    };
  },
  mounted() {
    sessionStorage.setItem("testPaperId", 3117);
    this.GetTestPaper();
  },
  methods: {
    // 获取试卷信息
    GetTestPaper() {
      let _this = this;
      var testPaperId = sessionStorage.getItem("testPaperId");
      if (testPaperId) {
        _this.axios
          .get("/TestPaper/GetTestPaper", {
            params: {
              id: testPaperId
            }
          })
          .then(res => {
            if (res.data) {
              _this.TestPaper = res.data;
              _this.choiceData = _this.TestPaper.filter(
                item => item.tpqQuestion.questionTypeId == 1
              );
              _this.choiceData.forEach(item => (item.redactShow = true));
              _this.cancelData1 = _this.choiceData;
              console.log(_this.cancelData1);
              _this.essayData = _this.TestPaper.filter(
                item => item.tpqQuestion.questionTypeId == 3
              );
              _this.essayData.forEach(item => (item.redactShow = true));
              _this.cancelData3 = _this.essayData;
              console.log(_this.cancelData3);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
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
     * @param {Number} index 数据下标
     */
    deleteLi(index, liIndex) {
      let _this = this;
      _this.choiceData[index].tpqQuestion.chooseQuestion.splice(liIndex, 1);
    },
    /**
     * 保存更改
     * @param {Object} data 当前选项数据对象
     * @param {Number} index 数据下标
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
      console.log(data.tpqQuestion);
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
              case 3:
                _this.cancelData3[index].answerQuestion = reData.answerQuestion;
                _this.cancelData3[index].questionTitle = reData.questionTitle;
                break;
            }
          }
          data.redactShow = true;
          _this.$forceUpdate();
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 删除题目
     * @param {Object} data 题目对象
     * @param {Number} index 数据下标
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
     * 添加选择题数据
     * @param {object} data 子组件向父组件传入的数据
     */
    getChoice(data) {
      let _this = this;
      _this.addQuestion(data, 1);
    },
    getEssay(data) {
      let _this = this;
      _this.addQuestion(data, 3);
    },
    addQuestion(data, id) {
      let _this = this;
      _this.axios
        .post("/TestPaper/AddQuestionToTestPaper", {
          tpqPaperId: sessionStorage.getItem("testPaperId"),
          tpqScore: data.tpqScore,
          tpqQuestion: data
        })
        .then(res => {
          let code = res.data.code; //返回代码
          let message = res.data.message; //消息
          let reData = res.data.data; //操作成功后，返回给前端有用的数据
          reData.redactShow = true;
          _this.formMessage(code, message);
          if (code == 1) {
            switch (id) {
              case 1:
                _this.choiceData.push(reData);
                _this.cancelData1.push(JSON.parse(JSON.stringify(reData)));
                break;
              case 3:
                _this.essayData.push(reData);
                _this.essayData1.push(JSON.parse(JSON.stringify(reData)));
                break;
            }
          }
        })
        .catch(error => {
          console.log(error);
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
        sum += item.tpqScore;
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
  }
};
</script>

<style lang="scss" scoped>
.redio {
  span {
    padding-left: 20px;
    padding-right: 200px;
    line-height: 30px;
  }
}
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
</style>
