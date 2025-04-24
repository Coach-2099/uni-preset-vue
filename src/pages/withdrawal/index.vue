<template>
  <div class="withdrawal-index">
    <navigationBar :title="$t('noun.withdraw')">
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
        <p class="fs-16 text-black">{{ $t('noun.currency') }}</p>
        <div @click="checkBit" class="baseSelect w-100 mt-10 pl-15 pr-25 flex justify-between items-cneter">
          <div class="leftBox flex items-center">
            <image
              class="baseImg"
              :src="symbolUrl"
              mode="scaleToFill"
            />
            <p class="fs-14 fw-b ml-5 mr-5 text-black">{{ symbol }}</p>
            <p class="fs-14 text-gray">{{name}}</p>
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
        <p class="fs-16 text-black">{{ $t('formFields.network') }}</p>
        <div @click="openNetworkPopup" class="baseSelect w-100 mt-10 pl-15 pr-25 flex justify-between items-cneter">
          <div class="leftBox flex items-center">
            <p
              class="fs-14"
              :class="protocolType ? 'text-black' : 'text-gray'">
              {{ protocolType || $t('formFields.selectTheLinkType') }}
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
          <p class="fs-16 text-black">{{ $t('withdrawal.address') }}</p>
          <!-- <div class="flex items-center">
            <p class="fs-16 text-black mr-10">地址簿</p>
            <div class="rightIcon"></div>
          </div> -->
        </div>
        <div class="baseInput mt-10">
          <input
            v-model="address"
            class="myInput px-10 py-10 w-100"
            :placeholder="$t('withdrawal.enterOrPasteAddress')"
            placeholder-class="input-placeholder"
			@blur="checkAddressRight"
          />
        </div>
      </div>

      <div class="mt-25">
        <div class="flex justify-between items-center">
          <p class="fs-16 text-black">{{ $t('withdrawal.amount') }}</p>
          <!-- <div class="flex items-end">
            <p class="fs-16 text-black mr-5">0</p>
            <div class="rightImg">
              <image
                src="/static/svg/tools/add_Circle.svg"
                mode="scaleToFill"
              />
            </div>
          </div> -->
        </div>
        <div class="baseInput mt-10 flex justify-between items-center">
          <input
            v-model="amount"
            class="myInput flex-1 px-10 py-10 w-100"
            :placeholder="$t('withdrawal.minimumWithdrawalAmount') + limitWithdraw"
            placeholder-class="input-placeholder"
            @input="calculateFee"
          />
          <text @click="maxVal" class="fs-16 px-10 rightText">{{ $t('withdrawal.max') }}</text>
        </div>
      </div>

      <div class="flex justify-between items-center mt-25">
        <p class="text-gray fs-16">{{ $t('withdrawal.fundAccount') }}：</p>
        <p class="text-black fs-16">{{tokenBalance}}</p>
      </div>
    </div>
    <div class="detailInfo mt-5 pt-20 bg-white">
      <p class="fs-14 text-gray">{{ $t('withdrawal.tips') }}：</p>
      <div class="mt-10 flex justify-between items-center">
        <p class="fs-16 text-gray">{{ $t('withdrawal.dailyRemainingQuota') }}</p>
        <p class="fs-16 text-black">20,000/20,000 USDT</p>
      </div>
      <div class="mt-10 flex justify-between items-center">
        <p class="fs-16 text-gray">{{ $t('withdrawal.monthlyRemainingQuota') }}</p>
        <P class="fs-16 text-black">20,000/20,000 USDT</P>
      </div>
      <div @click="openContractAddress" class="mt-10 flex justify-between items-center">
        <p class="fs-16 text-gray">{{ $t('withdrawal.contractAddress') }}：</p>
        <div class="flex justify-between items-center">
          <p class="fs-16 text-black mr-5">{{ $t('withdrawal.endsWith20000') }}</p>
          <div class="downIconLine"></div>
        </div>
      </div>
    </div>

    <div class="btnGroup bg-white w-100">
      <div class="flex justify-between items-center">
        <p class="fs-14 text-gray">{{ $t('withdrawal.withdrawalFee') }}</p>
        <p class="fs-14 text-gray">{{ processingFee || 0 }} {{ symbol }} </p>
      </div>
      <div class="flex justify-between items-center mt-5">
        <div>
          <p class="fs-16 text-gray">{{ $t('withdrawal.amountToReceive') }}</p>
          <p class="fs-14 fw-b text-black">{{ amountOfReceipt }} {{ symbol }}</p>
        </div>
        <div>
          <van-button
            class="withdrawBtn fw-b"
            type="primary"
            @click="goWithdraw"
          >{{ $t('noun.withdraw') }}</van-button>
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
import { getBalance, getWithdrawCoins, withdraw, checkAddress, getTokenFee} from '@/api/asset';
import { useUserStore } from '@/stores/user';
import { showConfirmDialog } from 'vant';
import { onShow } from '@dcloudio/uni-app';
import { roundDown } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const tokenBalance = ref(0); //所选钱包余额
const address = ref(''); // 钱包地址
const currentSelectRef:any = ref(null)
const networkSelectPopupRef:any = ref(null)
const contractAddressRef:any = ref(null)
const symbol = ref('') // 币种
const symbolUrl = ref('') // 币种图标
const name =ref('')//币全称
const networkShow = ref(true)
const protocolType = ref('') // 网络类型
const amount = ref('') // 输入金额
const protocolTypesList = ref([])
const processingFee = ref(0) // 手续费
const limitWithdraw = ref(0) //最小提币量
const maxWithdraw = ref(0) //最大提币量
// const amountOfReceipt = ref(0) // 到账金额
const tokenFee =ref({}) //手续费对象

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
    phone: userStore.userInfo.phone,
    email: userStore.userInfo.email,
    avatar: userStore.userInfo.avatar,
	  isValid: userStore.userInfo.isValid
  }

  // if(!userInfo.value.phone) {
  //   showConfirmDialog({
  //     showCancelButton: false,
  //     message: t('tips.bindPhoneOrEmail'),
  //   }).then(() => {
  //     uni.navigateTo({
  //       url: '/pages/modifyPhone/index'
  //     })
  //   })
  // } else 
  if (!userInfo.value.email) {
    showConfirmDialog({
      showCancelButton: false,
      message: t('tips.bindPhoneOrEmail'),
    }).then(() => {
      uni.navigateTo({
        url: '/pages/modifyEmail/index'
      })
    })
  }else if(userInfo.value.isValid == 0) {
	  showConfirmDialog({
	    showCancelButton: false,
	    message: t('userInfo.completeIDforTransactions'),
	  }).then(() => {
	    uni.navigateTo({
	      url: '/pages/IdentityAuth/index'
	    })
	  })
  } else if (userInfo.value.isValid == 1) {
    // 认证中页面跳转
    showConfirmDialog({
	    showCancelButton: false,
	    message: t('userInfo.IdentityAuthentication'),
	  }).then(() => {
	    uni.navigateTo({
	      url: '/pages/certification/index'
	    })
	  })
  } else {
    // 手机号和邮箱都绑定了再进行选择
    currentSelectRef.value?.showFLoatingPanel('withdraw')
  }
}

