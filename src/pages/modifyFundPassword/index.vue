<template>
  <div class="modifyFundPassword-index">
    <navigationBar title="资金密码"></navigationBar>
    <div class="inputTemp mt-25 px-20">
      <div class="mt-10">
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">{{ $t('common.account') }}</p>
        </div>
        <div class="baseInput mt-5 flex justify-between items-center">
          <input
            v-model="accountNumber"
            class="myInput flex-1 px-10 py-10 w-100"
            placeholder="enter your account"
          />
          <div class="codeBtnBox ml-5" @click="getCode">
            <van-button type="primary" :disabled="countdown > 0" >
              {{ countdown > 0 ? `${countdown}${$t('common.tryAgain')}`  : $t('common.getVCode') }}
            </van-button>
          </div>
        </div>
      </div>
      <div class="mt-10">
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">{{ $t('common.vCode') }}</p>
        </div>
        <div class="baseInput mt-5 flex justify-between items-center">
          <input
            v-model="verificationCode"
            class="myInput flex-1 px-10 py-10 w-100"
            placeholder="enter verification code"
            @input="inputPassword"
          />
        </div>
      </div>
      <div class="mt-10">
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">{{ $t('common.fundPassword') }}</p>
        </div>
        <div class="baseInput mt-5 flex justify-between items-center">
          <input
            v-model="password"
            class="myInput flex-1 px-10 py-10 w-100"
            placeholder="enter your password"
            :password="showPassword"
          />
          <text class="uni-icon flex justify-center items-center pr-5 right-icon">
            <van-icon name="eye" @click="changePassword"/>
          </text>
        </div>
      </div>
    </div>
    <div class="btnBox bg-white w-100 pos-fixed">
      <van-button
        class="confirmBtn w-100 fw-b fs-20"
        type="primary"
        @click="confirmFun"
      >
        {{ $t('common.confirm') }}
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';
import { sendmsg } from '@/api/account'
import { setTradepwd } from '@/api/user'

const countdown = ref(0); // 倒计时响应式变量
let timer: number | null = null;  // 计时器引用

const accountNumber = ref('')
const password = ref('')
const verificationCode = ref('')
const showPassword = ref(true);

const inputPassword = () => {
  console.log(password.value)
}

const confirmFun = async () => {
  const params = {
    username: accountNumber.value,
    code: '',
    password: ''
  }
  await setTradepwd(params)
  uni.showToast({
    title: $t('tips.success'),
    icon: 'none'
  })
}

const getCode = async () => {
  if (!accountNumber.value) return uni.showToast({ title: $t('tips.enterAccount'), icon: 'none' })
  
  // 启动倒计时
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);

  const params = {
    userName: accountNumber.value,
    countryCode: '',
  }
  await sendmsg(params)
  uni.showToast({
    title: $t('tips.vCodeSend'),
    icon: 'none'
  })
}

const changePassword = () => {
  showPassword.value = !showPassword.value;
}

</script>

<style lang="scss">
.modifyFundPassword-index {
  .inputTemp {
    padding-bottom: 100px;
    .baseInput {
      .myInput {
        min-height: 45px;
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
      .right-icon {
        min-height: 46px;
        margin-left: -5px;
        background: #F6F7FB;
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
}
</style>