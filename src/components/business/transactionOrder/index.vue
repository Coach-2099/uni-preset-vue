<template>
  <div class="transactionOrder-temp mt-20">
    <div class="orderTitle flex justify-between px-15">
      <div class="titleBox flex-1 flex justify-stretch">
        <div class="titleName half-width fs-12 text-gray">时间</div>
        <div class="titleName half-width fs-12 text-gray">方向</div>
      </div>
      <div class="titleBox flex-1 flex justify-between">
        <div class="titleName half-width fs-12 text-gray">价格</div>
        <div class="titleName half-width fs-12 text-gray text-right">数量</div>
      </div>
    </div>
    <div class="contentBox mt-20">
      <div v-for="index in 10" :key="index" class="orderContent mt-15 flex justify-between px-15">
        <div class="titleBox flex-1 flex justify-stretch">
          <div class="titleName text-black fs-12 half-width">17:36:56</div>
          <div class="titleName text-black fs-12 half-width">
            <text v-if="true" class="text-black fs-12 buy-green">买入</text>
            <text v-else class="text-black fs-12 sell-red">卖出</text>
          </div>
        </div>
        <div class="titleBox flex-1 flex justify-between">
          <div class="titleName text-black fs-12 half-width">858888</div>
          <div class="titleName text-black fs-12 half-width text-right">3.6639</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref()

</script>

<style lang="scss" scoped>
.transactionOrder-temp {
  .half-width {
    width: 45%;;
  }
  .orderTitle {

  }
  .orderContent {
    .buy-green {
      color: #18B86D;
    }
    .sell-red {
      color: #FF454E;
    }
  }
}
</style>