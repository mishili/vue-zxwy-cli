<template>
  <!-- 全部学生 -->
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb">
      <el-breadcrumb-item>
        <a>基础数据</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <!-- 一开始的数据 -->
      <el-select v-model="selectForm.className" placeholder="请选择" @change="initClass">
        <el-option v-for="(item,index) in classData" :key="index" :value="item.className"></el-option>
      </el-select>
    </el-breadcrumb>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%;"
      height="430"
      :default-sort="{prop: 'stuUid', order: 'ascending'}"
    >
      <el-table-column type="index" label="编号" width="100"></el-table-column>
      <el-table-column prop="className" label="班级名称" sortable></el-table-column>
      <el-table-column prop="stuName" label="学生姓名" sortable></el-table-column>
      <el-table-column prop="stuAge" label="学生年龄" sortable></el-table-column>
      <el-table-column label="生日" width="130" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.stuBirthDay | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stuMobile" label="手机号" sortable></el-table-column>
      <el-table-column prop="stuSex" label="性别" sortable></el-table-column>
      <el-table-column prop="stuPassword" label="密码" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            :disabled="scope.row.classStudents>0"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top:20px;">
      <el-dialog :title="submitValue?'修 改 学 生':'增 加 学 生'" :visible.sync="dialogFormVisible">
        <el-form
          :model="studentForm"
          status-icon
          :rules="studentRules"
          ref="studentForm"
          v-if="dialogFormVisible"
        >
          <el-form-item label="学生名称" prop="stuName" :label-width="formLabelWidth">
            <el-input v-model="studentForm.stuName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="班级名称" prop="className" :label-width="formLabelWidth">
            <el-select v-model="studentForm.className" placeholder="请选择" @change="selectClass">
              <el-option v-for="(item,index) in classData" :key="index" :value="item.className"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日" prop="stuBirthDay" :label-width="formLabelWidth">
            <el-date-picker
              type="date"
              v-model="studentForm.stuBirthDay"
              placeholder="选择日期"
              autocomplete="off"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="手机号" prop="stuMobile" :label-width="formLabelWidth">
            <el-input v-model="studentForm.stuMobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="stuPassword" :label-width="formLabelWidth">
            <el-input v-model="studentForm.stuPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="stuSex" :label-width="formLabelWidth">
            <el-select v-model="studentForm.stuSex" placeholder="请选择">
              <el-option value="男"></el-option>
              <el-option value="女"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false,resetForm('studentForm')">取 消</el-button>
          <el-button
            type="primary"
            @click="submitValue?submitForm1('studentForm'):submitForm2('studentForm')"
          >确 定</el-button>
        </div>
      </el-dialog>
      <el-button type="primary" icon="el-icon-plus" @click="resetClass">增加</el-button>
    </el-row>
  </div>
</template>

<script>
// 引用日期转换工具类
import { formatDate } from "@/util/Date.js";

