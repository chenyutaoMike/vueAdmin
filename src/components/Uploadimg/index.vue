<template>
  <el-upload
    class="avatar-uploader"
    :action="config.uploadUrl"
    :show-file-list="true"
    :data="data.uploadKey"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="data.image" :src="data.image" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { reactive, watch ,onMounted} from "@vue/composition-api";
import { QiniuToKen } from "@/api/common";

export default {
  /**
   * 1.七牛云的token、显示默认图片、选择图片后渲染自身图片
   * 2.返回选择后的图片路径
   */ name: "uploadImg",
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    config:{
      type:Object,
      default :() => {}
    }
  },
  setup(props, { root ,emit}) {
    const data = reactive({
      image:'',
      uploadKey: {
        token: "",
        key: ""
      }
    });
    const handleAvatarSuccess = (res, file) => {
      console.log(res);
      let img =  `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
      data.image = img;
      emit('updataImg',img)
    };
    const beforeAvatarUpload = file => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        root.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        root.$message.error("上传头像图片大小不能超过 2MB!");
      }
      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      data.uploadKey.key = key;
      return isJPG && isLt2M;
    };
    /**
     * 获取七牛云token
     */
    const getQiniuToKen = () => {
      let requestData = {
        accesskey: props.config.accesskey,
        secretkey: props.config.secretkey,
        buckety: props.config.buckety
      };
      QiniuToKen(requestData).then(res => {
        let result = res.data;
        if (result.resCode === 0) {
          data.uploadKey.token = result.data.token;
        }
      });
    };
    /**
     * 生命周期
     */
    onMounted(()=>{
      getQiniuToKen()
    })
      /**
       * 监听
       */
      watch(
        () => props.imgUrl,
        value => {
        
          data.image = value;
        }
      );
    return {
      data,
      handleAvatarSuccess,
      beforeAvatarUpload
    };
  }
};
</script>

<style lang="scss" scoped>
</style>