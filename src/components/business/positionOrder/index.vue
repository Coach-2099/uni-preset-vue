<template>
  <div class="position-temp">
    <div v-for="index in 5" :key="index" class="box pb-15">
      <div class="positionData flex justify-between mt-20">
        <div class="leftBox flex justify-between">
          <div class="">
            <p class="fw-b fs-16 text-black">BTCUSDT</p>
            <p class="fs-12 text-black mt-5">全仓10.00X</p>
          </div>
          <div class="core ml-15">
            <text class="fs-12 text-light-green">多仓</text>
          </div>
        </div>
        <div class="rightBox">
          <p class="fs-12 text-gray text-right">未结盈亏</p>
          <p class="fw-b fs-16 text-red mt-5">-126.68(-1.59%)</p>
        </div>
      </div>
      <div class="positionDetail mt-20">
        <div class="flex justify-between">
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">持仓数量</p>
            <p class="fs-12 text-balck mt-5">17:36:05</p>
          </div>
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">入场价格</p>
            <p class="fs-12 text-balck mt-5">85,888.88</p>
          </div>
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">标记价格</p>
            <p class="fs-12 text-black mt-5">85,888.88</p>
          </div>
          <div class="detailBox w-25">
            <p class="fs-12 text-gray text-right">预计强平价格</p>
            <p class="fs-12 text-right text-light-blue mt-5">85,888.88</p>
          </div>
        </div>
        <div class="btnBox flex justify-between mt-15">
          <van-button class="myBtn flex-1" type="default">
            <text class="fs-12 text-gray">设置止盈止损</text>
          </van-button>
          <!-- <van-button class="myBtn flex-1" type="default">
            <text class="fs-12 text-gray">追踪出场</text>
          </van-button> -->
          <van-button class="myBtn flex-1" type="default">
            <text class="fs-12 text-gray">平仓</text>
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.position-temp {
  padding: 0 8px;
  padding-bottom: 90px;
  .box {
    border-bottom: 2px solid #f9fafc;
    .positionData {
      .leftBox {
        .core {
          background: #E0F5EC;
          border-radius: 3px 3px 3px 3px;
          opacity: 0.35;
          padding: 3px 7px;
          height: 27px;
          line-height: 22px;
        }
      }
      .rightBox {}
    }
    .positionDetail {
      .btnBox {
        gap: 8px;
        .myBtn {
          height: 28px;
          border-radius: 6px;
          background: #F6F7FB;
        }
      }
    }
  }
}
</style>