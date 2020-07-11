<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
export default {
  name: "myIcon",
  props: {
    className: {
      type: String,
      default: ""
    },
    iconClass: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    // 计算属性，得出最终结果并返回
    const iconName = computed(() => `#icon-${props.iconClass}`);
    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${props.className}`;
      } else {
        return `svg-icon`;
      }
    });

    /**
     * computed
     */

    return {
      iconName,
      svgClass
    };
  }
};
</script>

<style lang="scss" scoped>
.svg-icon{
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>