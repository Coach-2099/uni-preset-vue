<template>
  <van-popup
    v-model:show="showBottom"
    position="bottom"
    round
    lock-scroll
    lazy-render
    :style="{ height: '35%', display: 'flex', flexDirection: 'column'}"
  >
    <div class="tipModule pt-15 px-15 pos-fixed w-100">
      <p class="fw-b fs-16">{{$t('withdrawal.contractAddress')}}：</p>
      <div class="tipBox flex justify-start items-center mt-20 py-15 px-10">
        <div class="imgBox w-20">
          <image
            class="exMark"
            src="/static/images/exMarkGray.png"
            mode="scaleToFill"
          />
        </div>
        <p class="fs-12 text-gray ml-10">{{$t('withdrawal.contractAddressWarning')}}</p>
      </div>
      <div class="contentBox flex justify-between items-center mt-10 px-10 py-20">
        <p class="w-75 fw-b fs-14">adfadsfadsfa12sdfqegs12gsdfgsd1222222222fgs</p>
        <image src="@/static/images/copy.png"></image>
      </div>
    </div>
  </van-popup>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const showBottom = ref(false)

const showFLoatingPanel = () => {
  showBottom.value = !showBottom.value
}

defineExpose({
  showFLoatingPanel
})

</script>
<style lang="scss" scoped>
.imgBox {
  .exMark {
    width: 18px;
    height: 16px;
  }
}
.tipModule {
  z-index: 99;
  .tipBox {
    background: #fef3df;
    border-radius: 6px;
  }
  .contentBox {
    border-radius: 6px;
    background: #f3f4f8;
    p {
      white-space: pre-wrap;
      word-break: break-all;
    }
    image {
      width: 16px;
      height: 16px;
    }
  }
}
</style>