const goAssetRecord = () => {
  uni.navigateTo({
    url: '/pages/AssetRecord/index?type=Withdraw'
  })
}

const maxVal =()=>{
	amount.value = tokenBalance.value
	calculateFee()
}

//计算手续费
const calculateFee =()=>{
	if(tokenFee.value){
		if(tokenFee.value.feeType === 1){ //按比例
			processingFee.value = roundDown(amount.value * tokenFee.value.val,2)
		}else{ //固定
			processingFee.value = tokenFee.value.val
		}
	}
}

const getFee=async()=>{
	const params = {
		token:symbol.value
	}
	const data = await getTokenFee(params)
	tokenFee.value = data
}

//获取选中币种余额信息
const balance =async (token:string) => {
	const params = {
	  token: token,
	  accountType: 'WALLET' //只查询基础钱包账户余额，提币只能从基础钱包提出
	}
	const data = await getBalance(params)
	tokenBalance.value = data
}

//检测地址的正确性
const checkAddressRight = async() => {
  if(!symbol.value){
	  return uni.showToast({title: t('withdrawal.selectCurrencyFirst'), icon: 'none'})
  }
  const params ={
	  coin:symbol.value,
	  address: address.value
  }
  const data = await checkAddress(params)
  if(data.errMsg){ //检测地址错误清空地址信息
	  address.value = ''
  }
}

const checkBit = () => {
  currentSelectRef.value?.showFLoatingPanel('withdraw')
}

const chooseToken = (item: any) => {
  symbol.value = item.token
  symbolUrl.value = item.img
  name.value = item.name
  limitWithdraw.value = item.limitWithdraw
  maxWithdraw.value = item.maxWithdraw
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
  }
  getFee() //获取选择币种手续费
  balance(item.token) //查询余额
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
 if(!data || !data.errMsg){
  	uni.showToast({title: t('withdrawal.withdrawalSubmitted'), icon: 'success'})
	balance(symbol.value) //查询余额
  }
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