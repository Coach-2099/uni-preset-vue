<template>
  <div class="recharge-index">
    <navigationBar :title="$t('navigationBarTitle.recharge')">
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
      <div class="qrcodeBox px-15 py-15">
		  <qrcode-vue :value="address" size="160" />
	  </div>
    </div>
    <div class="mt-10 px-15">
      <p class="fs-14 text-black">{{  $t('noun.currency')  }}</p>
      <div
        class="baseSelect w-100 mt-5 pl-15 pr-25 flex justify-between items-cneter"
        @click="openPopup"
      >
        <div class="leftBox flex items-center">
          <image
            class="baseImg"
            :src="img"
            mode="scaleToFill"
          />
          <p class="fs-14 fw-b ml-5 mr-5 text-black">{{symbol}}</p>
          <p class="fs-14 text-gray">{{name?`(${name})`:''}}</p>
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
    <div class="mt-10 px-15" v-show="networkShow">
      <p class="fs-14 text-black">{{ $t('formFields.network') }}</p>
      <div
        class="baseSelect w-100 mt-5 pl-15 pr-25 flex justify-between items-cneter"
        @click="openNetworkPopup"
      >
        <div class="leftBox flex items-center">
          <p v-if="false" class="fs-14 text-gray">{{ $t('formFields.selectTheLinkType') }}</p>
          <p v-else class="fs-14 fw-b ml-5 mr-5 text-black">{{protocolType}}</p>
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
        <p class="fs-14 text-gray mr-10">{{ $t('formFields.walletAddress') }}</p>
        <div class="rightIcon"></div>
      </div>
      <div class="copyInfo flex justify-between items-center mt-10">
        <p class="fs-14 text-gray address text-wrap">{{ address }}</p>
        <image @click="copy"
          class="copyIcon"
          src="/static/images/copy.png"
          mode="scaleToFill"
        />
      </div>
    </div>
   <!-- <div class="basicInfo px-20">
      <div class="flex justify-between items-center mt-10">
        <p class="fs-14 text-gray">Route Deposits To</p>
        <div class="flex justify-between items-baseline">
          <p class="text-black fs-14">Unified Trading Account</p>
          <div class="rightIcon ml-10"></div>
        </div>
      </div>
      <div class="flex justify-between items-center mt-5">
        <p class="fs-14 text-gray">Deposit Arrival</p>
        <div class="flex justify-between items-baseline">
          <p class="text-black fs-14">6 confirmations</p>
        </div>
      </div>
      <div class="flex justify-between items-center mt-5">
        <p class="fs-14 text-gray">Withdrawal Unlockecl</p>
        <div class="flex justify-between items-baseline">
          <p class="text-black fs-14">64 confirmations</p>
        </div>
      </div>
      <div class="flex justify-between items-center mt-5">
        <p class="fs-14 text-gray">Contract Address:</p>
        <div class="flex justify-between items-baseline">
          <p class="text-black fs-14">Ending with d831ec7</p>
          <div class="rightIcon ml-10"></div>
        </div>
      </div>
    </div> -->
    <div class="textDescription fs-12 pt-5 mt-25">
      <div class="bg-white pt-20 px-20" v-html="rechargeDesc">
      </div>
    </div>

    <div class="copyBtnBox w-100 flex items-center justify-center px-20">
      <van-button @click="copy" class="copyBtn w-100" type="primary">{{ $t('formFields.copyAddress') }}</van-button>
    </div>
    <currencySelectPopup
      @chooseToken="chooseToken"
      ref="currentSelectRef"
    ></currencySelectPopup>
    <networkSelectPopup
      :active="networkShow"
      @chooseProtocolType="chooseProtocolType"
      ref="networkSelectPopupRef"
    ></networkSelectPopup>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive,nextTick } from 'vue';
import { getRecharge } from '@/api/asset';
import navigationBar from '@/components/navigationBar/index.vue';
import currencySelectPopup from '@/components/business/currencySelectPopup/index.vue';
import networkSelectPopup from '@/components/business/netWorkSelectPopup/index.vue'
import QrcodeVue from 'qrcode.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const address = ref('') //地址
const rechargeDesc = ref('') //币种描述
const name = ref('') //币种全称
const img = ref('')
const currentSelectRef:any = ref(null)
const networkSelectPopupRef:any = ref(null)
const symbol =ref('USDT')
const protocolType = ref('ERC20')
const networkShow = ref(true)
onMounted(() => {
  currentSelectRef.value?.showFLoatingPanel('recharge')
})

const getRechargeAddres = async () => {
  const params = {
    symbol: protocolType.value?symbol.value+'-'+protocolType.value:symbol.value // 充值币种
  }
  const data = await getRecharge(params)
  address.value = data.address
}

const goAssetRecord = () => {
  console.log('资产列表')
  uni.navigateTo({
    url: '/pages/AssetRecord/index?type=Deposit'
  })
}

const openPopup = () => {
  currentSelectRef.value?.showFLoatingPanel('recharge')
}

const openNetworkPopup = () => {
  networkSelectPopupRef.value?.showFLoatingPanel()
}

//接收子组件传过来的币种信息
const chooseToken =(item: any) =>{
	symbol.value = item.token
	rechargeDesc.value = item.desc
	console.log('rechargeDesc.value=',rechargeDesc.value)
	name.value = item.name
	img.value = item.name
	if(item.protocolTypes && item.protocolTypes.length>1){
		networkSelectPopupRef.value?.showFLoatingPanel(item.protocolTypes)	
		networkShow.value = true
	}else{
		if(item.protocolTypes){
			protocolType.value = item.protocolTypes[0]
			networkShow.value = true
		}else{
			protocolType.value = ''
			networkShow.value = false
		}
		getRechargeAddres()
	}
}

const chooseProtocolType =(protocol: string) =>{
	protocolType.value = protocol
	getRechargeAddres()
}



const copy = () => {
  uni.setClipboardData({
    data: address.value,
    success: function() {
      uni.showToast({
        title: t('tips.copySuccess'),
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
  }
  .textDescription {
    background: #f8f8fa;
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