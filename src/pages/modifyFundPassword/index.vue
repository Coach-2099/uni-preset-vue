<template>
  <div class="modifyFundPassword-index">
    <navigationBar :title="$t('common.fundPassword')"></navigationBar>
    <div class="inputTemp mt-25 px-20">
      <div class="mt-10">
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">{{ $t('common.account') }}</p>
        </div>
        <div class="baseInput mt-5 flex justify-between items-center">
          <input
            v-model="userName"
            class="myInput flex-1 px-10 py-10 w-100"
            :disabled="true"
          />
        </div>
      </div>
      <div class="mt-10">
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">{{ $t('common.vCode') }}</p>
        </div>
        <div class="baseInput mt-5 flex justify-between items-center">
          <input
            v-model="verificationCode"
            class="myInput flex-1 px-10 py-10 w-100 mr-10"
            :placeholder="$t('tips.enterVCode')"
          />
          <!-- :disabled="!accountNumber" -->
          <baseVCodeButton ref="vcodeRef"  @get-code="getCode" />
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
            :placeholder="$t('tips.enterPassword')"
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
import { onMounted, ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';
import { sendmsg } from '@/api/account'
import { setTradepwd } from '@/api/user'
import baseVCodeButton from '@/components/baseVCodeButton/index.vue'
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const vcodeRef = ref()
const userStore = useUserStore();
const userName = userStore.userInfo.username;
const accountNumber = ref('')
const password = ref('')
const verificationCode = ref('')
const showPassword = ref(true);

onMounted(() => {

})

// 点击确认按钮
const confirmFun = async () => {
  if (!verificationCode.value && !password.value) {
    uni.showToast({
      title: t('tips.pleaseImproveTheInfo'),
      icon: 'none'
    })
    return
  }
  const params = {
    username: accountNumber.value,
    code: verificationCode.value,
    password: password.value
  }
  await setTradepwd(params)
  uni.showToast({
    title: t('tips.success'),
    icon: 'none'
  })
  await userStore.getUser()
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}

// 获取验证码
const getCode = async () => {
  const phone = userStore.userInfo.phone;
  const email = userStore.userInfo.email;
  if (!phone || !email) {
    uni.showToast({
      title: t('tips.bindPhoneOrEmail'),
      icon: 'none'
    })
    return;
  }

  // 有手机的话就给手机发送验证码
  vcodeRef.value.startCountdown()
  if (phone) {
    accountNumber.value = phone;
  } else if (email) {
    accountNumber.value = email;
  }
  const params = {
    userName: accountNumber.value,
    countryCode: '',
  }
  await sendmsg(params)
  uni.showToast({
    title: t('tips.vCodeHasSent'),
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