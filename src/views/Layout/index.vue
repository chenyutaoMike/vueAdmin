<template>
  <div class="layout">
    <LayoutNav />
    <LayoutHeader />
    <LayoutMain />
  </div>
</template>

<script>
import LayoutNav from "./Components/Nav";
import LayoutHeader from "./Components/Header";
import LayoutMain from "./Components/Main";
export default {
  name: "layout",
  components: {
    LayoutNav,
    LayoutHeader,
    LayoutMain
  },
  setup() {}
};
</script>

<style lang="scss" scoped>
.layout{
  background-color: #f4f4f4;
}
</style>