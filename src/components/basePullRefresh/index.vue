<template>
  <van-pull-refresh
    v-model="isLoading"
    :head-height="80"
    @refresh="onRefresh"
    style="min-height: 100vh;"
    >
    <!-- 下拉提示，通过 scale 实现一个缩放效果 -->
    <template #pulling="props">
      <img
        class="doge"
        src="@/static/images/logo.png"
        :style="{ transform: `scale(${props.distance / 80})` }"
      />
    </template>

    <!-- 释放提示 -->
    <template #loosing>
      <img
        class="doge"
        src="@/static/images/logo.png"
      />
    </template>

    <!-- 加载提示 -->
    <template #loading>
      <img
        class="doge"
        src="@/static/images/logo.png"
      />
    </template>
    <slot name="content"></slot>
  </van-pull-refresh>
</template>

<script>
export default {
  props: {
    headHeight: {
      type: Number,
      default: 80
    },
    value: {  // v-model 绑定的加载状态
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      count: 0    // 刷新次数统计
    };
  },
  computed: {
    isLoading: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);  // 同步 v-model
      }
    }
  },
  methods: {
    onRefresh() {
      console.log('this.isLoading', this.isLoading);
      this.isLoading = true;
      this.$emit('refresh', this.finishRefresh);  // 传递完成回调给父组件
    },
    finishRefresh(success = true) {
      this.isLoading = false;
      if (success) this.count++;  // 仅成功时计数
    }
  }
}
</script>

<style lang="scss" scoped>
.doge {
  width: 40px;
  height: 40px;
  margin: 10px auto;
  border-radius: 50%;
}
</style>

