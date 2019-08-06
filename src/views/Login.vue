<template>
  <div id="logReg">
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
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">提交</el-button>
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
// 引用工具类
import Base from "@/util/Base64";
import Cookie from "@/util/Cookie";
// import { setTimeout } from 'timers';

export default {
  name: "logReg",
  data() {
    return {
      checked: false, //记住密码状态
      loading: false,  //提交时加载状态
      //登录账号密码
      ruleForm: {
        userMobile: "",
        userPassword: ""
      },
      //登录验证
      rules: {
        userMobile: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    // Cookie存储账号和密码都存在时，也就是用户勾选记住密码并登录成功时,login页面显示账号和密码
    if (Cookie.getCookie("userName") && Cookie.getCookie("userPass")) {
      this.ruleForm.userMobile = Base.decode(Cookie.getCookie("userName")); //在Cookie中得到账号使用Base.decode解密用户输入的账号
      this.ruleForm.userPassword = Base.decode(Cookie.getCookie("userPass")); //在Cookie中得到密码使用Base.decode解密用户输入的密码
      this.checked = true;  //存在时记住密码状态为真
    }
  },
  methods: {
    /**
     * 登录提交
     */
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          //用户名,密码不为空,提交成功之后操作
          _this.loading = true; //按钮点击后呈现加载状态
          _this.axios
            .get("/OAuth/authenticate", { //发送请求
              params: { //根据要api设置对应的请求参数
                userMobile: _this.ruleForm.userMobile,
                userPassword: _this.ruleForm.userPassword
              }
            })
            .then(res => {
                console.log(res);
                _this.loading = false;  //账号,密码验证成功 加载状态取消
                // 定义令牌,根据后台数据得到想要的数据拼接起来
                var token = res.data.token_type + " " + res.data.access_token;
                sessionStorage.setItem("token", token);
                // 存储返回的用户id,用作指定修改密码
                sessionStorage.setItem("userUid", res.data.profile.userUid);
                // 存储返回的用户名
                sessionStorage.setItem("userName", res.data.profile.userName);
                if (_this.checked) {  //记住密码勾选时进入条件
                  Cookie.setCookie( //Cookie存储账号
                    "userName", //设置账号key
                    Base.encode(_this.ruleForm.userMobile), //使用Base.encode加密用户输入的账号
                    {maxAge: 60*60*24}  //设置账号存储时长,指定时间删除
                  );
                  Cookie.setCookie( //Cookie存储密码
                    "userPass", //设置密码key
                    Base.encode(_this.ruleForm.userPassword), //使用Base.encode加密用户输入的密码
                    {maxAge: 60*60*24}  //设置密码存储时长,指定时间删除
                  );
                }else{
                  Cookie.removeCookie("userName"); //移除cookie账号
                  Cookie.removeCookie("userPass"); //移除cookie密码
                }
                _this.$message({  //登录成功提示语句
                  message: "登录成功",
                  type: "success"
                });
                _this.$router.replace("/home");  //成功后跳转到首页
            })
            .catch(error => {
              // 在账号或者密码错误,设置一定时间让用户不频繁请求
              setTimeout(function(){
                _this.loading = false;
              },1000)
              _this.$message({  //登录失败提示语句
                message: "账号或者密码错误",
                type: "error"
              });
              console.log(error);
            });
        } else {
          // 账号或者密码为空时提示语句
          _this.$message({
            message: "请输入用户名和密码",
            type: "warning"
          });
          return false;
        }
      });
    },
    /**
     * 登录框重置
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
// sass 变量声明
$login-bg1: rgba(254, 112, 26, 0.8);
$login-bg2: rgba(254, 112, 26, 0.9);

#logReg {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url("../assets/bg.gif") center no-repeat;
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
// 当需要覆盖,样式不成功时，使用/deep/深入
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