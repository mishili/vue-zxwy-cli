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
      <add-choice-question v-if="radio==1" @setOption="getOption"/>
      <add-gap-filling v-if="radio==2"/>
      <add-essay-question v-if="radio==3"/>
    </div>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>
            一、选择题（本题共{{ choiceData.length }}道小题，共
            <a>{{sumChoice}}/a</a>分）
          </span>
        </div>
        <ol class="add-ol">
          <li v-for="(item,index) in choiceData" :key="index" class="li-number">
            {{ item.questionTitle}}
            <el-input-number v-model="item.num" :min="1"/>
            <ul class="ul_choice">
              <li v-for="(liItem,liIndex) in item.chooseQuestion" :key="liIndex">
                <el-checkbox
                  v-model="liItem.cqIsRight"
                  :disabled="item.choiceShow"
                  style="width:68px;padding-left:20px;"
                >{{ liList[liIndex] }}、</el-checkbox>
                <span v-show="item.choiceShow">{{ liItem.cqOption }}</span>
                <p v-show="item.choiceShow==false" style="width:100%;margin-right:20px;">
                  <el-input type="text" v-model="liItem.cqOption"></el-input>
                </p>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="deleteLi(index,liIndex)"
                  v-if="item.chooseQuestion.length>2"
                  v-show="item.choiceShow==false"
                ></el-button>
              </li>
            </ul>
            <el-button
              style="margin:0 12px 0 50px;"
              round
              @click="handleEdit(index)"
              :disabled="!item.choiceShow"
            >编辑</el-button>
            <span v-if="!item.choiceShow">
              <el-button round @click="cancelEdit(index)">取消</el-button>
              <el-button
                type="info"
                round
                @click="addEdit(index)"
                :disabled="item.chooseQuestion.length>=liList.length"
              >新增选项</el-button>
              <el-button type="primary" round @click="saveEdit(index,item.chooseQuestion)">保存更改</el-button>
              <el-button type="warning" round @click="delEdit(index)">删除项目</el-button>
            </span>
          </li>
        </ol>
      </el-card>
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
      TestPaper: [
        //试卷数据
        {
          tpqPaperId: 1, //试卷主键编号
          tpqScore: 5, //分值
          tpqQuestion: {
            questionTitle: "下面那些是生命周期的函数", //题目的标题
            questionTypeId: 1, //题目的类型 1=选择题 2=填空题 3=问答题
            chooseQuestion: [
              {
                cqOption: "push", //选项内容
                cqIsRight: false //是否为正确答案 true:正确答案 false：不是
              },
              {
                cqOption: "pull",
                cqIsRight: false
              },
              {
                cqOption: "created",
                cqIsRight: true
              },
              {
                cqOption: "mounted",
                cqIsRight: true
              }
            ]
          }
        }
      ],
      choiceData: [
        //选择题数据
        // {
        //   num: 2,
        //   choiceShow: true,
        //   questionTitle: "下面那些是生命周期的函数", //题目的标题
        //   questionTypeId: 1, //题目的类型 1=选择题 2=填空题 3=问答题
        //   chooseQuestion: [
        //     {
        //       cqOption: "push", //选项内容
        //       cqIsRight: false //是否为正确答案 true:正确答案 false：不是
        //     },
        //     {
        //       cqOption: "pull",
        //       cqIsRight: false
        //     },
        //     {
        //       cqOption: "created",
        //       cqIsRight: true
        //     },
        //     {
        //       cqOption: "mounted",
        //       cqIsRight: true
        //     }
        //   ]
        // }
      ],
      cancelData: [], //取消编辑
    };
  },
  methods: {
    /**
     * 编辑题目
     */
    handleEdit(index) {
      let _this = this;
      _this.choiceData[index].choiceShow = false;
    },
    /**
     * 取消编辑
     */
    cancelEdit(index) {
      let _this = this;
      _this.choiceData[index].choiceShow = true;
      _this.choiceData[index].chooseQuestion = _this.cancelData[index].chooseQuestion;
    },
    /**
     * 新增选项
     */
    addEdit(index) {
      let _this = this;
      _this.choiceData[index].chooseQuestion.push({
        cqOption: "",
        cqIsRight: false
      });
    },
    /**
     * 删除选项
     * @param {Number} index 选项下标
     */
    deleteLi(index, liIndex) {
      let _this = this;
      _this.choiceData[index].chooseQuestion.splice(liIndex, 1);
    },
    /**
     * 保存更改
     */
    saveEdit(index, chooseQuestion) {
      let _this = this;
      let boolen = false;
      chooseQuestion.forEach(item => {
        if (item.cqIsRight) {
          boolen = true;
        }
      });
      if (boolen) {
        _this.choiceData[index].chooseQuestion = chooseQuestion;
        _this.choiceData[index].choiceShow = true;
      } else {
        _this.$message({
          message: "最少勾选一个答案",
          type: "warning"
        });
      }
    },
    /**
     * 删除项目
     */
    delEdit(index) {
      let _this = this;
      _this
        .$confirm("此操作将删除题目, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.choiceData.splice(index, 1);
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getOption(data) {
      let _this = this;
      _this.choiceData.push(data);
      // 定义变量无用 使用转换JSON.parse(JSON.stringify)解除绑定
      _this.cancelData.push(JSON.parse(JSON.stringify(data)));
      // let choice = {
      //   num: data.num,
      //   choiceShow: data.choiceShow,
      //   questionTitle: data.questionTitle,
      //   questionTypeId: data.questionTypeId,
      //   chooseQuestion: data.chooseQuestion
      // };
      // console.log(choice);
      // _this.cancelData.push(choice);
    }
  },
  computed: {
    sumChoice() {
      let _this = this;
      var sum = 0;
      _this.choiceData.forEach(item => {
        sum += item.num;
      });
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
</style>
