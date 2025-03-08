<template>
  <div class="recharge-index">
    <navigationBar title="充值">
      <template #right>
        <div class="headerRightIcon">
          <image
            class="rechargeImg"
            src="/static/svg/tools/rechargeLog.svg"
            mode="scaleToFill"
          />
        </div>
      </template>
    </navigationBar>
    <div class="flex justify-center items-center  w-100 mt-25">
      <div class="qrcodeBox px-15 py-15"></div>
    </div>
    <div class="Wallet mx-20 px-15 py-20">
      <div class="flex justify-start items-baseline">
        <p class="fs-14 text-gray mr-10">Wallet Address</p>
        <div class="rightIcon"></div>
      </div>
      <div class="copyInfo flex justify-between items-center mt-10">
        <p class="fs-14 text-gray address text-wrap">0xedcca97f48f1c7947f398a2f47bd9ff73e7514ac</p>
        <image
          class="copyIcon"
          src="/static/images/copy.png"
          mode="scaleToFill"
        />
      </div>
    </div>
    <div class="basicInfo px-20">
      <div class="flex justify-between items-center mt-10">
        <p class="fs-14 text-gray">Route Deposits To</p>
        <div class="flex justify-between items-baseline">
          <p class="text-black fs-14">Unified Trading Account</p>
          <div class="rightIcon ml-10"></div>
        </div>
      </div>
      <div class="flex justify-between items-center mt-25">
        <p class="fs-14 text-gray">Deposit Arrival</p>
        <div class="flex justify-between items-baseline">
          <p class="text-black fs-14">6 confirmations</p>
        </div>
      </div>
      <div class="flex justify-between items-center mt-25">
        <p class="fs-14 text-gray">Withdrawal Unlockecl</p>
        <div class="flex justify-between items-baseline">
          <p class="text-black fs-14">64 confirmations</p>
        </div>
      </div>
      <div class="flex justify-between items-center mt-25">
        <p class="fs-14 text-gray">Contract Address:</p>
        <div class="flex justify-between items-baseline">
          <p class="text-black fs-14">Ending with d831ec7</p>
          <div class="rightIcon ml-10"></div>
        </div>
      </div>
    </div>
    <div class="copyBtnBox w-100 flex items-center justify-center px-20">
      <van-button class="copyBtn w-100" type="primary">Copy Address</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';



</script>

<style lang="scss" scoped>
.recharge-index {
  background: #fff;
  height: 100%;
  .headerRightIcon {
    .rechargeImg {
      width: 22px;
      height: 22px;
    }
  }
  .qrcodeBox {
    width: 50vw;
    height: 50vw;
    // background: #bdbdbd;
    box-shadow: 0px 0px 6px 1px rgba(0,8,242,0.08);
    border-radius: 16px 16px 16px 16px;
  }
  .Wallet {
    margin-top: 40px;
    background: #F6F7FB;
    border-radius: 5px 5px 5px 5px;
    .copyInfo {
      .copyIcon {
        width: 14.18px;
        height: 14.18px;
      }
      .address {
        width: 90%;
      }
    }
  }
  .basicInfo {
    margin-top: 40px;
    padding-bottom: 110px;
  }
  .copyBtnBox {
    position: fixed;
    bottom: 40px;
    .copyBtn {
      border-radius: 6px 6px 6px 6px;
      background: #1777FF;
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
    border: solid #B0B0B0;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -50%) rotate(-45deg);
    position: absolute;
    left: 50%;
    top: 70%;
  }
}
</style>