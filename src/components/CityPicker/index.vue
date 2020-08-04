<template>
  <div class="overflow-h">
    <el-row :gutter="10">
      <el-col :span="6" v-if="init.province">
        <el-select v-model="data.provinceValue" placeholder="请选择" @change="handlerProvince">
          <el-option
            v-for="item in data.provinceData"
            :key="item.PROVINCE_CODE"
            :label="item.PROVINCE_NAME"
            :value="item.PROVINCE_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.city">
        <el-select v-model="data.cityValue" placeholder="请选择" @change="handlerCity">
          <el-option
            v-for="item in data.cityData"
            :key="item.CITY_CODE"
            :label="item.CITY_NAME"
            :value="item.CITY_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.area">
        <el-select v-model="data.areaValue" placeholder="请选择" @change="handlerArea">
          <el-option
            v-for="item in data.areaData"
            :key="item.AREA_CODE"
            :label="item.AREA_NAME"
            :value="item.AREA_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.street">
        <el-select v-model="data.streetValue" placeholder="请选择" @change="handlerstreet">
          <el-option
            v-for="item in data.streetData"
            :key="item.STREET_CODE"
            :label="item.STREET_NAME"
            :value="item.STREET_CODE"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GetCityPicker } from "@/api/common";
import { onBeforeMount, reactive, watch } from "@vue/composition-api";
import { cityPicker } from "@/mixins/cityPicker";
export default {
  name: "cityPicker",
  props: {
    cityPickerData: {
      type: Object,
      default: () => {}
    },
    cityPickerLevel: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    // 初始化省市区街联动
    const init = reactive({
      province: false,
      city: false,
      area: false,
      street: false
    });
    // 组件的数据和方法
    const {
      data,
      resultData,
      // 事件
      getProvince,
      handlerProvince,
      handlerCity,
      handlerArea,
      handlerstreet
    } = cityPicker();

    /**
     * 初始化
     */
    const initCityPicker = () => {
      let initData = props.cityPickerLevel;
      if (initData.length === 0) {
        for (const key in init) {
          init[key] = true;
        }
      } else {
        initData.forEach(item => (init[item] = true));
      }
    };

    watch(
      [
        () => resultData.provinceValue,
        () => resultData.cityValue,
        () => resultData.areaValue,
        () => resultData.streetValue
      ],
      ([province, city, area, street]) => {
        emit("updataCityPickerData", resultData);
      }
    );
 

    /**
     * 生命周期
     */
    onBeforeMount(() => {
      initCityPicker();
      getProvince();
    });

    return {
      init,
      data,
      getProvince,
      handlerProvince,
      handlerCity,
      handlerArea,
      handlerstreet
    };
  }
};
</script>

<style>
</style>