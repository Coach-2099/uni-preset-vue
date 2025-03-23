<template>
  <van-popup
    v-model:show="showBottom"
    position="bottom"
    round
    lock-scroll
    lazy-render
    :style="{ height: '90%', display: 'flex', flexDirection: 'column'}"
  >
    <div class="searchModule bg-white pt-15 pos-fixed w-100">
      <van-search v-model="value" placeholder="BTC/USDT" />
    </div>
    <div class="currencyList" style="flex: 1; overflow-y: auto;">
      <div v-for="index in 5" :key=index class="currencyBox flex justify-start items-center px-20 py-5 mt-5 mb-10">
        <image
          class="currencyImg"
          src="/static/images/OIP-C.jpg"
          mode="scaleToFill"
        ></image>
        <p class="fw-b fs-14 mx-5 text-black">BTC</p>
        <p class="fs-10 text-gray">Bitcoin</p>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getRecharge, getTrasferCoins, getWithdrawCoins } from '@/api/asset';


const value = ref('')
const showBottom = ref(false)

const  showFLoatingPanel = (type: string) => {
  showBottom.value = !showBottom.value
  // 判断类型是充值 或 提币
  if (type == 'recharge') return loadDataRecharge()
  if (type == 'withdraw') return loadDataWithdraw()
  if (type == 'transfer') return loadDataTransfer()
}


// 获取充值货币列表
const loadDataRecharge = async () => {
  const params = {}
  const data = await getRecharge(params)
}

// 获取提币货币列表
const loadDataWithdraw = async () => {
  const params = {}
  const data = await getWithdrawCoins(params)
}

const loadDataTransfer = async () => {
  const params = {
    accountType: '', //查询币种
  }
  const data = await getTrasferCoins(params)
}

// 将方法暴露给父组件
defineExpose({
  showFLoatingPanel
})

</script>

<style lang="scss" scoped>
.searchModule {
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  z-index: 99;
}
.currencyList {
  margin-top: 70px;
  height: calc(100% - 70px);
  overflow-y: auto;
  position: relative;
  .currencyBox {
    height: 35px;
    line-height: 35px;
    // border-bottom: 1px solid #f5f5f5;
  }
}
.currencyImg {
  width: 21px;
  height: 21px;
}
</style>