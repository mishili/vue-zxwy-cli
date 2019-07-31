<template>
  <div class="logReg">
    <!-- 登录 -->
    <div class="login">
      <div class="login-title">登录</div>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="login-ruleForm"
      >
        <el-form-item label="账号" prop="userMobile">
          <el-input type="string" v-model="ruleForm.userMobile" placeholder="请输入您的账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input
            type="password"
            v-model="ruleForm.userPassword"
            autocomplete="off"
            placeholder="请输入您的密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked">是否记住密码</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Base from "@/util/Base64";
import Cookie from "@/util/Cookie";

export default {
  name: "logReg",
  data() {
    //登录账号验证
    var validateuserMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        //向后台请求验证账号是否存在
        callback();
      }
    };
    //登录密码验证
    var validateuserPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        //向后台验证，也可以不处理
        callback();
      }
    };
    return {
      checked: false, //记住密码状态
      //登录账号密码
      ruleForm: {
        userMobile: "",
        userPassword: ""
      },
      //登录验证
      rules: {
        userMobile: [{ validator: validateuserMobile, trigger: "blur" }],
        userPassword: [{ validator: validateuserPassword, trigger: "blur" }]
      }
    };
  },
  created() {
    this.ruleForm.userMobile = "";
    this.ruleForm.userPassword = "";
    if (Cookie.getCookie("userName") && Cookie.getCookie("userPass")) {
      this.ruleForm.userMobile = Base.decode(Cookie.getCookie("userName"));
      this.ruleForm.userPassword = Base.decode(Cookie.getCookie("userPass"));
    }
  },
  methods: {
    //登录提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交成功之后操作
          this.axios
            .get("/OAuth/authenticate", {
              params: {
                userMobile: this.ruleForm.userMobile,
                userPassword: this.ruleForm.userPassword
              }
            })
            .then(res => {
              console.log(res);
              if (res.status === 200 && res.statusText === "OK") {
                var token = res.data.token_type + " " + res.data.access_token;
                sessionStorage.setItem("token", JSON.stringify(token));
                if (this.checked) {
                  Cookie.setCookie(
                    "userName",
                    Base.encode(this.ruleForm.userMobile),
                    {maxAge: 60*60*24}
                  );
                  Cookie.setCookie(
                    "userPass",
                    Base.encode(this.ruleForm.userPassword),
                    {maxAge: 60*60*24}
                  );
                }else{
                  Cookie.removeCookie("userName"); //移除cookie
                  Cookie.removeCookie("userPass"); 
                }
                this.$message({
                  message: "恭喜，登录成功",
                  type: "success"
                });
                this.$router.push("/home");
              } else {
                this.$router.push("/");
              }
            })
            .catch(error => {
              this.$message({
                message: "账号或者密码错误",
                type: "error"
              });
              console.log(error);
            });
        } else {
          this.$message({
            message: "抱歉，登录失败",
            type: "warning"
          });
          return false;
        }
      });
    },
    //登录框重置
    resetForm(formName) {
      // this.ruleForm.userMobile = "";
      // this.ruleForm.userPassword = "";
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
$login-bg1: rgba(254, 112, 26, 0.8);
$login-bg2: rgba(254, 112, 26, 0.9);

.logReg {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url("../assets/car.jpg") center no-repeat;
  background-size: cover;
}
.el-button--primary {
  color: #fff;
  background-color: $login-bg1;
  border-color: $login-bg2;
}
.el-button:focus {
  color: #333;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #dcdfe6;
}
.el-button:hover {
  color: rgba(254, 112, 26, 1);
  background-color: rgba(255, 255, 255, 0.1);
  border-color: $login-bg2;
}
.el-button--primary:hover {
  color: #fff;
  background-color: $login-bg1;
  border-color: $login-bg2;
}
.el-button--primary:focus {
  color: #fff;
  background-color: $login-bg1;
  border-color: $login-bg2;
}
.register,
.login {
  padding: 40px 0px 40px 0;
  background-color: #fff;
  width: 90%;
  max-width: 550px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.register .register-title,
.login .login-title {
  font-size: 1.65rem;
  line-height: 60px;
  font-weight: bold;
  white-space: nowrap;
  margin-bottom: 16px;
  color: #555;
  /*      color: $login-bg1;*/
}
.register-ruleForm,
.login-ruleForm {
  width: 90%;
  margin: 0 auto;
  padding: 0px 50px 0px 0;
}
.logReg .toregister span {
  cursor: pointer;
  color: red;
  text-decoration: underline;
}
/deep/ .el-checkbox__input {
  &.is-focus {
    .el-checkbox__inner {
      border-color: $login-bg2;
    }
  }
  &.is-checked {
    .el-checkbox__inner {
      background-color: $login-bg1;
      border-color: $login-bg2;
      &:hover {
        border-color: $login-bg2;
      }
    }
    & + .el-checkbox__label {
      color: $login-bg1;
    }
  }
}
/deep/ .el-checkbox__inner {
  &:hover {
    border-color: $login-bg2;
  }
}
</style>