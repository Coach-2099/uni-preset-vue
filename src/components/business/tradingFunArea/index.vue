<template>
  <div class="transactionModule-index">
    <div class="mt-20 flex justify-between items-center">
      <div class="flex">
        <div class="flex checckBitBtn mr-5">
          <div class="checckBitImgBox mr-5">
            <image
              src="/static/images/checkBit.png"
              mode="scaleToFill"
            />
          </div>
          <div>BTC/USDT</div>
        </div>
        <div class="increaseAndDecreaseBox">
          <text class="text-red fs-12">-3.37%</text>
        </div>
      </div>
      <div class="toolsBtn">
        <image
          src="/static/images/tools.png"
          mode="scaleToFill"
        />
      </div>
    </div>
    <div class="mt-15 buyAndSellBox flex justify-between items-stretch">
      <div class="buyAndSellMoudle flex-1">
        <!-- <buyAndSell></buyAndSell> -->
        <buyAndSellContract></buyAndSellContract>
      </div>
      <div class="flex-1">
        <priceFluctuations></priceFluctuations>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import buyAndSell from '@/components/business/buyAndSell/index.vue';
import priceFluctuations from '@/components/business/priceFluctuations/index.vue';

import buyAndSellContract from '@/components/business/buyAndSellContract/index.vue';

</script>

<style lang="scss" scoped>
.transactionModule-index {
  .checckBitBtn {
    .checckBitImgBox {
      image {
        width: 14px;
        height: 14px;
      }
    }
  }
  .toolsBtn {
    image {
      width: 13px;
      height: 16px;
    }
  }
  .increaseAndDecreaseBox {
    background: #FFD3D9;
    border-radius: 3px 3px 3px 3px;
  }
  .buyAndSellBox {
    gap: 14px;
    .buyAndSellMoudle {
    }
  }
}
</style>