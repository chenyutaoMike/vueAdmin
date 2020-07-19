<template>
  <div class="dialog">
    <el-dialog title="修改" :visible.sync="data.dialog_info_flag" @close="close" @opened="openDialog">
      <el-form :model="data.form" ref="editInfoForm">
        <el-form-item label="类型：" :label-width="data.formLabelWidth" prop="category">
          <el-select v-model="data.form.category" placeholder="请选择分类">
            <el-option
              v-for="item in data.categoryOption"
              :key="item.id"
              :label="item.category_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题：" :label-width="data.formLabelWidth" prop="title">
          <el-input placeholder="请输入内容" v-model="data.form.title"></el-input>
        </el-form-item>
        <el-form-item label="概况：" :label-width="data.formLabelWidth" width="580" prop="content">
          <el-input
            type="textarea"
            v-model="data.form.content"
            style="maxHeight:150px"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger" :loading="data.submitLoading" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetList, EditInfo } from "@/api/news";
import { ref, reactive, watch } from "@vue/composition-api";
export default {
  name: "dialogEditInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: ""
    }
  },
  setup(props, { emit, root, refs }) {
    const data = reactive({
      dialog_info_flag: false, //弹窗标记
      formLabelWidth: "70px", //label宽度
      form: {
        //form数据
        category: "",
        title: "",
        content: ""
      },
      categoryOption: [], // 分类下拉列表数组
      submitLoading: false //按钮loading
    });

    /**
     * watch
     */
    watch(() => {
      data.dialog_info_flag = props.flag;
    });

    /**
     * methods
     */
    const close = () => {
      emit("close", false);
      data.dialog_info_flag = false;
      resultForm();
    };
    const openDialog = () => {
      data.categoryOption = props.category;
      console.log("change");
      getInfo(props.id);
    };
    const getInfo = id => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id
      };
      GetList(requestData).then(res => {
        let result = res.data.data.data[0];
        data.form.category = result.categoryId;
        data.form.title = result.title;
        data.form.content = result.content;
      });
    };
    const submit = () => {
      if (!data.form.category) {
        root.$message({
          message: "请选择分类",
          type: "error"
        });
        return;
      }
      if (!data.form.title) {
        root.$message({
          message: "请输入标题",
          type: "error"
        });
        return;
      }
      if (!data.form.content) {
        root.$message({
          message: "请输入内容",
          type: "error"
        });
        return;
      }

      data.submitLoading = true;
      let imgUrl =
        "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg";
      let requestData = {
        id: props.id,
        categoryId: data.form.category,
        title: data.form.title,
        content: data.form.content,
        updateDate: new Date(),
        imgUrl: imgUrl
      };
      EditInfo(requestData)
        .then(res => {
          data.submitLoading = false;
          let result = res.data;
          if (result.resCode === 0) {
            console.log(result);
            // 重置表单
            resultForm();
            root.$message({
              message: result.message,
              type: "success"
            });
            emit("getList");
          }
        })
        .catch(err => {
          data.submitLoading = false;
        });
    };
    const resultForm = () => {
      refs.editInfoForm.resetFields();
    };
    return {
      close,
      openDialog,
      submit,
      data
    };
  }
};
</script>

<style>
</style>