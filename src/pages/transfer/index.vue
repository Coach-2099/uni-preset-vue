<template>
  <div class="transfer-index">
    <navigationBar title="划转"></navigationBar>
    <div class="accountTemp pt-25 pb-25 px-25 bg-white">
      <transition-group name="flip" tag="div" class="account-container">
        <div key="from" class="flex justify-between items-center">
          <div class="flex justify-between items-center w-100">
          <div class="flex justify-start items-center w-100">
            <p class="text-gray fs-14 mr-25">从</p>
            <van-popover
              placement="bottom-start"
              :actions="actionsAccountType"
              @select="onSelectFromAccountType"
            >
              <template #reference>
                <div class="baseSelect w-100 py-5 flex justify-between items-center">
                  <div class="leftBox flex items-center w-100">
                    <p class="fs-14 text-black">{{ fromAccount?.text }}</p>
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
          </div>
        </div>
        </div>

        <div class="divLine mt-25 mb-25 bg-white pos-relative">
          <van-divider>
            <image
              @click="exchange"
              class="pos-absolute exchangeIcon"
              src="/static/svg/tools/exchange.svg"
              mode="scaleToFill"
            />
          </van-divider>
        </div>

        <div key="to" class="flex justify-between items-center">
          <div class="flex justify-between items-center w-100">
            <div class="flex justify-between items-center w-100">
              <p class="text-gray fs-14 mr-25">到</p>
              <van-popover
                placement="bottom-start"
                :actions="toAccountType"
                @select="onSelectToAccountType"
              >
                <template #reference>
                  <div class="baseSelect w-100 py-5 flex justify-between items-center">
                    <div class="leftBox flex items-center">
                      <p class="fs-14 text-black">{{ toAccount?.text }}</p>
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
            </div>
            <!-- <image
              class="downIcon"
              src="/static/images/downGray.png"
              mode="scaleToFill"
            /> -->
          </div>
        </div>
      </transition-group>
    </div>
    <div class="inputBox mt-5 bg-white">
      <div class="pt-20 mb-20">
        <p class="fs-16 text-black">币种</p>
        <div class="baseSelect w-100 mt-10 pl-15 pr-25 flex justify-between items-cneter">
			<van-popover
			  placement="bottom-end"
			  :actions="transferData"
			  @select="onSelectTransferToken"
			>
			  <template #reference>
			    <div class="baseSelect w-100 py-5 flex justify-between items-center">
			      <div class="leftBox flex items-center">
					<p class="fs-14 fw-b ml-5 mr-5 text-black">{{transferToken?.text}}</p>
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
        </div>
      </div>
      <div class="mt-25">
        <div class="flex justify-between items-center">
          <p class="fs-16 text-black">金额</p>
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
            placeholder="请输出转账金额"
            placeholder-class="input-placeholder"
          />
          <text class="fs-16 px-10 rightText">
            <text class="text-light-blue" @click="transferMax">最大</text> |
            <text class="text-black">{{transferToken?.text}}</text>
          </text>
        </div>
      </div>
      <div class="mt-25 flex justify-between items-center">
        <p class="text-gray fs-16">可用金额</p>
        <p class="text-black fs-16">{{tokenBalance}} {{transferToken?.text}}</p>
      </div>
    </div>
    <div class="btnBox bg-white w-100 pos-fixed">
      <van-button
        class="confirmBtn w-100 fw-b fs-20"
        type="primary" @click="transfer"
      >confirm</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref ,onMounted} from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'
import { getTrasferCoins, getBalance,postTransfer} from '@/api/asset'
const amount = ref(''); //转账金额
const fromAccount = ref<AccountType>(
	{ text: '钱包', value: 'WALLET' }
) //转出账户
const toAccount = ref<AccountType>(
{ text: '现货账户', value: 'SPOT' }
) //转入账户
const transferToken = ref<TokenType>() //交易币种
const transferData = ref<any[]>([]);
const tokenBalance = ref(0) //转出币种可用余额
const toAccountType =ref<any[]>([]);

// 类型定义
type AccountType = {
  text: string;  // 账户类型
  value: string; // 账户类型编码
}

// 币种类型
type TokenType = {
  text: string;  // 币名
  icon: string; // 币种图标
}

const actionsAccountType = [
  { text: '钱包', value: 'WALLET' },
  { text: '现货账户', value: 'SPOT' },
  { text: '合约账户', value: 'FUTURES' },
  { text: '贵金属账户', value: 'METALS' },
]

