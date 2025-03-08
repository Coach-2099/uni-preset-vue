<template>
  <div class="AssetRecord-index">
    <navigationBar title="资产记录"></navigationBar>
    <div class="mt-20 pl-5 pr-10">
      <van-tabs
        title-active-color="#333333"
        title-inactive-color="#B0B0B0"
        v-model:active="active" 
        shrink
      >
        <van-tab title="Deposit">
          <div class="assetList mt-15">
            <div 
              v-for="index in 5" 
              :key="index" 
              class="assetSingle mt-15 flex justify-between items-center"
              @click="goAssetDetail"
            >
              <div>
                <p class="fs-16 text-black">USDT</p>
                <p class="fs--12 text-gray">2025-02-23  11:43:05</p>
              </div>
              <div class="flex justify-between items-center">
                <div class="mr-10">
                  <p class="fs-16 text-black text-right">999,999</p>
                  <div class="flex items-center">
                    <div class="dot mr-5"></div>
                    <p class="fs-12 text-gray">Succeeded</p>
                  </div>
                </div>
                <div class="rightIcon"></div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="Withdraw">
          Deposit
        </van-tab>
        <van-tab title="Transfer">
          Deposit
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'

const active = ref(0);

const goAssetDetail = () => {
  uni.navigateTo({
    url: '/pages/assetDetail/index'
  })
};

</script>

<style lang="scss" scoped>
.AssetRecord-index {
  .assetSingle {
    padding-left: 18px;
    padding-right: 18px;
  }

  .dot {
    width: 3px;
    height: 3px;
    background: #00B200;
  }

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
    border: solid #333;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -50%) rotate(-45deg);
    position: absolute;
    left: 50%;
    top: 70%;
  }
}
</style>