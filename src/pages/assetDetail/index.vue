<template>
  <div class="assetDetail-index">
    <navigationBar title="资产详情"></navigationBar>
    <div class="bg-white pt-25 pb-25">
      <div class="text-center">
        <p class="fs-14 text-gray">Quantity</p>
        <p class="fs-24 mt-20 fw-b text-black">$999,999-USDT</p>
        <div class="successTemp mt-20 w-100 flex justify-center items-center">
          <image
            class="successIcon"
            src="/static/images/success.png"
            mode="scaleToFill"
          />
          <p class="text-green">Succeeded</p>
        </div>
      </div>
    </div>
    <div class="mt-5 pt-20 bg-white contentBox fs-14">
      <div class="flex justify-between items-center">
        <p class="text-gray">Deposit Account</p>
        <P class="text-black">Unified Trading Account</P>
      </div>
      <div class="flex justify-between items-center mt-25">
        <p class="text-gray">Chain Type</p>
        <p class="text-black">6 confirmations</P>
      </div>
      <div class="flex justify-between items-center mt-25">
        <p class="text-gray">Time</p>
        <p class="text-black">64 confirmations</P>
      </div>
      <div class="flex justify-between items-baseline mt-25">
        <p class="text-gray">Deposit Address</p>
        <div class="flex justify-end items-baseline">
          <p class="text-black text-right text-wrap copyText">
            {{ AddressAddressVal }}
          </P>
          <image
            @click="copyText(AddressAddressVal)"
            class="copyIcon ml-5"
            src="/static/images/copy.png"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="flex justify-between items-baseline mt-25">
        <p class="text-gray ">Transaction Hash</p>
        <div class="flex justify-end items-baseline">
          <p class="text-black text-right text-wrap copyText">
            {{ HashVal }}
          </P>
          <image
            @click="copyText(HashVal)"
            class="copyIcon ml-5"
            src="/static/images/copy.png"
            mode="scaleToFill"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'

const AddressAddressVal = ref('TCkPH6qgSRPNZZrfuvAoW2rZ8K10wLmNcB');
const HashVal = ref('be2dca069689d766e860012f18602d0d909002c42cb331ff7da4ebb58b5fcc02');

const copyText = (value:string) => {
  uni.setClipboardData({
    data: value,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'none'
      })
    }
  })
}

</script>

<style lang="scss">
.assetDetail-index {
  background: #F6F7FB;
  .successTemp {
    .successIcon {
      width: 8.54px;
      height: 8.54px;
    }
  }
  .contentBox {
    padding-left: 18px;
    padding-right: 18px;
  }
  .copyIcon {
    width: 16px;
    height: 16px;
  }
  .copyText {
    width: 200px;
  }
}
</style>