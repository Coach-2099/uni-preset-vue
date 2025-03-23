<template>
  <div class="transactionOrder-index">
    <navigationBar title="All Order"></navigationBar>
    <div class="">
      <van-tabs v-model:active="active" animated sticky shrink>
        <van-tab v-for="index in 4" :key="index" :title="'标签 ' + index">
          <div class="orderList px-20 pt-5 pb-25">
            <div class="orderBox mt-20 bg-white" v-for="index in 3" :key="index" @click="goDetail">
              <div class="header pb-10">
                <div class="top flex items-baseline">
                  <p class="fs-16 fw-b">BTC/ USDT</p>
                  <div class="orderTypeTemp ml-5 fs-10 text-red">sell</div>
                </div>
                <div class="bottom flex justify-between items-center">
                  <p class="fs-12 text-gray">2025-02-12  00:30:05</p>
                  <div class="rightTemp flex justify-between items-baseline">
                    <p class="fs-12 text-gray">52995904</p>
                    <div class="ml-5 copyImg">
                      <image
                        src="/static/images/copy.png"
                        mode="scaleToFill"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="content">
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>Order Type</p>
                  <p>TP/SL</p>
                </div>
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>Trigger Price</p>
                  <p>≥ 100,000.00</p>
                </div>
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>Order Price</p>
                  <p>100,000.00</p>
                </div>
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>Filled/Order Quantity</p>
                  <p>--/0.206018 BTC</p>
                </div>
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>Status</p>
                  <p>Canceled</p>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import navigationBar from '@/components/navigationBar/index.vue';

const goDetail = () => {
  uni.navigateTo({
    url: '/pages/transactionOrderDetail/index'
  })
}

</script>

<style lang="scss" scoped>
.transactionOrder-index {
  .orderList {
    height: 100%;
    background-color: #f6f8fc;
    .orderBox {
      box-shadow: 0px 0px 6px 1px rgba(0,8,242,0.08);
      border-radius: 16px;
      padding: 14px 20px;
      .header {
        border-bottom: 2px solid #f6f7fb;
        .top {
          .orderTypeTemp {
            height: 16px;
            line-height: 16px;
            padding-left: 2px;
            padding-right: 2px;
            background: #FFD3D9;
            border-radius: 3px 3px 3px 3px;
          }
        }
        .bottom {
          .rightTemp {
            .copyImg {
              image {
                width: 10px;
                height: 10px;
              }
            }
          }
        }
      }
      .content {

      }
    }
  }
}
</style>