<template>
  <div class="priceFluctuations-temp" ref="contentRef">
    <div class="flex justify-between align-center">
      <div>
        <p class="fs-12 text-gray">价格</p>
        <p class="fs-12 text-gray">(USDT)</p>
      </div>
      <div class="flex justify-between align-center">
        <div class="mr-5">
          <p class="fs-12 text-gray text-right">数量</p>
          <p class="fs-12 text-gray text-right">(BTC)</p>
        </div>
        <div class="downBtn">
          <image
            src="/static/images/downGray.png"
            mode="scaleToFill"
          />
        </div>
      </div>
    </div>

    <div class="contentTemp">
      <div class="listBox">
        <div v-for="index in dynamicEntryCount" :key="index" class="contentList pos-relative flex justify-between items-center">
          <div class="fs-12 text-light-green">85888</div>
          <div class="fs-12 text-black">3.686</div>
          <div
            class="bg-layer pos-absolute buyTemp"
            :style="{ 'width': fluctuationWidth +'%' }"
          ></div>
        </div>
      </div>
    </div>

    <div class="contentTitle mt-5">
      <p class="fs-16 text-light-green">86126</p>
      <p class="fs-12 text-black">
        <text>≈ 88,781.89</text>
        <text class="ml-5">USD</text>
      </p>
    </div>

    <div class="contentTemp">
      <div class="listBox">
        <div v-for="index in dynamicEntryCount" :key="index" class="contentList pos-relative flex justify-between items-center">
          <div class="fs-12 text-red">85888</div>
          <div class="fs-12 text-black">3.686</div>
          <div
            class="bg-layer pos-absolute sellTemp"
            :style="{ 'width': fluctuationWidth +'%' }"
          ></div>
        </div>
      </div>
    </div>

    <div class="sellAndBuyTemp flex justify-between items-center mt-5">
      <div 
        class="trapezoidLeft"
        :style="{ width: leftWidth + '%', 'min-width': '25%' }"
      >
        <div class="leftBox flex items-center pr-5">
          <image
            src="/static/images/buyImg.png"
            mode="scaleToFill"
          />
          <div class="fs-8 ml-5">{{ leftWidth }}%</div>
        </div>
      </div>
      <div 
        class="trapezoidRight text-right"
        :style="{ width: rightWidth + '%', 'min-width': '25%' }"
      >
        <div class="rightBox flex items-center pl-5">
          <div class="fs-8 mr-5">{{ rightWidth }}%</div>
          <image
            src="/static/images/sellImg.png"
            mode="scaleToFill"
          />
        </div>
      </div>
    </div>

    <div class="depthTemp mt-5">
      <div class="baseSelect px-10 w-100 flex justify-between items-center">
        <div class="leftText">
          <text class="fs-10 text-black">0.01</text>
        </div>
        <div class="downIcon">
          <image
            src="/static/images/downGray.png"
            mode="scaleToFill"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import { useControlStore } from '@/stores/control'
import { storeToRefs } from 'pinia'

const controlStore = useControlStore();
const { inputShow } = storeToRefs(controlStore);

const fluctuationWidth = ref(10);
const leftWidth = ref(50);
const rightWidth = ref(50);

// 新增响应式数据
const dynamicEntryCount = ref(8);

watch(inputShow, (newVal, oldVal) => {
  if (newVal) {
    dynamicEntryCount.value = 11
  } else {
    dynamicEntryCount.value = 8
  }
})

const getRandomInt = (min:number, max:number) => {
  min = Math.ceil(min); // 确保最小值是整数
  max = Math.floor(max); // 确保最大值是整数
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(() => {
  leftWidth.value = getRandomInt(1, 100)
  rightWidth.value = 100 - leftWidth.value
  fluctuationWidth.value = getRandomInt(1, 100)
},1500)

</script>

<style lang="scss" scoped>
.priceFluctuations-temp {
  .downBtn {
    image {
      width: 7px;
      height: 5px;
    }
  }
  .contentTemp {
    .listBox {
      .contentList {
        .bg-layer {
          height: 19px;
          // width: 100% !important; // 固定最大宽度
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;

          right: 0;
          height: 100%;
          border-radius: 4px 0 0 4px;
        }

        .buyTemp {
          background: linear-gradient(90deg, rgba(15,182,104,0.1) 80%, rgba(15,182,104,0.05));
        }

        .sellTemp {
          background: linear-gradient(90deg, rgba(255,62,71,0.05), rgba(255,62,71,0.1) 20%);
        }

        .bg-layer {
          &::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 4px;
            background: rgba(255,255,255,0.3);
            animation: trail 0.8s ease-out;

          }
        }

      }
    }
  }
  .sellAndBuyTemp {
    // padding: 0px 8px;
    // 容器设置过渡
    transition: all 0.3s ease-in-out;
    width: 100%;
    height: 16px;
    line-height: 16px;
    [class^="trapezoid"] {
      transition: all 0.3s ease-in-out;
      height: 100%;
      position: relative;
      // background: #409eff;
      display: flex;
      align-items: center;
      color: white;

      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background: rgba(255,255,255,0.5);
      }
    }

    .trapezoidLeft {
      background: #e0f5ec;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      color: #0FB668;
      clip-path: polygon(
        0 0,
        100% 0,
        calc(100% - 5px) 100%, // 10%宽度偏移
        0 100%
      );
      // padding-left: 12%; // 动态补偿
      justify-content: flex-start;
      .leftBox {
        height: 16px;
        line-height: 16px;
        image {
          width: 16px;
          height: 16px;
        }
      }
    }

    .trapezoidRight {
      background: #fff0f2;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      color: #FF3E47;
      clip-path: polygon(
        5px 0, // 10%宽度偏移
        100% 0,
        100% 100%,
        0 100%
      );
      // padding-right: 12%; // 动态补偿
      justify-content: flex-end;
      .rightBox {
        height: 16px;
        line-height: 16px;
        image {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
  .depthTemp {
    .baseSelect {
      border-radius: 6px;
      height: 22px;
      line-height: 22px;
      background: #F6F7FB;
      .downIcon {
        image {
          width: 5px;
          height: 4px;
        }
      }
    }
  }
}
</style>