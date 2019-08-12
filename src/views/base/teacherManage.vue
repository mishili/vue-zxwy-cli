<template>
  <!-- 全部老师 -->
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb">
      <el-breadcrumb-item>
        <a>基础数据</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>老师管理</el-breadcrumb-item>
      <template>
        <el-radio-group v-model="radio" @change="tableData = tableFilter">
          <el-radio
            v-for="(item,index) in radioData"
            :key="index"
            :label="item.userTypeTypeName"
          >{{ item.userTypeTypeName}}</el-radio>
        </el-radio-group>
      </template>
    </el-breadcrumb>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%;"
      height="430"
      :default-sort="{prop: 'userId', order: 'ascending'}"
    >
      <el-table-column type="index" label="编号" width="100"></el-table-column>
      <el-table-column prop="userMobile" label="手机号" sortable></el-table-column>
      <el-table-column prop="userName" label="老师名称" sortable></el-table-column>
      <el-table-column prop="userSex" label="性别" sortable></el-table-column>
      <el-table-column prop="userPassword" label="密码" sortable></el-table-column>
      <el-table-column prop="userTypeTypeName" label="角色" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            :disabled="scope.row.disableDelete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top:20px;">
      <el-dialog :title="submitValue?'修 改 老 师':'增 加 老 师'" :visible.sync="dialogFormVisible">
        <el-form
          :model="teacherForm"
          status-icon
          :rules="teacherRules"
          ref="teacherForm"
          v-if="dialogFormVisible"
        >
          <el-form-item label="老师名称" prop="userName" :label-width="formLabelWidth">
            <el-input v-model="teacherForm.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="userMobile" :label-width="formLabelWidth">
            <el-input v-model="teacherForm.userMobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="userSex" :label-width="formLabelWidth">
            <el-select v-model="teacherForm.userSex" placeholder="请选择">
              <el-option value="男"></el-option>
              <el-option value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword" :label-width="formLabelWidth">
            <el-input v-model="teacherForm.userPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="userTypeTypeName" :label-width="formLabelWidth">
            <el-select
              v-model="teacherForm.userTypeTypeName"
              placeholder="请选择"
              @change="selectRoll"
            >
              <el-option
                v-for="(item,index) in rollData"
                :key="index"
                :value="item.userTypeTypeName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false,resetForm('teacherForm')">取 消</el-button>
          <el-button
            type="primary"
            @click="submitValue?submitForm1('teacherForm'):submitForm2('teacherForm')"
          >确 定</el-button>
        </div>
      </el-dialog>
      <el-button type="primary" icon="el-icon-plus" @click="resetClass">增加</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        //获取所有的老师信息
        {
          userId: 925, //主键编号
          userUid: "ECEBA6FCAED245539C03C235DE1595F8", //标识符
          userMobile: "10472569654", //手机号
          userName: "李四", //老师名称
          userSex: "男", //性别
          userPassword: "123123", //密码
          userUserTypeId: 2, //角色编号
          userTypeTypeName: "教员", //角色
          disableDelete: true //禁用删除 true：禁用 false：可用
        }
      ],
      filterData: [], //用于过滤转换
      rollData: [], //角色数据
      radioData: [  //单选组数据
        {
          userTypeId: 0,
          userTypeTypeName: '全部'
        }
      ],
      radio: "全部", //单选框默认选择
      teacherForm: {
        userUid: "", //要修改的用户标识符
        userName: "", //修改老师名称
        userMobile: "", //要修改的手机号，11位手机号
        userSex: "男", //要修改的性别，男|女
        userUserTypeId: 0, //角色编号
        userTypeTypeName: "", //角色
        userPassword: "", //密码
        index: 0 //当前点击的下标
      },
      dialogFormVisible: false, //弹出框是否显示
      submitValue: false, //共用弹出框，true修改，false增加
      formLabelWidth: "80px", //表单lable宽度
      teacherRules: {
        //验证规则
        userName: [
          { required: true, message: "请输入老师姓名", trigger: "blur" }
        ],
        userMobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "长度为11个字符",
            trigger: ["blur", "change"]
          }
        ],
        userSex: [{ required: true, message: "请选择性别", trigger: "change" }],
        userTypeTypeName: [
          { required: true, message: "请选择角色", trigger: "change" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
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
    this.teacherManage();
    this.rollManage();
  },
  methods: {
    /**
     * 老师管理数据连接
     */
    teacherManage() {
      let _this = this;
      _this.axios
        .get("/User/GetTeachers")
        .then(res => {
          _this.tableData = res.data;
          _this.filterData = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 获取所有的角色信息
     */
    rollManage() {
      let _this = this;
      _this.axios
        .get("/UserType/GetUserRoles")
        .then(res => {
          _this.rollData = res.data;
          _this.radioData.push(...res.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 角色下拉框返回位置
     * @param {String} userTypeTypeName 角色选择框数据
     */
    selectRoll(userTypeTypeName) {
      let _this = this;
      let index = _this.rollData.findIndex(
        item => item.userTypeTypeName == userTypeTypeName
      );
      _this.teacherForm.userUserTypeId = _this.rollData[index].userTypeId;
    },
    /**
     * 修改老师
     * @param {Number} index 下标
     * @param {Obj} row 表格当前对象
     */
    handleEdit(index, row) {
      let _this = this;
      this.submitValue = true;
      _this.dialogFormVisible = true;
      _this.teacherForm.userUid = row.userUid;
      _this.teacherForm.userName = row.userName;
      _this.teacherForm.userMobile = row.userMobile;
      _this.teacherForm.userSex = row.userSex;
      _this.teacherForm.userUserTypeId = row.userUserTypeId;
      _this.teacherForm.userTypeTypeName = row.userTypeTypeName;
      _this.teacherForm.userPassword = row.userPassword;
      _this.teacherForm.index = index;
    },
    // 增加老师 数据初始化
    resetClass() {
      let _this = this;
      _this.submitValue = false;
      _this.dialogFormVisible = true;
      _this.teacherForm.userUid = 0;
      _this.teacherForm.userName = "zxczx";
      _this.teacherForm.userMobile = "15178784023";
      _this.teacherForm.userUserTypeId = "";
      _this.teacherForm.userTypeTypeName = "";
      _this.teacherForm.userPassword = "";
      _this.teacherForm.index = 0;
    },
    /**
     * 修改老师
     * @param {Obj} formName 表单对象
     */
    submitForm1(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.axios
            // .post("/User/ModifyTeacher", {
            //   userUid: _this.teacherForm.userUid, // 要修改的用户标识符
            //   userName: _this.teacherForm.userName, //要修改的名称
            //   userMobile: _this.teacherForm.userMobile, //要修改的手机号，11位手机号
            //   userSex: _this.teacherForm.userSex, //要修改的性别，男|女
            //   userUserTypeId: _this.teacherForm.userUserTypeId, //角色
            //   userPassword: _this.teacherForm.userPassword //要修改的密码
            // })
            .post("/User/ModifyTeacher", _this.teacherForm)
            .then(res => {
              let code = res.data.code; //返回代码
              let message = res.data.message; //消息
              console.log(res);
              if (code == 1) {
                let index = _this.teacherForm.index;
                _this.tableData[index].userName = _this.teacherForm.userName;
                _this.tableData[index].userMobile = _this.teacherForm.userMobile;
                _this.tableData[index].userSex = _this.teacherForm.userSex;
                _this.tableData[index].userTypeTypeName = _this.teacherForm.userTypeTypeName;
                _this.tableData[index].userPassword = _this.teacherForm.userPassword;
                _this.dialogFormVisible = false;
              }
              _this.formMessage(code, message);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          _this.$message({
            message: "请输入老师名称",
            type: "warning"
          });
          return false;
        }
      });
    },
    /**
     * 增加老师
     * @param {Obj} formName 表单对象
     */
    submitForm2(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          // _this.axios.post("/User/AddTeacher", {
          //   userName: _this.teacherForm.userName, //用户名，不能为空
          //   userMobile: _this.teacherForm.userMobile, //手机号，长度11位
          //   userSex: _this.teacherForm.userSex, //性别，男|女
          //   userUserTypeId: _this.teacherForm.userUserTypeId, //老师角色编号
          //   userPassword: _this.teacherForm.userPassword //密码，长度6~18
          // })
          _this.axios
            .post("/User/AddTeacher", _this.teacherForm)
            .then(res => {
              let code = res.data.code; //返回代码
              let message = res.data.message; //消息
              let data = res.data.data; //操作成功后，返回给前端有用的数据
              if (code == 1) {
                data.userTypeTypeName = _this.teacherForm.userTypeTypeName;
                _this.tableData.unshift(data);
                _this.dialogFormVisible = false;
              }
              _this.formMessage(code, message);
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
     * 删除老师
     * @param {Number} index 下标
     * @param {Obj} row 表格当前对象
     */
    handleDelete(index, row) {
      let _this = this;
      _this
        .$confirm("此操作将永久删除该老师, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.axios
            // 删除老师使用query参数
            .post("/User/RemoveTeacher", null, {
              params: {
                uid: row.userUid
              }
            })
            .then(res => {
              console.log(res);
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
  computed: {
    // 过滤计算
    tableFilter(){
      let _this = this;
      let table = _this.filterData;
      let typeName = _this.radioData[0].userTypeTypeName;
      if(_this.radio==typeName){
        return _this.filterData;
      }
      return table.filter(taData => taData.userTypeTypeName == _this.radio)
    }
  }
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  text-align: left;
  /deep/ .el-radio {
    margin-right: 20px;
  }
}
/deep/ .el-dialog {
  max-width: 480px;
}
/deep/ .el-select {
  display: flex;
  flex: 1;
}
/deep/ .el-dialog__body {
  padding: 30px 20px 0;
}
</style>
