<template>
  <el-form :model="form" ref="ruleForm" label-width="120px" class="demo-ruleForm">
    <el-form-item label="信息分类：" prop="name">
      <el-select v-model="form.categoryId" placeholder="请选择分类">
        <el-option
          v-for="item in data.category"
          :key="item.id"
          :label="item.category_name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="新闻标题：" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="缩略图：" prop="delivery">
      <UploadImg :imgUrl="form.imgUrl" @updataImg="updataImg" :config="uploadImgConfig" />
    </el-form-item>
    <el-form-item label="选择日期：" prop="date">
      <el-date-picker
        v-model="form.createDate"
        align="right"
        type="date"
        placeholder="选择日期"
        :picker-options="data.pickerOptions"
        disabled
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="详细内容：" prop="delivery">
      <quillEditor v-model="form.content" :options="data.editorOption" ref="myQuillEditor" />
    </el-form-item>
    <el-form-item>
      <el-button type="danger" @click="submit" :loading="data.submitLoading">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { onMounted, ref, reactive, watch } from "@vue/composition-api";
import { GetList, EditInfo } from "@/api/news";
import { formateDate } from "@/utils/common";
import { common } from "@/api/common";
// 富文本编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import UploadImg from "@/components/Uploadimg";
export default {
  name: "infoDetailed",
  components: {
    quillEditor,
    UploadImg
  },
  setup(props, { root, refs }) {
    //图片上传路径
    const uploadImgConfig = reactive({
      uploadUrl: "http://up-z2.qiniup.com",
      accesskey: "0U7qW00LHkHyVMRMeMpCamco264GyJtR-pt6GuRk",
      secretkey: "yCJVdFMvRbFYhI6js09bNDHYe3j7K0xxMP6gi9BM",
      buckety: "webmikechen"
    });

    const data = reactive({
      category: [],
      editorOption: {},
      submitLoading: false,
      id: root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
      pickerOptions: ""
    });
    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      content: "",
      imgUrl: ""
    });
    const { getInfoCategory, categoryItem } = common();

    /**
     * methods
     */
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: data.id
      };
      GetList(requestData).then(res => {
        let result = res.data.data.data[0];
        form.categoryId = result.categoryId;
        form.title = result.title;
        form.content = result.content;
        form.createDate = formateDate(result.createDate);
        form.imgUrl = result.imgUrl;
      });
    };
    /**
     * 保存操作
     */
    const submit = () => {
      if (!form.title) {
        root.$message({
          message: "请输入标题",
          type: "error"
        });
        return;
      }
      if (!form.content) {
        root.$message({
          message: "请输入内容",
          type: "error"
        });
        return;
      }

      data.submitLoading = true;
      let requestData = {
        id: data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        updateDate: form.createDate,
        imgUrl: form.imgUrl
      };
      EditInfo(requestData)
        .then(res => {
          data.submitLoading = false;
          let result = res.data;
          if (result.resCode === 0) {
            root.$message({
              message: result.message,
              type: "success"
            });
          }
        })
        .catch(err => {
          data.submitLoading = false;
        });
    };
    const updataImg = val => {
      form.imgUrl = val;
    };

    /**
     * 生命周期函数
     */
    onMounted(() => {
      getInfoCategory();
      getInfo();
    });
    /**
     * watch
     */
    watch(
      //监听category.item的变化
      () => categoryItem.item,
      value => {
        data.category = value;
      }
    );
    return {
      uploadImgConfig,
      data,
      form,
      submit,
      updataImg
    };
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>