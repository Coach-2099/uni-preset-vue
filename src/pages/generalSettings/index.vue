<template>
  <div class="generalSettings-index">
     <navigationBar title="通用设置"></navigationBar>
     <div class="reviseInfo mt-5 pl-20 pr-20 bg-white">
      <div class="pt-20 flex justify-between">
        <div class="">
          <text class="text-black fs-16">头像</text>
        </div>
        <div>
          <text class="fs-12 text-gray mr-5">尚未认证</text>
          <image
            class="rightIcon"
            src="/static/svg/tools/right.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="pt-20 flex justify-between">
        <div class="">
          <text class="text-black fs-16">昵称</text>
        </div>
        <div>
          <image
            class="rightIcon"
            src="/static/svg/tools/right.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="pt-20 flex justify-between">
        <div class="">
          <text class="text-black fs-16">UID</text>
        </div>
        <div>
          <text class="fs-12 text-gray mr-5">123456789</text>
          <image
            class="rightIcon"
            src="/static/svg/tools/copy.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
     </div>
  </div>
</template>

<script lang="ts" setup>
import navigationBar from '@/components/navigationBar/index.vue'

</script>

<style lang="scss" scoped>
.generalSettings-index {
  height: 100%;
  .reviseInfo {
    .rightIcon {
      width: 8px;
      height: 8px;
    }
  }
}
</style>