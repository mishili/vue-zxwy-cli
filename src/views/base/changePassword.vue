<template>
  <div class="chPassword">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="旧密码" prop="oldpass">
        <el-input type="text" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="text" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setTimeout } from "timers";
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldpass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        oldpass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 8,
            message: "长度在 6 到 8 个字符",
            trigger: ["blur", "change"]
          }
        ],
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 8,
            message: "长度在 6 到 8 个字符",
            trigger: ["blur", "change"]
          }
        ],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    /**
     * 修改提交
     */
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this
            .$confirm("你确定修改密码吗, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              _this.axios
                .get("/User/ModifyPassword", {
                  params: {
                    uid: sessionStorage.getItem("userUid"),
                    oldPassword: _this.ruleForm.oldpass, //旧密码
                    newPassword: _this.ruleForm.pass //新密码
                  }
                })
                .then(res => {
                  console.log(res);
                  var type = "warning";
                  var message = "其它错误";
                  //code=0 数据没有任何变化 code=1 成功
                  //code=-1 系统异常 code=-2 参数错误 code=-3 旧密码错误  code=其它错误
                  switch (res.data.code) {
                    case -1:
                      message = res.data.message;
                      break;
                    case -2:
                      message = res.data.message;
                      break;
                    case -3:
                      message = res.data.message;
                      break;
                    case 0:
                      message = res.data.message;
                      type = "info";
                      break;
                    case 1:
                      message = res.data.message;
                      type = "success";
                      break;
                    default:
                      message = res.data.message;
                      break;
                  }
                  // 修改成功后3秒后跳转到登录页面
                  if (res.data.code == 1) {
                    _this.$message({
                      message: "修改密码成功,需重新登录,3秒后自动跳转到登录页面",
                      type: type
                    });
                    setTimeout(function() {
                      _this.$router.replace("/"); //成功后跳转到首页
                    }, 3000);
                  } else {
                    _this.$message({
                      //修改后提示语句
                      message: message,
                      type: type
                    });
                  }
                })
                // .catch(error => {
                //   // 令牌失效后做处理
                //   _this.$message({
                //     //修改失败提示语句
                //     message: "修改密码失败,需重新登录",
                //     type: "error"
                //   });
                //   console.log(error);
                // });
            })
            .catch(() => {
              _this.$message({
                type: "info",
                message: "已取消修改"
              });
            });
        } else {
          // 密码为空时提示语句
          _this.$message({
            message: "请输入正确的密码",
            type: "warning"
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
