<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="label-wrap category">
          <label>关键字：</label>
          <div class="wrap-content">
            <el-row :gutter="16">
              <el-col :span="3">
                <SelectVue :config="data.configOption" :selectData.sync="data.selectData" />
              </el-col>
              <el-col :span="5">
                <el-input placeholder="请输入搜索关键字" v-model="data.key_word"></el-input>
              </el-col>
              <el-col :span="15">
                <el-button type="danger" @click="search">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" class="pull-right" @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>
    <div class="mt-30"></div>
    <el-row>
      <TableVue ref="userTable" :config="data.configTable" :tableRow.sync="data.tableRow">
        <template v-slot:status="slotData">
          <el-switch
            v-model="slotData.data.status"
            active-value="1"
            inactive-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handlerSwitch(slotData.data)"
          ></el-switch>
        </template>
        <template v-slot:operation="slotData">
          <el-button size="small" type="danger" @click="handlerDel(slotData.data)">删除</el-button>
          <el-button size="small" type="success" @click="handlerEdit(slotData.data)">编辑</el-button>
        </template>
        <template v-slot:tableFooterLeft>
          <el-button size="small" @click="handlerBatchDel">批量删除</el-button>
        </template>
      </TableVue>
    </el-row>
    <DialogAdd
      :flag="data.dialog_info"
      @close="closeDialog"
      @reffeshTableData="reffesData"
      :editData="data.editData"
    />
  </div>
</template>

<script>
import { reactive } from "@vue/composition-api";
import SelectVue from "@/components/Select";
import TableVue from "@/components/Table";
import DialogAdd from "./dialog/add";
import { global } from "@/utils/global_v3.0.js";
import { UserDelete, UserActives } from "@/api/user";
export default {
  name: "userIndex",
  components: {
    SelectVue,
    TableVue,
    DialogAdd
  },
  setup(props, { root, refs }) {
    const { confirm } = global();
    const data = reactive({
      value: true,
      dialog_info: false,
      configOption: {
        init: ["truename", "phone"]
      },
      // 下拉菜单数据
      selectData: {},
      // 搜索关键字
      key_word: "",
      // 阻止状态
      updateUserStatusFlag: false,
      editData: {},
      // table选择数据数据
      tableRow: {},
      // table组件配置参数
      configTable: {
        // 多选框
        selection: true,
        // 翻页记录 checkbox
        recordCheckBox: true,
        // 配置表头
        tHead: [
          { label: "邮箱/用户名", field: "username", width: 180 },
          { label: "姓名", field: "truename", width: 150 },
          { label: "手机号", field: "phone", width: 200 },
          { label: "地区", field: "region" },
          { label: "角色", field: "role", width: 100 },
          {
            label: "禁启用状态",
            field: "status",
            columnType: "slot",
            width: 100,
            slotName: "status"
          },
          {
            label: "操作",
            columnType: "slot",
            slotName: "operation"
          }
        ],
        // 请求接口url
        requestData: {
          url: "getUserList",
          method: "post",
          data: {
            pageNumber: 1,
            pageSize: 10
          }
        },
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper"
      },
      selectValue: "",
      option: [
        { value: "email", label: "邮箱" },
        { value: "phone", label: "手机" },
        { value: "name", label: "姓名" }
      ]
    });
    const operation = parmas => {
      // console.log(parmas);
    };
    const addUser = () => {
      data.dialog_info = true;
      data.editData.type = "add";
    };
    const closeDialog = () => {
      data.dialog_info = false;
    };
    /**
     * 批量删除用户
     */
    const handlerBatchDel = () => {
      let userId = data.tableRow.idItem;
      if (!userId || userId.length === 0) {
        root.$message({
          message: "请选择要删除的用户",
          type: "info"
        });
        return;
      }
      confirm({
        content: "确定要删除此数据吗",
        tip: "警告",
        id: userId,
        fn: userDelete
      });
    };
    /**
     * 删除用户接口
     */
    const userDelete = uid => {
      UserDelete({ id: uid }).then(res => {
        let result = res.data;
        if (result.resCode === 0) {
          reffesData();
          root.$message({
            message: result.message,
            type: "success"
          });
        }
      });
    };
    /**
     * 单点删除用户
     */
    const handlerDel = params => {
      data.tableRow.idItem = [params.id];
      confirm({
        content: "确定要删除此数据吗",
        tip: "警告",
        id: data.tableRow.idItem,
        fn: userDelete
      });
    };
    const reffesData = () => {
      refs.userTable.reffesData();
    };
    const handlerSwitch = params => {
      if (data.updateUserStatusFlag) return;
      data.updateUserStatusFlag = true;

      let requestData = {
        id: params.id,
        status: params.status
      };

      UserActives(requestData)
        .then(res => {
          let result = res.data;
          if (result.resCode === 0) {
            root.$message({
              message: result.message,
              type: "success"
            });
          }
          data.updateUserStatusFlag = false;
        })
        .catch(err => {
          data.updateUserStatusFlag = false;
        });
    };
    /**
     * 编辑
     */
    const handlerEdit = params => {
      data.dialog_info = true;
      // 子组件赋值
      data.editData = Object.assign({}, params);
      data.editData.type = "edit";
    };
    /**
     * 搜索
     */
    const search = () => {
      let requestData = {
        [data.selectData.value]: data.key_word
      };
      console.log("requestData",requestData)
      refs.userTable.paramsLoadData(requestData);
    };
    return {
      data,
      operation,
      addUser,
      closeDialog,
      handlerBatchDel,
      handlerDel,
      reffesData,
      handlerSwitch,
      handlerEdit,
      search
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/main.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
}
.mt-30 {
  margin-top: 30px;
}
</style>