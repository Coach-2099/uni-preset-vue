<template>
  <div class="navigationBar-index">
    <van-sticky>
      <div class="flex justify-between items-center pl-15 pr-15 headerTemp pos-relative">
        <div @click="goUser" class="flex items-center back-arrow">
          <image
            src="/static/svg/tools/left.svg"
            mode="scaleToFill"
          />
        </div>
        <div class="fw-b fs-22 text-black pos-absolute headerTitle">
          {{ title }}
        </div>
        <div class="rightTemp flex justify-between">
          <slot name="right"></slot>
        </div>
      </div>
    </van-sticky>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
// 在组件script中添加
defineSlots<{
  right?: (props: {}) => any  // 定义插槽类型
}>()

const props = defineProps({
  title: {
    type: String,
    default: 'Security Settings'
  },
  // 自定义返回处理函数
  customHandler: {
    type: Function,
    default: null
  },
  // 或直接传跳转路径
  backUrl: {
    type: String,
    default: ''
  }
})

const goUser = () => {
  if (props.customHandler) {
    // 优先使用自定义处理函数
    return props.customHandler()
  }
  
  if (props.backUrl) {
    // 使用自定义路径跳转
    uni.navigateTo({
      url: props.backUrl
    })
    return
  }

  // 默认返回上一页
  uni.navigateBack({
    delta: 1
  })
}

</script>

<style lang="scss">
.navigationBar-index {
  .headerTemp {
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    .back-arrow {
      image {
        width: 16px;
        height: 14px;
      }
    }
    .headerTitle {
      left: 50%;
      transform: translate(-50%);
      max-width: 60vw;
    }
    .rightTemp {
      // min-width: 80px;
    }
  }
}
</style>