export default {
  data() {
    return {
      tableData: [
        //获取所有的学生信息
        {
          stuUid: 0, //学生唯一标识符
          className: "web-15班", //所在班级名称
          classId: "", //班级编号
          stuName: "张三", //学生姓名
          stuAge: "16", //学生年龄
          stuBirthDay: "2019-07-28T19:16:27.547", //生日
          stuMobile: "10086118989", //手机号
          stuSex: "男", //性别
          stuPassword: "123456" //密码
        }
      ],
      classData: [], //专业数据
      studentForm: {
        stuUid: 0, //学生唯一标识符
        stuName: "", //学生姓名
        stuClassId: "", //班级编号
        stuBirthDay: "", //生日
        stuMobile: "", //手机号
        stuPassword: "", //登录密码,
        stuSex: "男", //性别
        className: "", //班级名称
        index: 0 //当前点击的下标
      },
      selectForm: {
        //作为用户初始的查询
        className: "web-15班", //班级名称
        classId: "" //班级编号
      },
      dialogFormVisible: false, //弹出框是否显示
      submitValue: false, //共用弹出框，true修改，false增加
      formLabelWidth: "80px", //表单lable宽度
      studentRules: {
        //验证规则
        stuName: [
          { required: true, message: "请输入学生姓名", trigger: "blur" }
        ],
        className: [
          { required: true, message: "请选择班级", trigger: "change" }
        ],
        stuBirthDay: [
          { required: true, message: "请选择生日", trigger: "blur" }
        ],
        stuMobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "长度为11个字符",
            trigger: ["blur", "change"]
          }
        ],
        stuPassword: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  mounted() {
    this.classManage();
    this.stuManage();
  },
  methods: {
    /**
     * 学生管理数据连接
     */
    stuManage() {
      let _this = this;
      let classId = _this.selectForm.classId;
      if (classId) {
        _this.axios
          .get("/Student/GetClassStudent", {
            params: {
              classId: classId
            }
          })
          .then(res => {
            _this.tableData = res.data;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    /**
     * 获取所有的班级信息
     */
    classManage() {
      let _this = this;
      _this.axios
        .get("/Class/GetAllClass")
        .then(res => {
          _this.classData = res.data;
          let className1 = _this.classData[0].className; //默认数据为查询到的班级位置1
          _this.selectForm.className = className1;
          _this.initClass(className1);
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 用户初始查询下拉框返回位置
     * @param {String} className 班级选择框数据
     */
    initClass(className) {
      let _this = this;
      let index = _this.classData.findIndex(
        item => item.className == className
      );
      _this.selectForm.classId = _this.classData[index].classId;
      _this.stuManage();
    },
    /**
     * 班级名称下拉框返回位置
     * @param {String} className 班级选择框数据
     */
    selectClass(className) {
      let _this = this;
      let index = _this.classData.findIndex(
        item => item.className == className
      );
      _this.studentForm.stuClassId = _this.classData[index].classId;
    },
    /**
     * 修改学生
     * @param {Number} index 下标
     * @param {Obj} row 表格当前对象
     */
    handleEdit(index, row) {
      let _this = this;
      this.submitValue = true;
      _this.dialogFormVisible = true;
      _this.studentForm.stuUid = row.stuUid;
      _this.studentForm.stuName = row.stuName;
      _this.studentForm.stuClassId = row.classId;
      _this.studentForm.stuBirthDay = row.stuBirthDay;
      _this.studentForm.stuMobile = row.stuMobile;
      _this.studentForm.stuPassword = row.stuPassword;
      _this.studentForm.className = row.className;
      _this.studentForm.stuSex = row.stuSex;
      _this.studentForm.index = index;
    },
    // 增加学生 数据初始化
    resetClass() {
      let _this = this;
      _this.submitValue = false;
      _this.dialogFormVisible = true;
      _this.studentForm.stuUid = 0;
      _this.studentForm.stuName = "";
      _this.studentForm.stuClassId = "";
      _this.studentForm.stuBirthDay = "";
      _this.studentForm.stuMobile = "";
      _this.studentForm.stuPassword = "";
      _this.studentForm.className = "";
      _this.studentForm.index = 0;
    },
    /**
     * 修改学生
     * @param {Obj} formName 表单对象
     */
    submitForm1(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.axios
            .post("/Student/ModifyStudent", _this.studentForm)
            .then(res => {
              let code = res.data.code; //返回代码
              let message = res.data.message; //消息
              if (code == 1) {
                let index = _this.studentForm.index;
                // 修改的班级与查询的班级不相等,则删除
                if (_this.selectForm.classId == _this.studentForm.stuClassId) {
                  _this.tableData[index].stuName = _this.studentForm.stuName;
                  _this.tableData[index].stuBirthDay = _this.studentForm.stuBirthDay;
                  _this.tableData[index].stuMobile = this.studentForm.stuMobile;
                  _this.tableData[index].stuPassword = _this.studentForm.stuPassword;
                  _this.tableData[index].stuSex = _this.studentForm.stuSex;
                  _this.tableData[index].className = _this.studentForm.className;
                  _this.tableData[index].stuAge = res.data.data; //后台会返回年龄
                }else{
                  _this.tableData.splice(index,1)
                }
                _this.dialogFormVisible = false;
              }
              _this.formMessage(code, message);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          _this.$message({
            message: "请输入学生名称",
            type: "warning"
          });
          return false;
        }
      });
    },
    /**
     * 增加学生
     * @param {Obj} formName 表单对象
     */
    submitForm2(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.axios
            .post("/Student/AddStudent", _this.studentForm)
            .then(res => {
              let code = res.data.code; //返回代码
              let message = res.data.message; //消息
              let data = res.data.data; //操作成功后，返回给前端有用的数据
              if (code == 1) {
                // 如果当前用户查询的班级与用户添加的班级是相同，才可以添加到数组中
                if (_this.selectForm.classId == _this.studentForm.stuClassId) {
                  _this.tableData.push(data);
                }
                _this.dialogFormVisible = false;
              }
              _this.formMessage(code, message);
              _this.resetForm(formName);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          _this.$message({
            message: "请填写信息",
            type: "warning"
          });
          return false;
        }
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
    /**
     * 取消重置表单
     * @param {Obj} formName 表单对象
     */
    resetForm(formName) {
      let _this = this;
      _this.$refs[formName].resetFields();
    },
    /**
     * 删除学生
     * @param {Number} index 下标
     * @param {Obj} row 表格当前对象
     */
    handleDelete(index, row) {
      let _this = this;
      _this
        .$confirm("此操作将永久删除该学生, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.axios
            .get("/Student/RemoveStudent", {
              params: {
                uid: row.stuUid
              }
            })
            .then(res => {
              let code = res.data.code; //返回代码
              let message = res.data.message; //消息
              if (code == 1) {
                _this.tableData.splice(index, 1);
              }
              _this.formMessage(code, message);
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
    }
  },
  filters: {
    /**
     * 日期格式转换
     * @param {String} time 传入的时间
     */
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy年MM月dd日");
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  max-width: 480px;
}
/deep/ .el-select,
.el-input {
  display: flex;
  flex: 1;
}
/deep/ .el-date-editor.el-input {
  width: auto;
}
/deep/ .el-dialog__body {
  padding: 30px 20px 0;
}
.breadcrumb {
  text-align: left;
  /deep/ .el-select {
    display: inline-block;
  }
  /deep/ .el-input {
    width: 50%;
    top: -7px;
    left: 5px;
  }
}
</style>
