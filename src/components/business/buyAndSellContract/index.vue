<template>
  <div class="buyAndSellContract-index">
    <van-popover
      v-model:show="showPopover"
      placement="bottom-end"
      :actions="actions"
      @select="onSelect"
    >
      <template #reference>
        <div class="dropDownBox flex justify-between align-center w-100">
          <div class="fs-12 text-black">0.1</div>
          <div class="imgBox">
            <image
              class="downIcon"
              src="/static/images/downGray.png"
            />
          </div>
        </div>
      </template>
    </van-popover>
    <div class="mt-10 flex justify-between align-center">
      <div class="">
        <text class="fs-12 text-gray">{{ $t('module.buyAndSellModule.available') }}</text>
      </div>
      <div>
        <text class="mr-5 fs-12 text-black">0</text>
        <text class="fs-12 text-black">USDT</text>
      </div>
    </div>
    <div class="inputBox">
      <van-popover
        placement="bottom-end"
        v-model:show="showPopoverOrderType"
        :actions="actionsOrderType"
        @select="onSelectOrderType"
      >
        <template #reference>
          <div class="baseSelect w-100 py-5 flex justify-between items-center">
            <div class="leftBox flex items-center">
              <p class="fs-14 text-black">{{ orderTypeObj?.text }}</p>
            </div>
            <div class="rightBox flex items-center">
              <image
                class="downIcon"
                src="/static/images/down.png"
                mode="scaleToFill"
              />
            </div>
          </div>
        </template>
      </van-popover>


      <div 
        v-if="orderTypeObj?.value === 1"
        class="baseInput-Special w-100 mt-10 pl-15 py-10 flex justify-between items-center"
      >
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12 topTextTemp' : 'fs-14'"
            class="text-gray price-label"
          >
            <text>{{ $t('noun.price') }}</text>
          </div>
          <input
            v-if="showPriceInput"
            :focus="showPriceInput"
            v-model="price"
            class="myInput flex-1 w-100"
            :placeholder="$t('tips.enterPrice')"
            placeholder-class="input-placeholder"
          />
        </div>
        <text class="fs-14 px-10 text-black">USDT</text>
      </div>

      <div v-if="settingAfterConfirmation === '1'" class="baseInput-Special w-100 mt-10 pl-15 py-10 flex justify-between items-center">
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12 topTextTemp' : 'fs-14'"
            class="text-gray price-label">
              <text>{{ $t('noun.quantity') }}</text>
            </div>
          <input
            v-if="showPriceInput"
            :focus="showPriceInput"
            v-model="price"
            class="myInput flex-1 w-100"
            :placeholder="$t('noun.enterQuantity')"
            placeholder-class="input-placeholder"
          />
        </div>
        <div class="checkTypeBox flex jusify-between items-center px-10" @click="checkPriceAndQuantity">
          <text class="fs-14 text-black">USDT</text>
          <div class="imgBox ml-5">
            <image
              class="downIcon"
              src="/static/images/down.png"
              mode="scaleToFill"
            />
          </div>
        </div>
      </div>

      <div v-if="settingAfterConfirmation === '2'" class="baseInput-Special w-100 mt-10 pl-15 py-10 flex justify-between items-center">
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12 topTextTemp' : 'fs-14'"
            class="text-gray price-label">
              <text>{{ $t('noun.orderValue') }}</text>
            </div>
          <input
            v-if="showPriceInput"
            :focus="showPriceInput"
            v-model="price"
            class="myInput flex-1 w-100"
            :placeholder="$t('tips.enterOrderValue')"
            placeholder-class="input-placeholder"
          />
        </div>
        <div class="checkTypeBox flex jusify-between items-center px-10" @click="checkPriceAndQuantity">
          <text class="fs-14 text-black">USDT</text>
          <div class="imgBox ml-5">
            <image
              class="downIcon"
              src="/static/images/down.png"
              mode="scaleToFill"
            />
          </div>
        </div>
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
      <div class="baseBox mt-15 py-5 pl-15 pr-10">
        <div class="flex justify-between items-center fs-12 text-gray">
          <div v-if="settingAfterConfirmation === '1'">{{ $t('noun.quantity') }}</div>
          <div v-if="settingAfterConfirmation === '2'">{{ $t('noun.cost') }}</div>
          <div class="">
            <text class="text-light-green">0</text> /
            <text class="text-red">0</text>
            USDT
          </div>
        </div>
        <div class="flex justify-between mt-5 items-center fs-12 text-gray">
          <div>{{ $t('noun.cost') }}</div>
          <div class="">
            <text class="text-light-green">0</text> /
            <text class="text-red">0</text>
            USDT
          </div>
        </div>
      </div>

      <div class="stopTemp mt-15">
        <van-checkbox v-model="checked" shape="square" @change="changeChecked">
          <template #icon="props">
            <div class="imgBox">
              <image 
                class="img-icon"
                :src="props.checked ? activeIcon : inactiveIcon"
              />
            </div>
          </template>
          <text
            class="fs-12"
            :class="checked ? 'text-black' : 'text-gray'"
          >{{ $t('noun.takeProfitAndStopLoss') }}</text>
        </van-checkbox>
        <div v-if="checked" class="baseInput pr-10 mt-10 flex justify-between items-center">
          <input
            v-model="stopProfitVal"
            class="myInput px-10 w-50"
            :placeholder="$t('noun.takeProfit')"
            placeholder-class="input-placeholder"
          />
        </div>
        <div v-if="checked" class="baseInput pr-10 mt-10 flex justify-between items-center">
          <input
            v-model="stopProfitVal"
            class="myInput px-10 w-50"
            :placeholder="$t('noun.stopLoss')"
            placeholder-class="input-placeholder"
          />
        </div>
      </div>
      <div class="myBtnBox mt-10">
        <van-button
          @click="buyFun"
          class="myBuyBtn fw-b fs-14 w-100"
          type="success"
        >{{ $t('noun.doMore') }}</van-button>
        <div class="mt-5">
          <van-button
            @click="sellFun"
            class="mySellBtn fw-b fs-14 w-100"
            type="danger"
          >{{ $t('noun.doLess') }}</van-button>
        </div>
      </div>
    </div>
    <van-popup
      v-model:show="showPreferences"
      position="bottom"
      round
      :style="{ height: '32%' }"
    >
      <div class="px-20">
        <p class="text-black fw-b fs-14 pt-20">{{ $t('contract.buyAndSellContract.popup.preferences') }}</p>
        <div class="mt-20">
          <van-radio-group v-model="checkedSettings">
            <van-radio name="1" icon-size="20px">
              <div>
                <div class="flex justify-between items-center fs-12 fw-b text-black">
                  <p>{{ $t('contract.buyAndSellContract.popup.byQuantity') }}</p>
                  <p>ETH</p>
                </div>
                <p class="fs-12 text-gray w-100">{{ $t('contract.buyAndSellContract.popup.byQuantityTip') }} ETH</p>
              </div>
            </van-radio>
            <van-radio name="2" icon-size="20px">
              <div class="mt-15">
                <div class="flex justify-between items-center fs-12 fw-b text-black">
                  <p>{{ $t('contract.buyAndSellContract.popup.byValue') }}</p>
                  <p>ETH</p>
                </div>
                <p class="fs-12 text-gray w-100">{{ $t('contract.buyAndSellContract.popup.byValueTip') }}</p>
              </div>
            </van-radio>
          </van-radio-group>
        </div>
        <div class="popupBtnBox mt-25">
          <van-button
            @click="clickPreferences"
            class="myBtn w-100"
            type="primary"
          >
            {{ $t('common.confirm') }}
          </van-button>
        </div>
      </div>
    </van-popup>

    <!-- 做多 -->
    <van-popup
      v-model:show="showBuyPopup"
      position="bottom"
      round
      :style="{ height: '60%' }"
    >
      <div class="px-20 pos-relative">
        <p class="mt-20">市价单 买入 BTC/USDT</p>
        <div class="fs-12 text-gray mt-20">
          <div class="flex justify-between items-center">
            <div class="">订单价格</div>
            <div class="text-light-green">市价单</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>订单数量</div>
            <div class="text-black">0.165 BTC</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>订单成本</div>
            <div class="text-black">--</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>价值</div>
            <div class="text-black">13895.4420 USDT</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>仓位杠杆</div>
            <div class="text-black">全仓1.0x</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>预计强平价格</div>
            <div class="text-black">430054.00 USDT</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>执行策略</div>
            <div class="text-black">立即成交或取消</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>初始保证金率</div>
            <div class="text-black">24.01%<van-icon name="arrow-double-right" />12.59%</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>维持保证金率</div>
            <div class="text-black">24.01%<van-icon name="arrow-double-right" />12.59%</div>
          </div>
        </div>
        <div class="popupBtnBoxBuy pos-fixed w-100 px-20">
          <div>
            <van-checkbox v-model="checkedNoPopupWindons" shape="square">
              <template #icon="props">
                <image class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
              </template>
              <text
                class="fs-14"
                :class="checkedNoPopupWindons ? 'text-black' : 'text-gray'"
              >不再显示确认弹窗</text>
            </van-checkbox>
          </div>
          <div class="mt-10">
            <van-button class="myBtn w-100" type="primary">{{ $t('common.confirm') }}</van-button>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 做空 -->
    <van-popup
      v-model:show="showSellPopup"
      position="bottom"
      round
      :style="{ height: '60%' }"
    >
      <div class="px-20 pos-relative">
        <p class="mt-20 fw-b">
          <text class="fs-16 text-red">市价单 卖出</text>
          <text class="fs-12 text-black ml-5">BTC/USDT</text>
        </p>
        <div class="fs-12 text-gray mt-20">
          <div class="flex justify-between items-center">
            <div class="">订单价格</div>
            <div class="text-red">市价单</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>订单数量</div>
            <div class="text-black">0.165 BTC</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>订单成本</div>
            <div class="text-black">--</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>价值</div>
            <div class="text-black">13895.4420 USDT</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>仓位杠杆</div>
            <div class="text-black">全仓1.0x</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>预计强平价格</div>
            <div class="text-black">430054.00 USDT</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>执行策略</div>
            <div class="text-black">立即成交或取消</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>初始保证金率</div>
            <div class="text-black">
              <text class="text-gray mr-5">24.01%</text>
              <van-icon name="arrow-double-right" />
              12.59%
            </div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>维持保证金率</div>
            <div class="text-black">
              <text class="text-gray mr-5">24.01%</text>
              <van-icon name="arrow-double-right" />
              12.59%
            </div>
          </div>
        </div>
        <div class="popupBtnBoxSell pos-fixed w-100 px-20">
          <div>
            <van-checkbox v-model="checkedNoPopupWindons" shape="square">
              <template #icon="props">
                <image class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
              </template>
              <text
                class="fs-14"
                :class="checkedNoPopupWindons ? 'text-black' : 'text-gray'"
              >不再显示确认弹窗</text>
            </van-checkbox>
          </div>
          <div class="mt-10">
            <van-button class="myBtn w-100" type="warning">{{ $t('common.confirm') }}</van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// 图片
