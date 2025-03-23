<template>
  <div class="recharge-index">
    <navigationBar title="充值">
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
    <div class="flex justify-center items-center  w-100 mt-25">
      <div class="qrcodeBox px-15 py-15"></div>
    </div>
    <div class="mt-10 px-15">
      <p class="fs-14 text-black">币种</p>
      <div
        class="baseSelect w-100 mt-5 pl-15 pr-25 flex justify-between items-cneter"
        @click="openPopup"
      >
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
    <div class="mt-10 px-15">
      <p class="fs-14 text-black">所属网络</p>
      <div
        class="baseSelect w-100 mt-5 pl-15 pr-25 flex justify-between items-cneter"
        @click="openNetworkPopup"
      >
        <div class="leftBox flex items-center">
          <p v-if="false" class="fs-14 text-gray">请选择链类型</p>
          <p v-else class="fs-14 fw-b ml-5 mr-5 text-black">BTC</p>
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

    <div class="Wallet mx-20 px-15 py-20">
      <div class="flex justify-start items-baseline">
        <p class="fs-14 text-gray mr-10">Wallet Address</p>
        <div class="rightIcon"></div>
      </div>
      <div class="copyInfo flex justify-between items-center mt-10">
        <p class="fs-14 text-gray address text-wrap">{{ rechargeData.address }}</p>
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
      <van-button @click="copy" class="copyBtn w-100" type="primary">Copy Address</van-button>
    </div>
    <currencySelectPopup ref="currentSelectRef"></currencySelectPopup>
    <networkSelectPopup ref="networkSelectPopupRef"></networkSelectPopup>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getRecharge } from '@/api/asset';
import navigationBar from '@/components/navigationBar/index.vue';
import currencySelectPopup from '@/components/business/currencySelectPopup/index.vue';
import networkSelectPopup from '@/components/business/netWorkSelectPopup/index.vue'

const rechargeData = ref({})
const currentSelectRef:any = ref(null)
const networkSelectPopupRef:any = ref(null)

onMounted(() => {
  getRechargeAddres()
})

const getRechargeAddres = async () => {
  const params = {
    symbol: '' // 交易对
  }
  const data = await getRecharge(params)
  rechargeData.value = data
}

const goAssetRecord = () => {
  console.log('资产列表')
  uni.navigateTo({
    url: '/pages/AssetRecord/index'
  })
}

const openPopup = () => {
  currentSelectRef.value?.showFLoatingPanel()
}

const openNetworkPopup = () => {
  networkSelectPopupRef.value?.showFLoatingPanel()
}

const copy = () => {
  uni.setClipboardData({
    data: rechargeData.value.address,
    success: function() {
      uni.showToast({
        title: '复制成功',
        icon: 'none'
      })
    }
  })
}

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
    padding-bottom: 90px;
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
</style>