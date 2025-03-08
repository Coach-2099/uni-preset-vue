<template>
  <div class="buyAndSellMoudle-index flex-1">
    <div class="btnBox flex">
      <transition name="fade">
        <div @click="checkTemp('buy')" class="flex-1 text-center fw-b" :class="{ 'checkBuyBtn text-white': checkActive == 'buy' }">buy</div>
      </transition>
      <transition name="fade">
        <div @click="checkTemp('sell')" class="flex-1 text-center fw-b" :class="{ 'checkSellBtn text-white': checkActive == 'sell' }">sell</div>
      </transition>
    </div>
    <div class="mt-10 flex justify-between align-center">
      <div class="">
        <text class="fs-12 text-gray">可用</text>
      </div>
      <div>
        <text class="mr-5 fs-12 text-black">0</text>
        <text class="fs-12 text-black">USDT</text>
      </div>
    </div>
    <div class="inputBox">
      <div class="baseSelect w-100 mt-10 pl-15 pr-10 py-5 flex justify-between items-center">
        <div class="leftBox flex items-center">
          <p class="fs-14 text-black">限价单</p>
        </div>
        <div class="rightBox flex items-center">
          <image
            class="downIcon"
            src="/static/images/down.png"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="baseInput-Special w-100 mt-10 pl-15 py-10 flex justify-between items-center">
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12 h-20' : 'fs-14'"
            class="text-gray price-label">价格</div>
          <input
            v-if="showPriceInput"
            :focus="showPriceInput"
            v-model="price"
            class="myInput flex-1 w-100"
            placeholder="输入"
            placeholder-class="input-placeholder"
          />
        </div>
        <text class="fs-14 px-10 text-gray">USDT</text>
      </div>
      <div class="ml-5">
        <text class="fs-12 text-black">≈ 88,781.89  USD</text>
      </div>
      <div class="baseInput-Special w-100 mt-10 pl-15 py-10 flex justify-between items-center">
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12 h-20' : 'fs-14'"
            class="text-gray price-label">数量</div>
          <input
            v-if="showPriceInput"
            :focus="showPriceInput"
            v-model="price"
            class="myInput flex-1 w-100"
            placeholder="输入"
            placeholder-class="input-placeholder"
          />
        </div>
        <text class="fs-14 px-10 text-gray">BTC</text>
      </div>
      <div class="baseSlider mt-15 px-5">
        <van-slider class="mySlider" bar-height="5" v-model="value" :step="5">
          <template #button>
            <div class="custom-button">
              <image
                src="/static/images/checkSlider.png"
                mode="scaleToFill"
              />
            </div>
          </template>
        </van-slider>
        <div class="custom-progress-points" style="pointer-events: none;">
          <image
            :src="value >= 0 ? '/static/images/onSlider.png' : '/static/images/unSlider.png'"
            mode="scaleToFill"
          />
          <image
            :src="value >= 25 ? '/static/images/onSlider.png' : '/static/images/unSlider.png'"
            mode="scaleToFill"
          />
          <image
            :src="value >= 50 ? '/static/images/onSlider.png' : '/static/images/unSlider.png'"
            mode="scaleToFill"
          />
          <image
            :src="value >= 75 ? '/static/images/onSlider.png' : '/static/images/unSlider.png'"
            mode="scaleToFill"
          />
          <image
            :src="value >= 100 ? '/static/images/onSlider.png' : '/static/images/unSlider.png'"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="baseInput-Special w-100 mt-15 pl-15 py-10 flex justify-between items-center">
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12 h-20' : 'fs-14'"
            class="text-gray price-label">订单额</div>
          <input
            v-if="showPriceInput"
            :focus="showPriceInput"
            v-model="price"
            class="myInput flex-1 w-100"
            placeholder="输入"
            placeholder-class="input-placeholder"
          />
        </div>
        <text class="fs-14 px-10 text-gray">USDT</text>
      </div>
      <div class="baseText w-100 mt-10 pl-15 pr-10 py-5 flex justify-between items-center">
        <div class="leftBox flex items-center">
          <p class="fs-12 text-black">最多可买</p>
        </div>
        <div class="rightBox flex items-center">
          <text class="fs-12 text-light-gray">2.22304</text>
          <text class="fs-12 text-gray ml-5">BTC</text>
        </div>
      </div>
      <div class="myBtnBox mt-15">
        <van-button
          v-if="checkActive == 'buy'"
          class="myBuyBtn fw-b fs-14 w-100"
          type="success"
        >Buy</van-button>
        <van-button
          v-if="checkActive == 'sell'"
          class="mySellBtn fw-b fs-14 w-100"
          type="danger"
        >Sell</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const checkActive = ref('buy');
const price = ref('');
const showPriceInput = ref(false)
const value = ref(0);
const checkTemp = (type: string) => {
  checkActive.value = type;
}

const clickPriceInpupt = () => {
  showPriceInput.value = !showPriceInput.value
}

</script>

<style lang="scss" scoped>
.buyAndSellMoudle-index {
  .btnBox {
    background: #F6F7FB;
    border-radius: 6px 6px 6px 6px;
    height: 28px;
    line-height: 28px;
    .checkBuyBtn {
      background: #0FB668;
      border-radius: 6px 6px 6px 6px;
    }
    .checkSellBtn {
      background: #FF3E47;
      border-radius: 6px 6px 6px 6px;
    }
    // 添加过渡动画
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s ease;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
  .inputBox {
    .baseSelect {
      background: #F6F7FB;
      border-radius: 8px 8px 8px 8px;
      height: 28px;
      .leftBox {
        .baseImg {
          width: 18px;
          height: 18px;
        }
      }
      .rightBox {
        .downIcon {
          width: 9px;
          height: 7px;
        }
      }
    }
    .baseInput-Special {
      background: #F6F7FB;
      border-radius: 8px 8px 8px 8px;
      height: 48px;
      .price-label {
        transition: font-size 0.2s ease; // 添加过渡效果
      }
    }
    .baseSlider {
      position: relative;
      .mySlider {
        position: relative;
        .custom-button {
          z-index:9;
          image {
            width: 14px;
            height: 14px;
          }
        }
      }
      .custom-progress-points {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-60%);
        display: flex;
        justify-content: space-between;
        padding: 0 -1px; // 根据实际情况调整
        image {
          width: 14px;
          height: 14px;
        }
      }
    }
    .baseText {
      background: #F6F7FB;
      border-radius: 8px 8px 8px 8px;
      height: 28px;
    }
    .myBtnBox {
      .myBuyBtn {
        height: 32px;
        background: #0FB668;
        border-radius: 6px 6px 6px 6px;
      }
      .mySellBtn {
        height: 32px;
        background: #FF3E47;
        border-radius: 6px 6px 6px 6px;
      }
    }
  }
}
</style>