<template>
  <!-- 全部角色 -->
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>
        <a>基础数据</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="tableData"
      border
      style="width: 100%;"
      height="430"
      :default-sort="{prop: 'userTypeId', order: 'ascending'}"
    >
      <el-table-column type="index" label="编号" width="100"></el-table-column>
      <el-table-column prop="userTypeTypeName" label="角色名称" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            :disabled="scope.row.disable"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top:20px;">
      <el-dialog :title="submitValue?'修 改 角 色':'增 加 角 色'" :visible.sync="dialogFormVisible">
        <el-form
          :model="roleForm"
          status-icon
          :rules="roleRules"
          ref="roleForm"
          v-if="dialogFormVisible"
        >
          <el-form-item label="角色名称" prop="userRoleName" :label-width="formLabelWidth">
            <el-input v-model="roleForm.userRoleName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false,resetForm('roleForm')">取 消</el-button>
          <el-button
            type="primary"
            @click="submitValue?submitForm1('roleForm'):submitForm2('roleForm')"
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
        //获取所有的角色信息
        {
          userTypeTypeName: "你好", //角色名称
          disable: true, //是否禁用删除按钮
          userTypeId: 1 //编号
        }
      ],
      majorData: [], //专业数据
      roleForm: {
        id: 0, //要修改的角色主键
        userRoleName: "", //要修改的角色名称
        index: 0 //当前点击的下标
      },
      dialogFormVisible: false, //弹出框是否显示
      submitValue: false, //共用弹出框，true修改，false增加
      formLabelWidth: "80px", //表单lable宽度
      roleRules: {
        //验证规则
        userRoleName: [
          { required: true, message: "请输入角色", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.roleManage();
  },
  methods: {
    /**
     * 角色管理数据连接
     */
    roleManage() {
      let _this = this;
      _this.axios
        .get("/UserType/GetUserRoles")
        .then(res => {
          _this.tableData = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 修改角色
     * @param {Number} index 下标
     * @param {Obj} row 表格当前对象
     */
    handleEdit(index, row) {
      let _this = this;
      this.submitValue = true;
      _this.dialogFormVisible = true;
      _this.roleForm.id = row.userTypeId;
      _this.roleForm.userRoleName = row.userTypeTypeName;
      _this.roleForm.index = index;
    },
    // 增加角色 数据初始化
    resetClass() {
      let _this = this;
      _this.submitValue = false;
      _this.dialogFormVisible = true;
      _this.roleForm.id = 0;
      _this.roleForm.userRoleName = "";
      _this.roleForm.index = 0;
    },
    /**
     * 修改角色
     * @param {Obj} formName 表单对象
     */
    submitForm1(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.axios // 使用query传参
            .post("/UserType/ModifyUserRole", null, {
              params: _this.roleForm
            })
            .then(res => {
              let code = res.data.code; //返回代码
              let message = res.data.message; //消息
              if (code == 1) {
                let index = _this.roleForm.index;
                _this.tableData[index].userTypeTypeName = _this.roleForm.userRoleName;
                _this.dialogFormVisible = false;
              }
              _this.formMessage(code, message);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          _this.$message({
            message: "请输入角色名称",
            type: "warning"
          });
          return false;
        }
      });
    },
    /**
     * 增加角色
     * @param {Obj} formName 表单对象
     */
    submitForm2(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.axios
            .post("/UserType/AddUserRole", null, {
              params: _this.roleForm
            })
            .then(res => {
              let code = res.data.code; //返回代码
              let message = res.data.message; //消息
              let data = res.data.data; //操作成功后，返回给前端有用的数据
              if (code == 1) {
                _this.tableData.push(data);
                _this.dialogFormVisible = false;
              }
              _this.formMessage(code, message);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          _this.$message({
            message: "请输入角色名称",
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
     * 删除角色
     * @param {Number} index 下标
     * @param {Obj} row 表格当前对象
     */
    handleDelete(index, row) {
      let _this = this;
      _this
        .$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.axios
            .post("/UserType/RemoveUserRole", null, {
              params: {
                userRoleId: row.userTypeId
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
      return formatDate(date, "yyyy年MM月dd日 hh:mm");
    }
  }
};
</script>

<style lang="scss" scoped>
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
