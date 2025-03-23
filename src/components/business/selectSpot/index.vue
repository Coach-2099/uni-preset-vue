<template>
  <div class="seleceSpot-temp">
    <div class="mt-10 ml-15 mr-15 flex justify-between">
      <div class="flex-1 flex text-gray fs-12">
        <div class="flex justify-between items-center">
          <text>交易对</text>
          <image
            class="sortImg"
            src="/static/images/sort.png" 
            mode="scaleToFill"
          />
        </div>
        <text class="divLine">/</text>
        <div class="flex justify-between items-center">
          <text>交易量</text>
          <image
            class="sortImg"
            src="/static/images/sort.png"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="flex-1 flex justify-end text-gray fs-12">
        <div class="flex-1 flex justify-between items-center text-right mr-20 ">
          <text>Last Price</text>
          <image
            class="sortImg"
            src="/static/images/sort.png"
            mode="scaleToFill"
          />
        </div>
        <div class="flex-1 flex justify-between items-center text-right">
          <text>24H Change</text> 
          <!-- <image
            class="sortImg"
            src="/static/images/sort.png"
            mode="scaleToFill"
          /> -->
        </div>
      </div>
    </div>
    <div v-for="(item, index) in 20" :key="index">
      <div class="mt-5 ml-15 mr-15 pb-5 flex ff-biance fw-b justify-between items-center">
        <div class="flex-1">
          <text class="fs-16">BTC</text>
          <text class="fs-12 text-gray">/ USDT</text>
          <div>
            <text class="fs-12 text-gray">3.21B USDT</text>
          </div>
        </div>
        <div class="flex-1 flex justify-end items-center">
          <div class="flex-1 text-right items-center mr-20">95792.20</div>
          <van-button class="flex-1 text-right rises_falls_btn" style="width: 22.4vw;" type="success" size="small">
            <text class="fs-14">+0.22%</text>
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.seleceSpot-temp {
  height: 100%;
  .sortImg {
    width: 7px;
    height: 7px;
    margin-left: 3px;
  }
  .divLine {
    margin-left: 3px;
    margin-right: 3px ;
  }
}
</style>