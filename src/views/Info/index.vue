<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for>分类：</label>
          <div class="wrap-content">
            <el-select v-model="category_value" placeholder="请选择" style="width:100%">
              <el-option
                style="width:100%"
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="label-wrap date">
          <label for>日期：&nbsp;&nbsp;</label>
          <div class="wrap-content">
            <el-date-picker
              style="width:100%"
              v-model="date_value"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              prefix-icon="el-icon-time"
              :default-time="['23:00:00','08:00:00']"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="label-wrap key-word">
          <label for>关键字：&nbsp;&nbsp;</label>
          <div class="wrap-content" style="width:102px">
            <el-select v-model="search_Key">
              <el-option
                style="width:100%"
                v-for="item in searchOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-input v-model="search_keywork" placeholder="请输入内容" style="width:100%"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" style="width:100%" @click="search">搜索</el-button>
      </el-col>

      <el-col :span="2">
        <el-button type="danger" style="width:100%" @click="openDialog">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <el-table
      :data="tableData.item"
      border
      v-loading="loadingData"
      style="width: 100%;marginTop:30px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="categoryId" label="类别" width="110" :formatter="toCategory"></el-table-column>
      <el-table-column prop="createDate" label="日期" width="220" :formatter="toData"></el-table-column>
      <el-table-column prop="user" label="管理员" width="115"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="editInfo(scope.row.id)">编辑</el-button>

          <el-button type="success" size="mini" @click="toDetailed(scope.row)">
            编辑详情
          </el-button>

          <el-button type="danger" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-row style="marginTop:30px">
      <el-col :span="12">
        <el-button size="medium" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :total="total"
          :page-size="10"
          class="pull-right"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 新增弹窗 -->
    <DialogInfo :flag="dialog_info" @close="closeDialog" :category="options.category"></DialogInfo>
    <!-- 修改弹窗 -->
    <DialogEditInfo
      :flag="dialog_info_edit"
      :id="infoId"
      @close="closeDialogEdit"
      :category="options.category"
      @getList="getList"
    ></DialogEditInfo>
  </div>
</template>

<script>
import { GetList, DeleteInfo } from "@/api/news";
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
import { common } from "@/api/common";
import { global } from "@/utils/global_v3.0.js";
import { formateDate } from "@/utils/common";
export default {
  name: "infoindex",
  components: {
    DialogInfo,
    DialogEditInfo
  },
  setup(props, { root }) {
    const { confirm } = global();
    const { getInfoCategory, categoryItem } = common();
    /**
     * 数据
     */
    const options = reactive({
      category: []
    });
    // 搜索关键字
    const searchOption = reactive([
      {
        value: "id",
        label: "ID"
      },
      {
        value: "title",
        label: "标题"
      }
    ]);
    const tableData = reactive({
      item: []
    });
    const search_Key = ref("id");
    const category_value = ref("");
    const date_value = ref("");
    const search_keywork = ref("");
    // 总条数
    const total = ref(0);
    // 页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 10
    });
    // 信息弹窗标记
    const dialog_info = ref(false);
    // 表格loading
    const loadingData = ref(false);
    // 删除队列的ID
    const deleteInfoId = ref("");
    // 修改弹窗
    const dialog_info_edit = ref(false);
    // 修改弹窗ID
    const infoId = ref("");
    /**
     * methods
     */
    const handleSizeChange = val => {
      page.pageSize = val;

      console.log(`每页 ${val} 条`);
    };
    const handleCurrentChange = val => {
      page.pageNumber = val;
      console.log(`当前页: ${val}`);
      getList();
    };
    // 打开编辑框
    const openDialog = () => {
      dialog_info.value = true;
    };
    // 关闭编辑框
    const closeDialog = () => {
      dialog_info.value = false;
    };
    // 打开修改框
    const editInfo = id => {
      dialog_info_edit.value = true;
      infoId.value = id;
    };
    // 关闭修改框
    const closeDialogEdit = () => {
      dialog_info_edit.value = false;
    };
    /**
     * 删除数据
     */
    const deleteItem = id => {
      deleteInfoId.value = [id];
      console.log(id);
      confirm({
        content: "确认删除当前信息，确认后无法恢复",
        tip: "警告",
        fn: confirmDelete
      });
    };
    const deleteAll = () => {
      if (!deleteInfoId.value || deleteInfoId.value.length === 0) {
        root.$message({
          message: "请选择要删除的项目",
          type: "info"
        });
        return;
      }
      confirm({
        content: "确认删除所有信息，确认后无法恢复",
        tip: "警告",
        fn: confirmDelete
      });
    };
    const confirmDelete = value => {
      DeleteInfo({ id: deleteInfoId.value }).then(res => {
        console.log(res);
        let result = res.data;
        if (result.resCode === 0) {
          root.$message({
            message: result.message,
            type: "success"
          });
          getList();
          deleteInfoId.value = ""; //清空id数组
        }
      });
    };
    const search = () => {
      formatData();
      getList();
    };
    const formatData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      // 分类id
      if (category_value.value) {
        requestData.categoryId = category_value.value;
      }
      // 日期
      if (date_value.value.length > 0) {
        requestData.startTiem = date_value.value[0];
        requestData.endTime = date_value.value[1];
      }
      // 关键字
      if (search_keywork.value) {
        requestData[search_Key.value] = search_keywork.value;
      }
      return requestData;
    };
    const getList = () => {
      loadingData.value = true;
      let requestData = formatData();
      GetList(requestData)
        .then(res => {
          loadingData.value = false;

          let result = res.data;
          if (result.resCode === 0) {
            tableData.item = result.data.data;
            total.value = result.data.total;
          }
        })
        .catch(err => {
          loadingData.value = false;
        });
    };
    const toData = row => {
      return formateDate(row.createDate);
    };
    const toCategory = row => {
      return options.category.filter(item => item.id === row.categoryId)[0]
        .category_name;
    };
    const handleSelectionChange = val => {
      const id = val.map(item => item.id);
      deleteInfoId.value = id;
    };
    const toDetailed = (data) =>{
      // root.$router.push({
      //   name:'InfoDetailed',
      //   query:{
      //     id:data.id,
      //     title:data.title
      //   }
      // })
     root.$store.commit("infoDetailed/UPDATE_STATE_VALUE",{
       id:{
         value:data.id,
         sessionKey:'infoId',
         session:true
       },
       title:{
         value:data.title,
         sessionKey:'infoTitle',
         session:true
       }
     })
      root.$router.push({
        name:'InfoDetailed',
        params:{
          id:data.id,
          title:data.title
        }
      })
    }
    /**
     * 生命周期函数
     */
    onMounted(() => {
      // 获取分类
      getInfoCategory();
      // 获取列表
      getList();
    });
    /**
     * watch
     */
    watch(
      //监听category.item的变化
      () => categoryItem.item,
      value => {
        options.category = value;
      }
    );
    return {
      //ref
      category_value,
      date_value,
      search_Key,
      search_keywork,
      dialog_info,
      loadingData,
      dialog_info_edit,
      infoId,
      //reactive
      options,
      searchOption,
      tableData,
      total,
      //methods
      handleSizeChange,
      handleCurrentChange,
      openDialog,
      closeDialog,
      deleteItem,
      deleteAll,
      toData,
      toCategory,
      handleSelectionChange,
      search,
      closeDialogEdit,
      editInfo,
      getList,
      toDetailed
    };
  }
};
</script>

<style lang="scss" >
@import "../../assets/css/main.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 93, 40);
  }
  &.key-word {
    @include labelDom(right, 99, 40);
  }
}
</style>