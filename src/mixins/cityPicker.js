import { GetCityPicker } from "@/api/common";
import { reactive, toRefs } from "@vue/composition-api";
export function cityPicker() {
  const data = reactive({
    provinceValue: "",
    cityValue: "",
    areaValue: "",
    streetValue: "",
    provinceData: [],
    cityData: [],
    areaData: [],
    streetData: []
  });
  const resultData = reactive({
    provinceValue: "",
    cityValue: "",
    areaValue: "",
    streetValue: "",
  })
  /**
   * 返回数据集合
   */
  const result = () => {
    for (let key in resultData) {
      resultData[key] = data[key];
    }
    console.log(resultData)
  }
  const getProvince = () => {
    getData({ type: "province" })
    // GetCityPicker({ type: "province" })
    //   .then(res => {
    //     let result = res.data;
    //     if (result.resCode === 0) {
    //       data.provinceData = result.data.data;
    //     }
    //   })
    //   .catch(err => { });
  };
  /**
      * 选择省份，获取城市
      */
  const handlerProvince = val => {


    resetValue({ type: 'city' })
    getData({
      type: "city",
      province_code: val
    })


  };
  const handlerCity = val => {
    resetValue({ type: 'area' })
    getData({
      type: "area",
      city_code: val
    })


  };

  /**
   * 选择区县，获取街道
   */
  const handlerArea = val => {
    resetValue({ type: 'street' })
    getData({
      type: "street",
      area_code: val
    })

  };
  const handlerstreet = () => {
    resetValue({ type: 'null' })
  }
  /**
   * 
   * 重置选项
   */
  const resetValue = (params) => {

    const valueJson = {
      city: ['cityValue', 'areaValue', 'streetValue'],
      area: ['areaValue', 'streetValue'],
      street: ['streetValue']
    }
    const resultData = valueJson[params.type];
    if (resultData) {
      resultData.forEach(item => {
        data[item] = "";
      })
    }

    result()
  }
  /**
   * 获取数据
   */
  const getData = (params) => {
    GetCityPicker(params)
      .then(res => {
        let result = res.data;
        if (result.resCode === 0) {
          data[params.type + 'Data'] = result.data.data;
        }
      })
      .catch(err => { });
  }

  return {
    // ...toRefs(data), //把对象类型转为基础数据类型，可进行结构响应
    data,
    resultData,
    getProvince,
    handlerProvince,
    handlerCity,
    handlerArea,
    handlerstreet
  }
}