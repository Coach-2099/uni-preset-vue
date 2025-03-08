<template>
  <div class="transfer-index">
    <navigationBar title="划转"></navigationBar>
    <div class="accountTemp pt-25 pb-25 px-25 bg-white">
      <div class="flex justify-between items-center">
        <div class="flex justify-between items-center">
          <p class="text-gray fs-14 mr-25">从</p>
          <p class="text-black fs-16">资金账户</p>
        </div>
        <image
          class="downIcon"
          src="/static/images/downGray.png"
          mode="scaleToFill"
        />
      </div>
      <div class="divLine mt-25 mb-25 bg-white pos-relative">
        <van-divider>
          <image
            class="pos-absolute exchangeIcon"
            src="/static/svg/tools/exchange.svg"
            mode="scaleToFill"
          />
        </van-divider>
      </div>
      <div class="flex justify-between items-center">
        <div class="flex justify-between items-center">
          <p class="text-gray fs-14 mr-25">到</p>
          <p class="text-black fs-16">统一交易账户</p>
        </div>
        <image
          class="downIcon"
          src="/static/images/downGray.png"
          mode="scaleToFill"
        />
      </div>
    </div>
    <div class="inputBox mt-5 bg-white">
      <div class="pt-20 mb-20">
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
          <text class="fs-16 px-10 rightText">
            <text class="text-light-blue">最大</text> |
            <text class="text-black">BTC</text>
          </text>
        </div>
      </div>
      <div class="mt-25 flex justify-between items-center">
        <p class="text-gray fs-16">可用金额</p>
        <p class="text-black fs-16">0 BTC</p>
      </div>
    </div>
    <div class="btnBox bg-white w-100 pos-fixed">
      <van-button
        class="confirmBtn w-100 fw-b fs-20"
        type="primary"
      >confirm</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'

const address = ref('');

const inputAddress = (e) => {
  console.log(e.target.value);
};

</script>

<style lang="scss" scoped>
.transfer-index {
  background: #F6F7FB;
  .accountTemp {
    .downIcon {
      width: 13px;
      height: 11px;
    }
    .divLine {
      width: 100%;
      height: 1px;
      .exchangeIcon {
        width: 26px;
        height: 26px;
        bottom: -12px;
        left: 50%;
        right: 50%;
      }
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
        min-height: 52px;
        line-height: 52px;
        margin-left: -5px;
        border-radius: 0px 8px 8px 0px;
      }
    }
  }
  .btnBox {
    padding-left: 18px;
    padding-right: 18px;
    bottom: 35px;
    .confirmBtn {
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
}
</style>