<template>
  <!-- 全部班级 -->
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb>
      <!-- <el-breadcrumb-item :to="{ path: '/gradeManage' }">基础数据</el-breadcrumb-item> -->
      <el-breadcrumb-item>
        <a>基础数据</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- prop指定默认的排序的列 descending 降序 ascending 升序 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%;"
      height="430"
      :default-sort="{prop: 'classId', order: 'ascending'}"
    >
      <el-table-column type="index" label="编号" width="100"></el-table-column>
      <el-table-column prop="className" label="班级名称" sortable></el-table-column>
      <el-table-column prop="courseName" label="专业名称" sortable></el-table-column>
      <el-table-column prop="userName" label="老师名称" sortable></el-table-column>
      <el-table-column prop="classStudents" label="班级人数" sortable></el-table-column>
      <!-- 自定义列的显示内容，可组合其他组件使用 -->
      <el-table-column label="开班时间" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.classCreateTime | formatDate }}</span>
        </template>
      </el-table-column>
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
      <el-dialog :title="submitValue?'修 改 班 级':'增 加 班 级'" :visible.sync="dialogFormVisible">
        <el-form :model="classForm" status-icon :rules="classRules" ref="classForm">
          <el-form-item label="班级名称" prop="className" :label-width="formLabelWidth">
            <el-input v-model="classForm.className" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="专业名称" prop="courseName" :label-width="formLabelWidth">
            <el-select v-model="classForm.courseName" placeholder="请选择" @change="selectMajor">
              <el-option v-for="(item,index) in majorData" :key="index" :value="item.courseName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="老师名称" prop="userName" :label-width="formLabelWidth">
            <el-select v-model="classForm.userName" placeholder="请选择" @change="selectTeacher">
              <el-option v-for="(item,index) in teacherData" :key="index" :value="item.userName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false,resetForm('classForm')">取 消</el-button>
          <el-button
            type="primary"
            @click="submitValue?submitForm1('classForm'):submitForm2('classForm')"
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
        //获取所有的班级信息
        {
          classId: 489, //班级主键编号
          className: "web-20班", //班级名称
          classTeacherId: 1092, //老师编号
          userName: "小欧阳", //老师名称
          classCourseId: 1, //专业编号
          courseName: "Web前端开发", //专业名称
          classStudents: 3, //班级人数
          classCreateTime: "2019-07-28T19:16:27.547" //班级创建日期
        }
      ],
      majorData: [], //专业数据
      teacherData: [], //老师数据
      classForm: {
        //下拉菜单初始内容
        classId: 0, //要修改的班级主键
        className: "", //要修改的班级名称
        classCourseId: "", //课程编号
        classTeacherId: "", //老师编号
        courseName: "", //课程名称
        userName: "", //老师名称
        index: 0 //当前点击的下标
      },
      dialogFormVisible: false, //弹出框是否显示
      submitValue: false, //共用弹出框，true修改，false增加
      formLabelWidth: "80px", //表单lable宽度
      classRules: {
        //验证规则
        className: [{ required: true, message: "请输入班级", trigger: "blur" }],
        courseName: [{ required: true, message: "请选择专业", trigger: "change" }],
        userName: [{ required: true, message: "请选择老师", trigger: "change" }]
      }
    };
  },
  mounted() {
    this.classManage();
    this.majorMessage();
    this.teacherMessage();
  },
  methods: {
    /**
     * 班级管理数据连接
     */
    classManage() {
      let _this = this;
      _this.axios
        .get("/Class/GetAllClass")
        .then(res => {
          _this.tableData = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 专业信息查询
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
     * 老师信息查询
     */
    teacherMessage() {
      let _this = this;
      _this.axios
        .get("/User/GetTeachers")
        .then(res => {
          _this.teacherData = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 专业名称下拉框返回位置
     * @param {String} courseName 专业选择框数据
     */
    selectMajor(courseName) {
      let _this = this;
      let index = _this.majorData.findIndex(
        item => item.courseName == courseName
      );
      _this.classForm.classCourseId = _this.majorData[index].courseId;
    },
    /**
     * 老师名称下拉框返回位置
     * @param {String} userName 专业选择框数据
     */
    selectTeacher(userName) {
      let _this = this;
      let index = _this.teacherData.findIndex(
        item => item.userName == userName
      );
      _this.classForm.classTeacherId = _this.teacherData[index].userId;
    },
    /**
     * 修改班级
     * @param {Number} index 下标
     * @param {Obj} row 表格当前对象
     */
    handleEdit(index, row) {
      let _this = this;
      this.submitValue = true;
      _this.dialogFormVisible = true;
      _this.classForm.classId = row.classId;
      _this.classForm.className = row.className;
      _this.classForm.classCourseId = row.classCourseId;
      _this.classForm.classTeacherId = row.classTeacherId;
      _this.classForm.courseName = row.courseName;
      _this.classForm.userName = row.userName;
      _this.classForm.index = index;
    },
    // 增加班级 数据初始化
    resetClass() {
      let _this = this;
      _this.submitValue = false;
      _this.dialogFormVisible = true;
      _this.classForm.classId = 0;
      _this.classForm.className = "";
      _this.classForm.classCourseId = "";
      _this.classForm.classTeacherId = "";
      _this.classForm.courseName = "";
      _this.classForm.userName = "";
      _this.classForm.index = 0;
    },
    /**
     * 修改班级
     * @param {Obj} formName 表单对象
     */
    submitForm1(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.axios
            .post("/Class/ModifyClass", _this.classForm)
            .then(res => {
              let code = res.data.code; //返回代码
              let message = res.data.message; //消息
              if (code == 1) {
                let index = _this.classForm.index;
                _this.tableData[index].className = _this.classForm.className;
                _this.tableData[index].courseName = _this.classForm.courseName;
                _this.tableData[index].userName = _this.classForm.userName;
                _this.dialogFormVisible = false;
              }
              _this.formMessage(code,message);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          _this.$message({
            message: "请输入班级名称",
            type: "warning"
          });
          return false;
        }
      });
    },
    /**
     * 增加班级
     * @param {Obj} formName 表单对象
     */
    submitForm2(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.axios
            .post("/Class/AddClass", _this.classForm)
            .then(res => {
              let code = res.data.code; //返回代码
              let message = res.data.message; //消息
              let data = res.data.data; //操作成功后，返回给前端有用的数据
              if (code == 1) {
                //不刷新情况，需重新赋值，后台返回数据不存在专业名称，老师名称
                data.courseName = _this.classForm.courseName; 
                data.userName = _this.classForm.userName;
                _this.tableData.push(data);
                _this.dialogFormVisible = false;
              }
              _this.formMessage(code,message);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          _this.$message({
            message: "请输入班级名称",
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
    formMessage(code,msg) {
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
     * 删除班级
     * @param {Number} index 下标
     * @param {Obj} row 表格当前对象
     */
    handleDelete(index, row) {
      let _this = this;
      _this
        .$confirm("此操作将永久删除该班级, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.axios
            .get("/Class/RemoveClass", {
              params: {
                classId: row.classId
              }
            })
            .then(res => {
              let code = res.data.code; //返回代码
              let message = res.data.message; //消息
              if (code == 1) {
                _this.tableData.splice(index,1);          
              }
              _this.formMessage(code,message);
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
      return formatDate(date, "yyyy年MM月dd日 hh:mm");
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  max-width: 480px;
}
/deep/ .el-select{
  display: flex;
  flex: 1;
}
/deep/ .el-dialog__body{
  padding: 30px 20px 0;
}
</style>
