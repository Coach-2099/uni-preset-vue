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
        <div @click="checkBit" class="baseSelect w-100 mt-10 pl-15 pr-25 flex justify-between items-cneter">
          <div class="leftBox flex items-center">
            <image
              class="baseImg"
              :src="symbolUrl"
              mode="scaleToFill"
            />
            <p class="fs-14 fw-b ml-5 mr-5 text-black">{{ symbol }}</p>
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

      <div v-if="protocolType" class="mt-20">
        <p class="fs-16 text-black">所属网络</p>
        <div @click="openNetworkPopup" class="baseSelect w-100 mt-10 pl-15 pr-25 flex justify-between items-cneter">
          <div class="leftBox flex items-center">
            <p
              class="fs-14"
              :class="protocolType ? 'text-black' : 'text-gray'">
              {{ protocolType || '请选择链类型'}}
            </p>
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
          <!-- <div class="flex items-center">
            <p class="fs-16 text-black mr-10">地址簿</p>
            <div class="rightIcon"></div>
          </div> -->
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
            v-model="amount"
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
      <div @click="openContractAddress" class="mt-10 flex justify-between items-center">
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
        <p class="fs-14 text-gray">{{ processingFee || 0 }} {{ symbol }} </p>
      </div>
      <div class="flex justify-between items-center mt-5">
        <div>
          <p class="fs-16 text-gray">到账金额</p>
          <p class="fs-14 fw-b text-black">{{ amountOfReceipt }} {{ symbol }}</p>
        </div>
        <div>
          <van-button
            class="withdrawBtn fw-b"
            type="primary"
            @click="goWithdraw"
          >Withdraw</van-button>
        </div>
      </div>
    </div>

    <currencySelectPopup @chooseToken="chooseToken" ref="currentSelectRef"></currencySelectPopup>
    <networkSelectPopup :active="networkShow" @chooseProtocolType="chooseProtocolType" ref="networkSelectPopupRef"></networkSelectPopup>
    <contractAddress ref="contractAddressRef"></contractAddress>
    <infoVerification @withdrawFun="isWithdraw" ref="InfoVerificationRef"></infoVerification>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'
import currencySelectPopup from '@/components/business/currencySelectPopup/index.vue';
import networkSelectPopup from '@/components/business/netWorkSelectPopup/index.vue'
import contractAddress from '@/components/business/contractAddress/index.vue';
import infoVerification from '@/components/business/InfoVerification/index.vue'
import { getWithdrawCoins, withdraw } from '@/api/asset';
import { useUserStore } from '@/stores/user';
import { showConfirmDialog } from 'vant';
import { onShow } from '@dcloudio/uni-app';

const currency = ref('');
const address = ref(''); // 钱包地址
const currentSelectRef:any = ref(null)
const networkSelectPopupRef:any = ref(null)
const contractAddressRef:any = ref(null)
const symbol = ref('') // 币种
const symbolUrl = ref('') // 币种图标
const networkShow = ref(true)
const protocolType = ref('') // 网络类型
const amount = ref('') // 输入金额
const protocolTypesList = ref([])
const processingFee = ref(0) // 手续费
// const amountOfReceipt = ref(0) // 到账金额

const InfoVerificationRef:any = ref(null)

const userStore = useUserStore();
const userInfo = userStore.userInfo;

// 在script部分添加计算逻辑
const amountOfReceipt = computed(() => {
  const amountNum = parseFloat(amount.value) || 0
  const fee = parseFloat(processingFee.value.toString()) || 0 // 确保手续费是数字
  return Number((amountNum - fee).toFixed(4)) // 保留4位小数后转数字
})

// TODO: 提现功能接口加密
onShow(() => {
  // 打开弹窗之前需要验证是否绑定了手机和邮箱
  getUser()
})

const getUser = async () => {
  await userStore.getUser()
  userInfo.value = {
    username: userStore.userInfo.userName,
    userId: userStore.userInfo.userId,
    avatar: userStore.userInfo.avatar
  }
  if(!userInfo.value.username || !userInfo.value.userId) {
    showConfirmDialog({
      showCancelButton: false,
      message:'请先前往安全页面绑定手机号和邮箱',
    }).then(() => {
      uni.navigateTo({
        url: '/pages/securitySettings/index'
      })
    })
  } else {
    // 手机号和邮箱都绑定了再进行选择
    currentSelectRef.value?.showFLoatingPanel('withdraw')
  }
}

const goAssetRecord = () => {
  uni.navigateTo({
    url: '/pages/AssetRecord/index'
  })
}

const inputAddress = () => {
  console.log(address.value)
}

const checkBit = () => {
  currentSelectRef.value?.showFLoatingPanel('withdraw')
}

const chooseToken = (item: any) => {
  symbol.value = item.token
  symbolUrl.value = item.img
  if(item.protocolTypes && item.protocolTypes.length>1) {
    protocolTypesList.value = item.protocolTypes
    networkSelectPopupRef.value?.showFLoatingPanel(item.protocolTypes)
		networkShow.value = true
  } else {
		if(item.protocolTypes) {
			protocolType.value = item.protocolTypes[0]
			networkShow.value = true
		} else {
			protocolType.value = ''
			networkShow.value = false
		}
		// getWithdrawalAddres()
  }
}

const chooseProtocolType =(protocol: string) =>{
	protocolType.value = protocol
	// getWithdrawalAddres()
}

const openNetworkPopup = () => {
  networkSelectPopupRef.value?.showFLoatingPanel(protocolTypesList.value)
}

const goWithdraw = async () => {
  InfoVerificationRef.value?.showFLoatingPanel()
}

const isWithdraw = async (Object: any) => {
  const params = {
    address: address.value,
    amount: amount.value,
    symbol: symbol.value,
    protocolType: protocolType.value,
    tradePwd: Object.password, // 交易密码
    smsCode: Object.phonevCode, // 短信验证码
    emailCode: Object.emailvCode // 邮箱验证码
  }
  const data = await withdraw(params)
}

const openContractAddress = () => {
  contractAddressRef.value?.showFLoatingPanel()
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