<template>
  <el-select v-model="data.selectValue" @change="select">
    <el-option
      v-for="item in data.initOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import { reactive, onMounted } from "@vue/composition-api";

export default {
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    selectData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const data = reactive({
      selectValue: "",
      initOptions: [],
      option: [
        { value: "name", label: "姓名" },
        { value: "email", label: "邮箱" },
        { value: "phone", label: "手机号" },
        { value: "truename", label: "姓名" }
      ]
    });
    /**
     * 初始化下拉选择
     */
    let initOption = () => {
      let initData = props.config.init;
      let optionArr = [];
      // 数据校验
      if (initData.length === 0) {
        return;
      }

      initData.forEach(item => {
        let arr = data.option.filter(elem => elem.value === item);
        if (arr.length > 0) {
          optionArr.push(arr[0]);
        }
      });

      data.initOptions = optionArr;
      // 数据校验
      if (optionArr.length === 0) {
        return;
      }
      //  初始化搜索类型
      // data.selectValue = optionArr[0].value;
    };
    /**
     * 选择触发
     */
    const select = val => {
      let resultData = data.option.filter(item => item.value === val)[0];
      emit("update:selectData", resultData);
    };

    onMounted(() => {
      initOption();
    });

    return {
      data,
      select
    };
  }
};
</script>

<style>
</style>
 <!-- 
 组件目录位置： src > components > Select > index.vue
 组件引用方式     import SelectVue from '@/components/Select'
 template  <SelectVue :config="data.configOption" />
    -->