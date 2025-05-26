<template>
  <div class="navigationBar-index">
    <div style="height: var(--status-bar-height)"></div>
    <van-sticky>
      <div class="flex justify-between items-center pl-15 pr-15 headerTemp pos-relative">
        <div @click="goUser" class="flex items-center back-arrow">
          <!-- <image
            src="/static/svg/tools/left.svg"
            mode="scaleToFill"
          /> -->
          <svg style="width: 16px;height: 14px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14.31">
            <defs>
              <clipPath id="a">
                <path d="M0 0h16v14.31H0z" style="fill:none"/>
              </clipPath>
              <!-- <style>
                .a{fill:#b0b0b0}
              </style> -->
            </defs>
            <g style="clip-path:url(#a)" transform="rotate(180 8 7.155)">
              <path style="fill:var(--color-text)" d="M14.6 8.134H.917a.982.982 0 0 1 0-1.96H14.6a.982.982 0 0 1 0 1.96"/>
              <path style="fill:var(--color-text)" d="M9.816 14.31a.885.885 0 0 1-.649-.287 1.029 1.029 0 0 1 0-1.386l4.906-5.244a.353.353 0 0 0 0-.475L9.168 1.673a1.029 1.029 0 0 1 0-1.386.876.876 0 0 1 1.3 0l4.906 5.244a2.411 2.411 0 0 1 0 3.249l-4.906 5.243a.885.885 0 0 1-.649.287"/>
            </g>
          </svg>
        </div>
        <div class="fw-b fs-20 text-black pos-absolute headerTitle">
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

  // 默认返回逻辑
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack({
      delta: 1
    })
  } else {
    // 无上一页时跳转首页
    uni.reLaunch({
      url: '/pages/home/index'
    })
  }
}

</script>

<style lang="scss">
.navigationBar-index {
  .headerTemp {
    height: 50px;
    line-height: 50px;
    background: var(--color-background);
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
      color: var(--color-text);
    }
    .rightTemp {
      // min-width: 80px;
    }
  }
}
</style>