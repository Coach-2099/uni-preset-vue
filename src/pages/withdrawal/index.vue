<template>
  <div class="withdrawal-index">
    <navigationBar title="提现">
      <template #right>
        <div class="headerRightIcon" @click="goAssetRecord">
          <image
            class="rechargeImg"
            src="/static/svg/tools/rechargeLog.svg"
            mode="scaleToFill"
          />
        </div>
      </template>
    </navigationBar>
    <div class="inputBox pt-10 pb-25 bg-white">
      <div class="mb-20">
        <p class="fs-16 text-black">币种</p>
        <div class="baseSelect w-100 mt-10 pl-15 pr-25 flex justify-between items-cneter">
          <div class="leftBox flex items-center">
            <image
              class="baseImg"
              src="/static/images/OIP-C.jpg"
              mode="scaleToFill"
            />
            <p class="fs-14 fw-b ml-5 mr-5 text-black">BTC</p>
            <p class="fs-14 text-gray">Bitcoin</p>
          </div>
          <div class="rightBox flex items-center">
            <image
              class="downIcon"
              src="/static/images/downGray.png"
              mode="scaleToFill"
            />
          </div>
        </div>
      </div>
      <div class="mt-25">
        <div class="flex justify-between items-center">
          <p class="fs-16 text-black">地址</p>
          <div class="flex items-center">
            <p class="fs-16 text-black mr-10">地址簿</p>
            <div class="rightIcon"></div>
          </div>
        </div>
        <div class="baseInput mt-10">
          <input
            v-model="address"
            class="myInput px-10 py-10 w-100"
            placeholder="请输入或长按粘贴提币地址"
            placeholder-class="input-placeholder"
            @input="inputAddress"
          />
        </div>
      </div>
      <div class="mt-20">
        <p class="fs-16 text-black">所属网络</p>
        <div class="baseSelect w-100 mt-10 pl-15 pr-25 flex justify-between items-cneter">
          <div class="leftBox flex items-center">
            <p class="fs-14 text-gray">请选择链类型</p>
          </div>
          <div class="rightBox flex items-center">
            <image
              class="downIcon"
              src="/static/images/downGray.png"
              mode="scaleToFill"
            />
          </div>
        </div>
      </div>

      <div class="mt-25">
        <div class="flex justify-between items-center">
          <p class="fs-16 text-black">金额</p>
          <div class="flex items-end">
            <p class="fs-16 text-black mr-5">0</p>
            <div class="rightImg">
              <image
                src="/static/svg/tools/add_Circle.svg"
                mode="scaleToFill"
              />
            </div>
          </div>
        </div>
        <div class="baseInput mt-10 flex justify-between items-center">
          <input
            v-model="address"
            class="myInput flex-1 px-10 py-10 w-100"
            placeholder="最低提币金额：20"
            placeholder-class="input-placeholder"
            @input="inputAddress"
          />
          <text class="fs-16 px-10 rightText">最大</text>
        </div>
      </div>

      <div class="flex justify-between items-center mt-25">
        <p class="text-gray fs-16">资金账户：</p>
        <p class="text-black fs-16">0</p>
      </div>
    </div>
    <div class="detailInfo mt-5 pt-20 bg-white">
      <p class="fs-14 text-gray">提示：</p>
      <div class="mt-10 flex justify-between items-center">
        <p class="fs-16 text-gray">日剩余额度</p>
        <p class="fs-16 text-black">20,000/20,000 USDT</p>
      </div>
      <div class="mt-10 flex justify-between items-center">
        <p class="fs-16 text-gray">月剩余额度</p>
        <P class="fs-16 text-black">20,000/20,000 USDT</P>
      </div>
      <div class="mt-10 flex justify-between items-center">
        <p class="fs-16 text-gray">合约地址：</p>
        <div class="flex justify-between items-center">
          <p class="fs-16 text-black mr-5">以20000结尾</p>
          <div class="downIconLine"></div>
        </div>
      </div>
    </div>

    <div class="btnGroup bg-white w-100">
      <div class="flex justify-between items-center">
        <p class="fs-14 text-gray">提币手续费</p>
        <p class="fs-14 text-gray">0 1INCH </p>
      </div>
      <div class="flex justify-between items-center mt-5">
        <div>
          <p class="fs-16 text-gray">到账金额<text class="text-light-blue">设置</text> </p>
          <p class="fs-14 fw-b text-black">0 1INCH </p>
        </div>
        <div>
          <van-button
            class="withdrawBtn fw-b"
            type="primary"
          >Withdraw</van-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'

const currency = ref('');
const address = ref('');

const goAssetRecord = () => {
  console.log('资产列表')
  uni.navigateTo({
    url: '/pages/AssetRecord/index'
  })
}

const inputCurrency = () => {
  console.log(currency.value)
}

const inputAddress = () => {
  console.log(address.value)
}

</script>

<style lang="scss" scoped>
.withdrawal-index {
  background: #F6F7FB;
  .headerRightIcon {
    .rechargeImg {
      width: 22px;
      height: 22px;
    }
  }
  .inputBox {
    padding-left: 18px;
    padding-right: 18px;
    .baseSelect {
      background: #F6F7FB;
      border-radius: 8px 8px 8px 8px;
      height: 42px;
      .leftBox {
        .baseImg {
          width: 18px;
          height: 18px;
        }
      }
      .rightBox {
        .downIcon {
          width: 13px;
          height: 11px;
        }
      }
    }
    .baseInput {
      .myInput {
        min-height: 52px;
        background: #F6F7FB;
        border-radius: 8px 8px 8px 8px;
      }
      .rightText {
        background: #F6F7FB;
        color: #1777FF;
        min-height: 52px;
        line-height: 52px;
        margin-left: -5px;
        border-radius: 0px 8px 8px 0px;
      }
    }
  }
  .detailInfo {
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 120px;
  }
  .btnGroup {
    padding-left: 18px;
    padding-right: 18px;
    position: fixed;
    bottom: 35px;
    .withdrawBtn {
      width: 40vw;
      height: 54px;
      background: #1777FF;
      border-radius: 6px 6px 6px 6px;
    }
  }

  .rightImg {
    image {
      width: 16px;
      height: 16px;
    }
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

  .downIconLine {
    position: relative;
    width: 5px;
    height: 10px;
    cursor: pointer;
  }
  .downIconLine:before {
    content: "";
    width: 6px;
    height: 6px;
    border: solid #333;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -100%) rotate(45deg);
    position: absolute;
    left: 50%;
    top: 70%;
  }
}
</style>