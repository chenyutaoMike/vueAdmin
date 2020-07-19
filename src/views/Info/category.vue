<template>
  <div id="category">
    <el-button type="danger" @click="addFirst({type:'category_first_add'})">添加一级分类</el-button>
    <div class="hr-e9e9e9"></div>
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <div class="category" v-for="firstitem in category.item" :key="firstitem.id">
              <!-- 一级分类 -->
              <h4>
                <svg-icon icon-class="minus"></svg-icon>
                {{firstitem.category_name}}
                <div class="button-group">
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    @click="editCategory({data:firstitem,type:'category_first_edit'})"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="success"
                    round
                    @click="handlerAddChildren({data:firstitem,type:'category_children_add'})"
                  >添加子级</el-button>
                  <el-button size="mini" round @click="deleteCategoryConfirm(firstitem.id)">删除</el-button>
                </div>
              </h4>
              <!-- 子级分类 -->
              <ul v-if="firstitem.children">
                <li v-for="childrenItem in firstitem.children" :key="childrenItem.id">
                  {{childrenItem.category_name}}
                  <div class="button-group">
                    <el-button
                      size="mini"
                      type="danger"
                      round
                      @click="handlerChildrenCategory({data:firstitem,children:childrenItem,type:'category_children_edit'})"
                    >编辑</el-button>
                    <el-button size="mini" round @click="deleteCategoryConfirm(childrenItem.id)">删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">一级分类名称</h4>
          <el-form label-width="142px" class="form-width" ref="categoryForm">
            <el-form-item label="一级分类名称" v-if="category_first_input">
              <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称" v-if="category_children_input">
              <el-input v-model="form.secCategoryName" :disabled="category_children_disabled"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="submit"
                :loading="submit_loading"
                :disabled="submit_button_disabled"
              >确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import {
  AddFirstCategory,
  DeleteCategory,
  EditCategory,
  AddChildrenCategory
} from "@/api/news";
import { global } from "@/utils/global_v3.0.js";
import { common } from "@/api/common";
export default {
  name: "infoCategory",
  setup(props, { root, refs }) {
    //global
    const { confirm } = global();
    const { getInfoCategory, categoryItem, getInfoCategoryAll } = common();

    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    const category = reactive({
      item: [],
      current: []
    });
    const category_first_input = ref(true);
    const category_children_input = ref(true);
    const submit_loading = ref(false);
    const category_first_disabled = ref(true);
    const category_children_disabled = ref(true);
    const submit_button_disabled = ref(true);
    const deleteId = ref("");
    const submit_button_type = ref(""); //按钮的状态

    /**
     * methods
     */
    const submit = () => {
      if (submit_button_type.value === "category_first_add") {
        addFirstCategory();
      }
      if (submit_button_type.value === "category_first_edit") {
        editFirstCategory();
      }
      if (submit_button_type.value === "category_children_add") {
        addChildrenCategory();
      }
      if (submit_button_type.value === "category_children_edit") {
        editChildrenCategory();
      }
    };
    const addFirstCategory = () => {
      if (!form.categoryName) {
        root.$message({
          message: "分类名称不能为空",
          type: "error"
        });
        return;
      }
      const categoryName = form.categoryName;
      // 按钮加载状态
      submit_loading.value = true;
      AddFirstCategory({ categoryName })
        .then(res => {
          const result = res.data;
          if (result.resCode === 0) {
            root.$message({
              message: result.message,
              type: "success"
            });
            category.item.push(result.data); //把返回的商品信息添加到数组
            submit_loading.value = false; //成功之后恢复按钮
            // refs['categoryForm'].resetFields(); //清空表单
            form.categoryName = ""; //清空表单
            form.secCategoryName = ""; //清空表单
          }
        })
        .catch(err => {
          submit_loading.value = false; //失败之后恢复按钮
          form.categoryName = ""; //清空表单
          form.secCategoryName = ""; //清空表单
        });
    };

    const addFirst = params => {
      submit_button_type.value = params.type;
      category_first_input.value = true;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
    };

    //删除
    const deleteCategoryConfirm = id => {
      deleteId.value = id;

      confirm({
        content: "确定要删除此分类吗？",
        tip: "警告",
        fn: deleteCategory,
        catchFn: () => {
          deleteId.value = ""; //点击了取消，删除存储的值
        }
      });
    };
    // 修改一级分类名称
    const editCategory = params => {
      submit_button_type.value = params.type;
      category_first_input.value = true;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      // 文本框显示一级分类名称
      form.categoryName = params.data.category_name;
      // 存储当前数据对象
      category.current = params.data;
    };
    const editFirstCategory = () => {
      if (category.current.length === 0) {
        root.$message({
          message: "未选择分类！！！",
          type: "error"
        });
        return;
      }
      const requestData = {
        id: category.current.id,
        categoryName: form.categoryName
      };
      if (requestData.categoryName === "") {
        root.$message({
          message: "请输入分类名称",
          type: "error"
        });
        return;
      }
      submit_loading.value = true;
      EditCategory(requestData)
        .then(res => {
          submit_loading.value = false;

          const result = res.data;
          if (result.resCode === 0) {
            // 修改数据
            // 因为category.current拿到的是category.item的引用地址，所以可以直接修改
            category.current.category_name = result.data.data.categoryName;
            form.categoryName = ""; //清空表单
            category.current = []; //清除缓存数据
            root.$message({
              message: result.message,
              type: "success"
            });
          }
        })
        .catch(err => {
          submit_loading.value = false;
        });
    };
    // 删除接口
    const deleteCategory = () => {
      const id = deleteId.value;
      DeleteCategory({ categoryId: id })
        .then(res => {
          const result = res.data;
          if (result.resCode === 0) {
            root.$message({
              message: result.message,
              type: "success"
            });
            getInfoCategoryAll();
           
          }
        })
        .catch(err => {
          

          root.$message({
            message: "删除失败",
            type: "error"
          });
        });
    };
    /**
     * 添加子级
     */
    const handlerAddChildren = params => {
      // 存储数据
      category.current = params.data;
      // 更新确定按钮类型
      submit_button_type.value = params.type;
      // 禁用一级输入框
      category_first_disabled.value = true;
      // 启用子级输入框
      category_children_disabled.value = false;
      // 启用确定按钮
      submit_button_disabled.value = false;
      // 显示子级输入框
      category_children_input.value = true;
      // 显示一级分类文本
      form.categoryName = params.data.category_name;
    };
    /**
     * 添加子级分类
     */
    const addChildrenCategory = () => {
      // categoryName：分类名称*
      // parentId：父级ID*
      if (!form.secCategoryName) {
        root.$message({
          message: "请输入子级分类名称",
          type: "error"
        });
        return;
      }
      let requestData = {
        categoryName: form.secCategoryName,
        parentId: category.current.id
      };

      AddChildrenCategory(requestData).then(res => {
        console.log(res);
        let result = res.data;
        if (result.resCode === 0) {
          root.$message({
            message: result.message,
            type: "success"
          });
          // 调用分类列表接口
          getInfoCategoryAll();
          //  清空输入框
          form.secCategoryName = "";
        }
      });
    };
    /**
     * 编辑子级分类
     */
    const handlerChildrenCategory = params => {
      category.current = params.children;
      // 更新确定按钮类型
      submit_button_type.value = params.type;
      form.categoryName = params.data.category_name;
      form.secCategoryName = params.children.category_name;
      // 禁用一级输入框
      category_first_disabled.value = true;
      // 启用子级输入框
      category_children_disabled.value = false;
      // 启用确定按钮
      submit_button_disabled.value = false;
      // 显示子级输入框
      category_children_input.value = true;
    };
    /**
     * 提交编辑子级分类
     */
    const editChildrenCategory = () => {
      let requestData = {
        id: category.current.id,
        categoryName: form.secCategoryName
      };

      EditCategory(requestData).then(res => {
        let result = res.data;
        if (result.resCode === 0) {
          console.log("result", result);
          form.secCategoryName = ""; //清空表单
          category.current.category_name = result.data.data.categoryName;
          category.current = []; //清除缓存数据
          root.$message({
            message: result.message,
            type: "success"
          });
        }
      });
    };
    /**
     * 删除子级分类
     */
    const deleteChildrenCategoryConfirm = () => {
      deleteId.value = id;
      confirm({
        content: "确定要删除此分类吗？",
        tip: "警告",
        fn: deleteCategory,
        catchFn: () => {
          deleteId.value = ""; //点击了取消，删除存储的值
        }
      });
    };
    /**
     * 生命周期函数
     */
    onMounted(() => {
      getInfoCategoryAll();
    });
    /**
     * watch
     */
    watch(
      //监听category.item的变化
      () => categoryItem.item,
      value => {
        category.item = value;
      }
    );
    return {
      form,
      category_first_input,
      category_children_input,
      submit_loading,
      category_first_disabled,
      category_children_disabled,
      submit_button_disabled,
      category,
      submit,
      addFirst,
      deleteCategoryConfirm,
      editCategory,
      handlerAddChildren,
      handlerChildrenCategory,
      deleteChildrenCategoryConfirm
    };
  }
};
</script>

<style lang="scss" scoped>
.category-wrap {
  div:first-child {
    &::before {
      top: 20px;
    }
  }
  div:last-child {
    &::before {
      bottom: 20px;
    }
  }
}
.menu-title {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
.category {
  line-height: 44px;
  position: relative;
  cursor: pointer;
  &:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    width: 32px;
    border-left: 1px dashed #000;
  }
  h4 {
    padding-left: 44px;
    position: relative;
  }
  svg {
    position: absolute;
    left: 14px;
    top: 14px;
    background-color: #fff;
    font-size: 17px;
  }
  li {
    position: relative;
    padding-left: 36px;
    margin-left: 24px;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 22px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    transition: all 3s ease 0;
    &:hover {
      background-color: #f3f3f3 !important;
      .button-group {
        display: block;
      }
    }
  }
}
.button-group {
  display: none;
  position: absolute;
  z-index: 2;
  right: 11px;
  font-size: 12px;
  top: -1px;
}
.form-width {
  width: 410px;
  margin-top: 25px;
}
div.el-form-item {
  margin-bottom: 22px;
}
.hr-e9e9e9 {
  width: calc(100%+60px);
  margin: 30px -30px;
  border: none;
  border-bottom: 1px solid #e9e9e9;
}
</style>