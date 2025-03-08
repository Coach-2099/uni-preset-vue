<template>
  <div class="currencyDetails-index">
    <navigationBar title="详情"></navigationBar>
    <div class="assetsInfo">
      <p class="fs-14 text-gray">现货余额</p>
      <p class="mt-15">
        <span class="fs-32 fw-b text-black mr-10">0.00</span>
        <span class="fs-14 text-black">USD</span>
      </p>
      <div class="flex justify-between items-end mt-25 pb-25">
        <div class="flex-1">
          <p class="text-gray fs-14">可用资产</p>
          <p class="mt-10 text-black fs-14">{{ '<' + 5000 }}</p>
        </div>
        <div class="flex-1 text-left">
          <p class="text-gray fs-14">不可用</p>
          <p class="mt-10 text-black fs-14">0</p>
        </div>
      </div>
    </div>
    <div class="mt-5 px-20 bg-white tradeInfo">
      <div class="flex justify-between items-center pt-25 fs-16 text-black">
        <p>交易</p>
        <div class="rightIcon"></div>
      </div>
      <div class="tradeBox mt-20 flex justify-between">
        <div v-for="index in 3" :key="index" class="isBox">
          <p>
            <text class="fs-16 fw-b text-black">BTC</text>
            <text class="fs-12 text-gray">/USDT</text>
          </p>
          <p class="fs-16 text-black">0.4150</p>
          <p class="fs-12 text-red">-8.90%</p>
        </div>
      </div>
    </div>
    <div class="pt-10 px-20 bg-white history">
      <div class="flex justify-between items-center pt-25 fs-16 text-black">
        <p>交易</p>
        <div class="rightIcon"></div>
      </div>
      <div v-for="index in 3" :key="index" class="historyList pb-10 pt-20">
        <div class="flex justify-between items-center">
          <p class="fs-16 text-black">转账</p>
          <p class="fs-16 text-red">-999.0</p>
        </div>
        <p class="mt-5 fs-12 text-gray">U本位合同</p>
        <p class="fs-12 text-gray">2025-02-23  11:43:05</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import navigationBar from '@/components/navigationBar/index.vue'

</script>

<style lang="scss" scoped>
.currencyDetails-index {
  background: #F6F8FC;
  .assetsInfo {
    padding-top: 42px;
    padding-left: 22px;
    padding-right: 18px;
    background-color: #ffffff;
    .deposit-btn {
      width: 84px;
      height: 28px;
    }
  }
  .tradeInfo, .history {
    .rightIcon {
      position: relative;
      width: 5px;
      height: 10px;
      cursor: pointer;
    }
    .rightIcon:before {
      content: "";
      width: 6px;
      height: 6px;
      border: solid #B0B0B0;
      border-width: 0 2px 2px 0;
      transform: translate(-50%, -50%) rotate(-45deg);
      position: absolute;
      left: 50%;
      top: 70%;
    }
  }
  .tradeBox {
    gap: 10;
    .isBox {
      width: 31%;
      padding: 7px 11px;
      box-shadow: 0px 0px 6px 1px rgba(0,8,242,0.08);
      border-radius: 8px 8px 8px 8px;
    }
  }
  .history {
    
    .historyList {
      border-bottom: 1px solid #f8f9fc;
    }
  }
}
</style>