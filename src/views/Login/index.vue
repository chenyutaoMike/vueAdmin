<template>
  <div class="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="index === isActive ? 'current':'' "
          v-for="(item,index) in menuTab"
          :key="item.id"
          @click="toggleMenu(index)"
        >{{item.txt}}</li>
      </ul>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="login-form">
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            maxlength="20"
            minlength="6"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item-form" v-if="isActive === 1">
          <label for="passwords">重复密码</label>
          <el-input
            id="passwords"
            type="password"
            maxlength="20"
            minlength="6"
            v-model="ruleForm.passwords"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                id="code"
                type="text"
                :maxlength="6"
                :minlength="6"
                v-model="ruleForm.code"
                autocomplete="off"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms"
                :disabled="codeButtonStatus.status"
              >{{codeButtonStatus.text}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            :disabled="loginButtonStatus"
            @click="submitForm"
            class="block login-btn"
          >{{isActive===0?'登录':'注册'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from "js-sha1";
import {
  reactive,
  ref,
  isRef,
  toRefs,
  onMounted,
  onUnmounted
} from "@vue/composition-api";
import { GetSms, Register, Login } from "@/api/login.js";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode,
  extractCode
} from "@/utils/validate.js";
export default {
  name: "login",
  setup(props, { refs, root }) {
    // 验证码
    let validateCode = (rule, value, callback) => {
      console.log(value);
      ruleForm.code = stripscript(value);
      value = ruleForm.code;
      if (value === "") {
        return callback(new Error("验证码不能为空"));
      } else if (validateVCode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    // 验证用户名
    let validateUsername = (rule, value, callback) => {
      console.log("触发", value);
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback(); //true 验证通过
      }
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      // 过滤密码特殊字符
      ruleForm.password = stripscript(value);
      value = ruleForm.password;

      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20位的数字字母组合"));
      } else {
        callback();
      }
    };
    // 验证重复密码
    let validatePasswords = (rule, value, callback) => {
      // 过滤密码特殊字符
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;

      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== ruleForm.password) {
        callback(new Error("两次密码不正确"));
      } else {
        callback();
      }
    };
    /**
     * 声明数据
     */
    //这里面放data数据、生命周期、自定义函数
    const menuTab = reactive([
      //引用类型用reactive声明
      { txt: "登陆", id: 0 },
      { txt: "注册", id: 1 }
    ]);
    const isActive = ref(0); //值类型用ref声明
    // 登录按钮禁用状态
    const loginButtonStatus = ref(true);
    // 验证码按钮禁用状态
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    // 验证码获取倒计时
    const timer = ref(null);
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });
    /**
     * 生命周期
     */
    // 挂载完成后
    onMounted(() => {});
    /**
     * 声明函数
     */
    /**
     * 切换登陆注册
     */
    const toggleMenu = index => {
      isActive.value = index;
      //重置表单
      refs.loginForm.resetFields();
    };
    /**
     * 更新按钮状态
     */
    const updataButtonStatus = parmas => {
      codeButtonStatus.text = parmas.text;
      codeButtonStatus.status = parmas.status;
    };
    /**
     * 提交表单
     */
    const submitForm = formName => {
      refs.loginForm.validate(valid => {
        //表单验证通过
        if (valid) {
          let requestData = {
            username: ruleForm.username,
            password: sha1(ruleForm.password), //加密密码
            code: ruleForm.code
          };
          // 判断是登陆还是注册
          isActive.value === 0 ? login(requestData) : register(requestData);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    /**
     * 登陆
     */
    const login = requestData => {
      Login(requestData).then(res => {
        let data = res.data;
        console.log(data);
        root.$message({
          message: data.message,
          type: "success"
        });
      });
    };
    /**
     * 注册
     */
    const register = requestData => {
      Register(requestData).then(res => {
        let data = res.data;
        root.$message({
          message: data.message,
          type: "success"
        });
        toggleMenu(0); //注册成功，切换到登陆页面
        clearCountDown(); //清除注册页面的定时器
      });
    };
    /**
     * 验证码倒计时
     */
    const countDown = number => {
      // 判断定时器是否存在，存在则清除
      if (timer.value) clearInterval(timer.value);
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          //60秒过后，清除定时器
          clearInterval(timer.value);
          updataButtonStatus({
            status: false,
            text: "重新获取"
          });
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    };
    /**
     * 清除倒计时
     */
    const clearCountDown = () => {
      updataButtonStatus({
        status: false,
        text: "获取验证码"
      });
      clearInterval(timer.value);
    };

    /**
     * 获取验证码
     */
    const getSms = () => {
      console.log(ruleForm.username);
      if (ruleForm.username === "" || ruleForm.password === "") {
        root.$message.error("请输入邮箱和密码");
        return;
      }
      if (validateEmail(ruleForm.username)) {
        root.$message.error("用户名格式有误");
        return;
      }
      // 修改获取验证码按钮状态
      codeButtonStatus.status = true;
      codeButtonStatus.text = "获取中";
      // 判断是登录还是注册
      let moduleTxt = isActive.value === 0 ? "login" : "register";
      GetSms({ username: ruleForm.username, module: moduleTxt })
        .then(res => {
          let data = res.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          ruleForm.code = extractCode(data.message); //提取验证码
          loginButtonStatus.value = false;
          countDown(60);
        })
        .catch(err => {
          console.log(err);
        });
    };
    return {
      menuTab,
      isActive,
      loginButtonStatus,
      codeButtonStatus,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      validateCode,
      validateUsername,
      validatePasswords,
      getSms
    };
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
