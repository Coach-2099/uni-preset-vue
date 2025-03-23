<template>
  <van-popup
    v-model:show="showBottom"
    position="bottom"
    round
    lock-scroll
    lazy-render
    :style="{ height: '90%', display: 'flex', flexDirection: 'column'}"
  >
    <div class="tipModule pt-15 px-15 pos-fixed w-100">
      <div class="tipBox flex justify-start items-center py-15 px-10">
        <image
          class="exMark"
          src="/static/images/exMarkGray.png"
          mode="scaleToFill"
        />
        <p class="ml-10">请确保充值时所选的链类型与提币时所选的链类型一致</p>
      </div>
    </div>
    <div class="netWorkList flex-1" style="overflow-y: auto;">
      <div v-for="index in 5" :key="index" class="px-15 my-10">
        <div>BTC</div>
        <div>
          <text class="fw-b fs-14">手续费:</text>
          <text class="text-gray fs-14 ml-5">0.000006</text>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
const showBottom = ref(false)

const  showFLoatingPanel = (type: string) => {
  showBottom.value = !showBottom.value
  // 判断类型是充值 或 提币
  if (type == 'recharge') return loadDataRecharge()
  if (type == 'withdraw') return loadDataWithdraw()
}

// 获取充值货币列表
const loadDataRecharge = async () => {

}

// 获取提币货币列表
const loadDataWithdraw = async () => {

  
}


// 将方法暴露给父组件
defineExpose({
  showFLoatingPanel
})

</script>

<style lang="scss" scoped>
.exMark {
  width: 18px;
  height: 16px;
}
.tipModule {
  z-index: 99;
  .tipBox {
    background: #F6F7FB;
    border-radius: 6px;
  }
}
.netWorkList {
  margin-top: 100px;
  height: calc(100% - 70px);
  overflow-y: auto;
  position: relative;
}
</style>