import square  from '@/static/images/square.png'
import checkSquare from '@/static/images/checkSquare.png'
import searchIcon from '@/static/images/search.png'

import { useControlStore } from '@/stores/control'

const controlStore = useControlStore();

const checkedSettings = ref('1')
const settingAfterConfirmation = ref('1')

const price = ref('');
const showPriceInput = ref(false)
const value = ref(0);
const stopProfitVal = ref() ;
const stopLossVal = ref(0);

const checked = ref(false)
const searchValue = ref('')

const activeIcon = ref(checkSquare)
const inactiveIcon = ref(square)

const showPopover = ref(false);
const actions = [
  { text: '1x', value: 1 },
  { text: '10x', value: 2 },
  { text: '100x', value: 3 },
];

const showPopoverOrderType = ref(false)
const actionsOrderType = [
  { text: '限价单', value: 1 },
  { text: '市价单', value: 2 }
]

// 类型定义
type OrderType = {
  text: string;  // 订单类型名称：'限价单' | '市价单'
  value: number; // 订单类型值：1 | 2
}
const orderTypeObj = ref<OrderType>({
  text: '限价单',
  value: 1
})

// 下单偏好设置
const showPreferences = ref(false)

// 展示做多数据弹窗
const showBuyPopup = ref(false)
// 展示做空数据弹窗
const showSellPopup = ref(false)

