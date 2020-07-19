<template>
  <div class="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="index === isActive ? 'current':'' "
          v-for="(item,index) in menuTab"
          :key="item.id"
          @click="toggleMneu(index)"
        >{{item.txt}}</li>
      </ul>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form">
        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input
            type="password"
            maxlength="20"
            minlength="6"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item-form" v-if="isActive === 1">
          <label>重复密码</label>
          <el-input
            type="password"
            maxlength="20"
            minlength="6"
            v-model="ruleForm.passwords"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input type="text" v-model.number="ruleForm.code" maxlength="6" minlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="block login-btn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode
} from "@/utils/validate.js";
export default {
  name: "login",
  data() {
    // 验证码
    var validateCode = (rule, value, callback) => {
      this.ruleForm.code = stripscript(value);
      value = stripscript(value);
      console.log(value);
      if (value === "") {
        return callback(new Error("验证码不能为空"));
      } else if (validateVCode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    // 验证用户名
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback(); //true 验证通过
      }
    };
    // 验证密码
    var validatePassword = (rule, value, callback) => {
      // 过滤密码特殊字符
      this.ruleForm.password = stripscript(value);
      value = this.ruleForm.password;

      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20位的数字字母组合"));
      } else {
        callback();
      }
    };
        // 验证重复密码
    var validatePasswords = (rule, value, callback) => {
      // 过滤密码特殊字符
      this.ruleForm.passwords = stripscript(value);
      value = this.ruleForm.passwords;

      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
       callback(new Error("两次密码不正确"));
      } else {
        callback();
      }
    };
    return {
      menuTab: [
        { txt: "登陆", id: 0 },
        { txt: "注册", id: 1 }
      ],
      model:'register',
      isActive: 0,
      ruleForm: {
        username: "",
        password: "",
        passwords:"",
        code: ""
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        passwords: [{ validator: validatePasswords, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 切换状态栏
    toggleMneu(index) {
      this.isActive = index;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background-color: #344a5f;
  .login-wrap {
    width: 330px;
    margin: auto;
    height: 100%;
    .menu-tab {
      text-align: center;
      li {
        display: inline-block;
        width: 88px;
        line-height: 36px;
        font-size: 14px;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
        &.current {
          background-color: #2f4255;
        }
      }
    }
  }
  .login-form {
    display: block;
    color: #fff;
    font-size: 14px;
    margin-bottom: 3px;
    .item-form {
      margin-bottom: 13px;
    }
  }
  .login-btn {
    margin-top: 19px;
  }
  .block {
    display: block;
    width: 100%;
  }
}
</style>