//选择转出账户
const onSelectFromAccountType = (action: any) => {
		if(action.value === 'FUTURES' && transferToken.value?.text !== 'USDT'){
			return uni.showToast({title: '合约账户只能划转USDT', icon: 'none'})
		}else if(action.value === 'METALS' && transferToken.value?.text !== 'USD'){
			return uni.showToast({title: '合约账户只能划转USD', icon: 'none'})
		}
		toAccountType.value = actionsAccountType.filter((item: any)=>{return item.value!==action.value})	
		fromAccount.value = action
		balance() //切换账户时重新获取余额
}

//选择转入账户
const onSelectToAccountType = (action: any) => {
		if(action.value === 'FUTURES' && transferToken.value?.text !== 'USDT'){
			return uni.showToast({title: '合约账户只能划转USDT', icon: 'none'})
		}else if(action.value === 'METALS' && transferToken.value?.text !== 'USD'){
			return uni.showToast({title: '合约账户只能划转USD', icon: 'none'})
		}
		toAccount.value = action
}

//选择币种信息
const onSelectTransferToken = (action: any) => {
		if(fromAccount.value?.text === 'FUTURES' && action.text !== 'USDT'){
			return uni.showToast({title: '合约账户只能划转USDT', icon: 'none'})
		}else if(fromAccount.value?.text === 'METALS' && action.text !== 'USD'){
			return uni.showToast({title: '合约账户只能划转USD', icon: 'none'})
		}
		transferToken.value = action
}

onMounted(() => {
	//默认进入时为钱包 与现货之间互转
	loadTrasferCoins()
	toAccountType.value = actionsAccountType.filter((item: any)=>{return item.value!==fromAccount.value.value})
})

const transferMax = () =>{
	amount.value = tokenBalance.value
}

const balance =async () => {
	const params = {
	  token: transferToken.value?.text,
	  accountType: fromAccount.value.value
	}
	const data = await getBalance(params)
	tokenBalance.value = data
}

const loadTrasferCoins = async () => {
	const data = await getTrasferCoins()
	data.forEach((item: any)=>{
		if(item.token === 'USDT'){
			transferToken.value = {text:item.token,icon:item.img}
		}
		transferData.value.push({text:item.token,icon:item.img})
	})
	balance() //初始获取用户资产余额
}

const exchange = () => {
  console.log('交换上下')
    // 交换账户
    const temp = fromAccount.value
    fromAccount.value = toAccount.value
    toAccount.value = temp

    // 更新可选账户类型
    toAccountType.value = actionsAccountType.filter(item => item.value !== fromAccount.value.value)
}

//提交划转
const transfer =async() =>{
	if(fromAccount.value?.value === toAccount.value?.value){
		return uni.showToast({title: '转出账户和转入账户不能相同', icon: 'none'})
	}else if((fromAccount.value?.value === 'FUTURES'||toAccount.value?.value === 'FUTURES') && transferToken.value?.text !== 'USDT'){
		return uni.showToast({title: '合约账户只能划转USDT', icon: 'none'})
	}else if((fromAccount.value?.value === 'METALS' || toAccount.value?.value === 'METALS') && transferToken.value?.text !== 'USD'){
		return uni.showToast({title: '合约账户只能划转USD', icon: 'none'})
	}else if(tokenBalance.value<amount.value){
		return uni.showToast({title: '可用余额不足，请不要输入大于可用余额的金额', icon: 'none'})
	}
	const params = {
	  fromAccount: fromAccount.value?.value,
	  toAccount: toAccount.value?.value,
	  symbol: transferToken.value?.text,
	  amount: amount.value
	}
	await postTransfer(params)
	balance()//重新获取余额信息
	uni.showToast({title: '划转成功', icon: 'success'})
}

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

  /* 添加交换动画 */
  .flip-move {
    transition: all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55); // 更明显的缓动曲线
  }

  .flip-enter-active,
  .flip-leave-active {
    transition: all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55); // 同步延长持续时间
    position: absolute;
    width: 100%; // 防止宽度抖动
  }

  .flip-enter-from {
    opacity: 0;
    transform: translateY(-30px); // 增大位移量
  }

  .flip-leave-to {
    opacity: 0;
    transform: translateY(30px); // 增大位移量
  }

  .account-container {
    position: relative;
    min-height: 150px; // 保证容器高度避免跳动
  }

  :deep(.van-popover__wrapper) {
    width: 100%;
  }
}
</style>