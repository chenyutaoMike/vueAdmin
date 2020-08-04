<template>
  <div class="dialog">
    <el-dialog
      title="新增"
      :visible.sync="data.dialog_info_flag"
      @close="close"
      @opened="openDialog"
      @open="open"
      width="700px"
    >
      <el-form :model="data.form" ref="addInfoForm" :rules="data.rules">
        <el-form-item label="邮箱：" :label-width="data.formLabelWidth" prop="username">
          <el-input id="username" placeholder="请输入邮箱：" v-model="data.form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="data.formLabelWidth" prop="password">
          <el-input placeholder="请输入6~20位数字+字母：" type="password" v-model="data.form.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" :label-width="data.formLabelWidth" prop="truename">
          <el-input placeholder="请输入姓名" v-model="data.form.truename"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" :label-width="data.formLabelWidth" prop="phone">
          <el-input placeholder="请输入手机号" v-model="data.form.phone"></el-input>
        </el-form-item>
        <el-form-item label="地区：" :label-width="data.formLabelWidth" prop="region">
          <CityPicker
            :cityPickerLevel="['province','city','area','street']"
            :cityPickerData="data.cityPickerData"
            @updataCityPickerData="updataCityPickerData"
          />
        </el-form-item>
        <el-form-item label="是否启用：" :label-width="data.formLabelWidth" width="580" prop="status">
          <el-radio v-model="data.form.status" label="1">启用</el-radio>
          <el-radio v-model="data.form.status" label="2">禁用</el-radio>
        </el-form-item>
        <el-form-item label="角色：" :label-width="data.formLabelWidth" width="580" prop="role">
          <el-checkbox-group v-model="data.form.role">
            <el-checkbox :key="item.role" :label="item.name" v-for="item in data.roleItem"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="按钮权限：" :label-width="data.formLabelWidth" width="580">
          <template v-if="data.btnPerm.length > 0">
            <div v-for="item in data.btnPerm" :key="item.name">
              <h4>{{item.name}}</h4>
              <template v-if="item.perm && item.perm.length > 0">
                <el-checkbox-group v-model="data.form.btnPerm">
                  <el-checkbox
                    :key="buttons.value"
                    :label="buttons.value"
                    v-for="buttons in item.perm"
                  >{{buttons.name}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" style=" text-align: center">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger" :loading="data.submitLoading" @click="submit('addInfoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetRole,
  GetSystem,
  AddUser,
  UserEdit,
  GetPermButton
} from "@/api/user";
import sha1 from "js-sha1";
import { ref, reactive, watch, onMounted } from "@vue/composition-api";
import CityPicker from "@/components/CityPicker";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode,
  extractCode
} from "@/utils/validate.js";

export default {
  name: "dialogInfo",
  components: {
    CityPicker
  },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit, root, refs }) {
    /**
     * 表单验证
     */
    const validateUsername = (rule, value, callback) => {
      console.log(value);
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
      /**
       * 业务逻辑
       * 1.编辑状态：
       *      需要校验密码：data.form.id存在并且密码不为空时
       *      不需要校验：data.form.id存在并且密码为空时
       * 2.添加状态
       *    data.form.id 不存在
       */
      if (data.form.id && !value) {
        callback();
      }
      if ((data.form.id && value) || !data.form.id) {
        if (value) {
          data.form.password = stripscript(value);
          value = data.form.password;
        }

        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (validatePass(value)) {
          callback(new Error("密码为6至20位的数字字母组合"));
        } else {
          callback();
        }
      }

      // 过滤密码特殊字符
      if (value) {
        data.form.password = stripscript(value);
        value = data.form.password;
      }

      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20位的数字字母组合"));
      } else {
        callback();
      }
    };

    const data = reactive({
      dialog_info_flag: false, //弹窗标记
      formLabelWidth: "100px", //label宽度
      // 城市数据
      cityPickerData: {},
      form: {
        username: "",
        truename: "",
        password: "",
        phone: "",
        status: "1",
        role: [],
        btnPerm: []
      },
      // 是否启用状态
      // 角色

      // 角色选项
      roleItem: [],
      // 按钮权限
      btnPerm: [],
      categoryOption: [], // 分类下拉列表数组
      submitLoading: false, //按钮loading
      rules: reactive({
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      })
    });
    /**
     * 表单验证
     */

    /**
     * watch
     */
    watch(() => {
      data.dialog_info_flag = props.flag;
    });

    /**
     * methods
     */

    /**
     * 请求用户角色
     */
    const getSystem = () => {
      // 如果这两个参数都有值，就不用重新请求
      if (data.roleItem.length === 0) {
        GetRole().then(res => {
          console.log(res);
          let result = res.data;
          if (result.resCode === 0) {
            data.roleItem = result.data;
          }
        });
      }
      if (data.btnPerm.length === 0) {
        GetPermButton().then(res => {
          let result = res.data;
          if (result.resCode === 0) {
            data.btnPerm = result.data;
          }
        });
      }
    };
    // 打开弹窗的时候调用接口
    const open = () => {
      // 角色请求
      getSystem();
      // 初始值处理
      let editData = props.editData;
      if (editData.id && editData.type === "edit") {
        // 编辑
        editData.role = editData.role ? editData.role.split(",") : [];

        editData.btnPerm = editData.btnPerm ? editData.btnPerm.split(",") : [];

        // data.form = editData;
        for (const key in editData) {
          data.form[key] = editData.id ? editData[key] : "";
        }
        console.log("编辑", data.form);
      } else if (editData.type === "add") {
        // 添加
        data.form.id && delete data.form.id;
        for (const key in editData) {
          data.form[key] = "";
        }
        //如果是碰到了按钮权限，把它转为数组
        data.form["btnPerm"] = [];
        data.form["role"] = [];

        console.log("添加", data.form);

        return;
      }
    };

    const close = () => {
      emit("close", false);
      data.dialog_info_flag = false;
      resultForm();
    };
    const openDialog = () => {
      data.categoryOption = props.category;
    };
    const updataCityPickerData = val => {
      data.cityPickerData = val;
      console.log(data.cityPickerData);
    };
    const submit = formName => {
      refs[formName].validate(valid => {
        //表单验证通过
        if (valid) {
          let requestData = JSON.parse(JSON.stringify(data.form));
          requestData.role = requestData.role.join();
          requestData.btnPerm = requestData.btnPerm.join();

          requestData.region = data.cityPickerData;
          // 添加状态：需要密码，并且加密
          // 编辑状态：值存在，需要密码并加密，否则删除
          // 密码加密

          if (requestData.id) {
            if (requestData.password) {
              requestData.password = sha1(requestData.password);
            } else {
              delete requestData.password;
            }

            userEdit(requestData);
          } else {
            requestData.password = sha1(requestData.password);

            userAdd(requestData);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    const userAdd = requestData => {
      AddUser(requestData).then(res => {
        let result = res.data;
        if (result.resCode === 0) {
          root.$message({
            message: result.message,
            type: "success"
          });
        }
        resultForm();
        close();
        emit("reffeshTableData");
      });
    };

    const userEdit = requestData => {
      UserEdit(requestData).then(res => {
        let result = res.data;
        if (result.resCode === 0) {
          root.$message({
            message: result.message,
            type: "success"
          });
        }
        resultForm();
        close();
        emit("reffeshTableData");
      });
    };

    const resultForm = () => {
      data.cityPickerData = {};
      refs.addInfoForm.resetFields();
    };
    return {
      close,
      openDialog,
      open,
      submit,
      data,
      updataCityPickerData,
      validateUsername,
      validatePassword
      // rules
    };
  }
};
</script>

<style>
</style>