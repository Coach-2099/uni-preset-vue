<template>
  <div class="transactionOrderDetail-index">
    <navigationBar title=""></navigationBar>
    <div class="DetailTemp px-20 py-20 bg-white">
      <p class="fs-16 fw-b">Details</p>
      <div class="header mt-25 flex items-baseline">
        <p class="fs-16 text-black">BTC/ USDT</p>
        <div class="typeTemp fs-10 text-gray ml-5">Canceled</div>
      </div>
      <div class="content mt-25">
        <div class="flex fs-12 text-gray justify-between items-center">
          <p>Order Type/Direction</p>
          <p>TP/SL-Limit/Sell</p>
        </div>

        <div class="flex mt-15 fs-12 text-gray justify-between items-center">
          <p>Trigger Price</p>
          <p>≥ 100,000.00</p>
        </div>

        <div class="flex mt-15 fs-12 text-gray justify-between items-center">
          <p>Order Price</p>
          <p>100,000.00</p>
        </div>

        <div class="flex mt-15 fs-12 text-gray justify-between items-center">
          <p>Order Quantity</p>
          <p>0.206018 BTC</p>
        </div>
        <div class="flex mt-15 fs-12 text-gray justify-between items-center">
          <p>Order Value</p>
          <p>20601.80000000 USDT</p>
        </div>

        <div class="flex mt-15 fs-12 text-gray justify-between items-center">
          <p>Time Created</p>
          <p>2025-02-12  00:30:05</p>
        </div>

        <div class="flex mt-15 fs-12 text-gray justify-between items-center">
          <p>End Time</p>
          <p>2025-02-12  00:30:05</p>
        </div>

        <div class="flex mt-15 fs-12 text-gray justify-between items-center">
          <p>Order ID</p>
          <div class="flex items-baseline">
            <p>52995904</p>
            <div class="copyImg ml-5">
              <image
                src="/static/images/copy.png"
                mode="scaleToFill"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="triggerOrderTemp px-20">
      <div class="fs-16 fw-b">Trigger Order Details</div>
      <div class="mt-25">
        <dataDefaultt></dataDefaultt>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import navigationBar from '@/components/navigationBar/index.vue';
import dataDefaultt from '@/components/dataDefault/index.vue'

</script>

<style lang="scss" scoped>
.transactionOrderDetail-index {
  .DetailTemp {
    .typeTemp {
      height: 16px;
      line-height: 16px;
      padding-left: 2px;
      padding-right: 2px;
      background: #F6F8FC;
      border-radius: 3px 3px 3px 3px;
    }
    .content {
      .copyImg {
        image {
          width: 10px;
          height: 10px;
        }
      }
    }
  }
  .triggerOrderTemp {
    margin-top: 75px;
  }
}
</style>