// 是否显示弹窗
const checkedNoPopupWindons = ref(false)

const onSelect = (action: any) => {
  console.log('点击选项', action)
}

const onSelectOrderType = (action: any) => {
  orderTypeObj.value = action
  console.log('点击选项', action)
}

// 下单偏好设置
const checkPriceAndQuantity = () => {
  showPreferences.value = !showPreferences.value
}

const clickPriceInpupt = () => {
  showPriceInput.value = !showPriceInput.value
}

const changeChecked = (val:boolean) => {
  controlStore.setInputShow(val)
}

const clickPreferences = () => {
  showPreferences.value = false
  settingAfterConfirmation.value = checkedSettings.value
}

const buyFun = () => {
  showBuyPopup.value = true
}

const sellFun = () => {
  showSellPopup.value = true
}

</script>

<style scoped lang="scss">
.buyAndSellContract-index {
  :deep(.van-popover__wrapper) {
    width: 100%;
    padding-left: 15px;
    padding-right: 10px;
    background: #F6F7FB;
    border-radius: 8px;
  }
  .dropDownBox {
    height: 28px;
    line-height: 28px;
    .imgBox {
      image {
        width: 10px;
        height: 10px;
      }
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
      line-height: 48px;
      .price-label {
        transition: font-size 0.2s ease; // 添加过渡效果
      }
      .topTextTemp {
        height: 20px;
        line-height: 20px;
      }
      .checkTypeBox {
        .imgBox {
          .downIcon {
            width: 9px;
            height: 7px;
          }
        }
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
    .baseBox {
      border-radius: 8px;
      background: #F6F7FB;
    }
    .stopTemp {
      .imgBox {
        height: 100%;
        display: flex;
        align-items: center;
        .img-icon {
          width: 12px;
          height: 12px;
        }
      }
      .baseInput {
        background: #F6F7FB;
        border-radius: 8px 8px 8px 8px;
        height: 42px;
        .myInput {

        }
        .rightBox {
          image {
            width: 9px;
            height: 7px;
          }
        }
        .input-placeholder {
          font-size: 14px;
          color: #B0B0B0;
        }
      }
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
:deep(.van-radio__label) {
  width: 100%;
  padding-left: 10px;
}
.popupBtnBox {
  .myBtn {
    background: #1777FF;
    border-radius: 6px;
  }
}
.popupBtnBoxBuy {
  bottom: 20px;
  left: 0px;
  right: 0px;
  .myBtn {
    background: #0FB668;
    border-radius: 6px;
  }
  .img-icon {
    width: 12px;
    height: 12px;
  }
}
.popupBtnBoxSell {
  bottom: 20px;
  left: 0px;
  right: 0px;
  .myBtn {
    background: #FF3E47;
    border-radius: 6px;
  }
  .img-icon {
    width: 12px;
    height: 12px;
  }
}
</style>