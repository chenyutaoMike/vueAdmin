<template>
  <div>
    <el-table
      :data="data.tableData"
      border
      style="width: 100%"
      @selection-change="thatSelectCheckbox"
    >
      <!-- 多选框 -->
      <el-table-column type="selection" width="55" v-if="data.tableConfig.selection"></el-table-column>
      <template v-for="item in data.tableConfig.tHead">
        <!-- v-slot -->
        <el-table-column
          :key="item.field"
          v-if="item.columnType === 'slot'"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <!-- 文本渲染 -->
        <el-table-column
          v-else
          :prop="item.field"
          :label="item.label"
          :key="item.field"
          :width="item.width"
        ></el-table-column>
      </template>
      <!-- 文本数据渲染 -->
    </el-table>
    <div class="table-footer">
      <el-col :span="4">
        <slot name="tableFooterLeft"></slot>
      </el-col>
      <el-col :span="20">
        <el-pagination
          class="pull-right"
          v-if="data.tableConfig.paginationShow"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.currentPage"
          :page-sizes="pageData.pageSizes"
          :page-size="pageData.pageSize"
          :layout="data.tableConfig.paginationLayout"
          :total="pageData.total"
        ></el-pagination>
      </el-col>
    </div>
  </div>
</template>

<script>
import { reactive, onBeforeMount, watch } from "@vue/composition-api";
import { loadData } from "./tableLoadData";
import { recordPage } from "./recordPage";
import { paginationHook } from "./paginationHook";

export default {
  name: "tableVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    tableRow: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    // 加载数据
    const { tableData, tableLoadData } = loadData({ root });
    // 页码处理
    const {
      pageData,
      handleSizeChange,
      handleCurrentChange,
      setTotalCount
    } = paginationHook();
    const data = reactive({
      tableConfig: {
        selection: true,
        recordCheckBox: true,
        tHead: [],
        requestData: {},
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper"
      },
      tableData: []
    });
    /**
     * vue3.0 业务逻辑的拆分以及组合，还有复用性
     *
     */

    /**
     * methods
     */

    // 初始化table配置项
    const initTbaleCnfig = () => {
      let configData = props.config;
      let keys = Object.keys(data.tableConfig);
      for (const key in configData) {
        if (keys.includes(key)) {
          data.tableConfig[key] = configData[key];
        }
      }
    };
    /**
     * 勾选checkbox时触发
     */
    const thatSelectCheckbox = val => {
      console.log(val.map(item => item.id));
      // id,rowData
      let rowData = {
        idItem: val.map(item => item.id)
      };
      // props.tableRow = rowData;
      emit("update:tableRow", rowData);
      root.$nextTick(() => {
        console.log(props.tableRow);
      });
    };
    /**
     * 刷新数据
     */
    const reffesData = () => {
      tableLoadData(data.tableConfig.requestData);
    };
    /**
     * 带参数刷新数据
     */
    const paramsLoadData = params => {
      let request = JSON.parse(JSON.stringify(data.tableConfig.requestData));
      request.data = {
        ...request.data,
        ...params
      };
      tableLoadData(request);
    };
    /**
     * watch
     *
     */
    // 数据渲染
    watch(
      [() => tableData.item, () => tableData.total],
      ([tableData, totalCount]) => {
        data.tableData = tableData;
        setTotalCount(totalCount);
      }
    );
    // 页码监听
    watch(
      [() => pageData.currentPage, () => pageData.pageSize],
      ([currentPage, pageSize]) => {
        let requestData = data.tableConfig.requestData;
        if (requestData.data) {
          //如果data.tableConfig.requestData里面有data，那么就赋值
          requestData.data.pageNumber = currentPage;
          requestData.data.pageSize = pageSize;
          // 修改值完毕后，重新调用请求接口
          tableLoadData(requestData);
        }
      }
    );

    /**
     * 生命周期
     */
    onBeforeMount(() => {
      initTbaleCnfig();
      tableLoadData(data.tableConfig.requestData);
    });
    return {
      data,
      pageData,
      handleSizeChange,
      handleCurrentChange,
      thatSelectCheckbox,
      reffesData,
      paramsLoadData
    };
  }
};
</script>

<style lang="scss" scoped>
.table-footer {
  padding: 15px 0;
}
</style>