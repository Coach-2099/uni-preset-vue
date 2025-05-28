<template>
  <van-popup
    v-model:show="showBottom"
    position="bottom"
    round
    lock-scroll
    lazy-render
    :style="{ height: '75%', display: 'flex', flexDirection: 'column'}"
  >
    <div class="contentTemp pt-15 px-25">
      <div v-if="showVerifyTemp">
        <p class="fw-b fs-16">{{ $t('verification.identityVerification') }}:</p>
        <!-- <div class="inputBox mt-20">
          <p class="mt-5 mb-5 fw-b fs-14">{{ $t('verification.phoneVerificationCode') }}:</p>
          <div class="flex items-center">
            <div class="flex items-center inputTemp mr-10">
              <image
                class="leftIcon mx-10"
                src="@/static/images/vCodeIcon.png"
              />
              <input
                v-model="phonevCode"
                class="flex-1 base-input"
                style="
                border: none;
                background-color: #F6F7FB;"
                :placeholder="$t('tips.enterVCode')"
                placeholder-class="input-placeholder"
              />
            </div>
            <baseVCodeButton ref="vcodeRef" @get-code="getPhoneCode"/>
          </div>
        </div> -->
        <div class="inputBox mt-20">
          <p class="mt-5 mb-5 fw-b fs-14">{{ $t('verification.emailVerificationCode') }}:</p>
          <div class="flex items-center">
            <div class="flex items-center inputTemp mr-10">
              <image
                class="leftIcon mx-10"
                src="@/static/images/vCodeIcon.png"
              />
              <input
                v-model="emailVCode"
                class="flex-1 base-input"
                style="
                border: none;
                background-color: #F6F7FB;"
                :placeholder="$t('tips.enterVCode')"
                placeholder-class="input-placeholder"
              />
            </div>
            <baseVCodeButton ref="vcodeEmailRef" @get-code="getEmailCode"/>
          </div>
        </div>
        <div class="w-100 pt-25">
          <van-button class="w-100" type="primary" @click="nextFun">{{ $t('verification.next') }}</van-button>
        </div>
      </div>
      <div v-if="showTransactionPWD">
        <p class="fw-b fs-16">{{ $t('verification.transactionPassword') }}</p>
        <div class="flex outerBox mt-20">
          <input
            v-model="password"
            style="min-height: 45px;
            height: 45px;
            padding-left: 10px;
            border: 0px;
            border-radius: 5px;
            background-color: #F6F7FB;"
            class="flex-1 base-input"
            :placeholder="$t('tips.enterFundPassword')"
            :password="showPassword"
          />
          <text class="uni-icon flex justify-center items-center pr-5 right-icon">
            <van-icon name="eye" @click="changePassword"/>
          </text>
        </div>
        <div class="w-100 pt-25">
          <van-button class="w-100" type="primary" @click="withdrawFun">{{ $t('noun.withdraw') }}</van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import baseVCodeButton from '@/components/baseVCodeButton/index.vue';
import { sendmsg } from '@/api/account'
import { useUserStore } from '@/stores/user';

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const vcodeRef = ref()
const vcodeEmailRef = ref()
const userStore = useUserStore()
const userInfo = userStore.userInfo;
const showBottom = ref(false)
const userName = ref('') // 账号
const phonevCode = ref('') // 手机验证码
const emailVCode = ref('') // 邮箱验证码
const password = ref('') // 交易密码
const showPassword = ref(false) // 是否显示密码

const showVerifyTemp = ref(true) // 是否显示验证码输入框
const showTransactionPWD = ref(false) // 是否显示交易密码输入框

const emit = defineEmits<{
  (e: 'withdrawFun', payload: {phonevCode: any, emailVCode: any, password: any}): void
}>()

const  showFLoatingPanel = (data:any) => {
  showBottom.value = !showBottom.value
  showVerifyTemp.value = true
  showTransactionPWD.value = false
}

const nextFun = () => {
  if (showVerifyTemp.value) {
    showTransactionPWD.value = true
    showVerifyTemp.value = false
    return
  }
  if (showTransactionPWD.value) {
    showTransactionPWD.value = false
    showBottom.value = false
    return
  }
}

const changePassword = () => {
  showPassword.value = !showPassword.value 
}

const withdrawFun = () => {
  emit('withdrawFun', { phonevCode: phonevCode.value, emailVCode: emailVCode.value, password: password.value  })
}

const getPhoneCode = async () => {
  vcodeRef.value.startCountdown()
  const params = {
    sendMsgType: '', // 手机或者邮箱
    userName: userInfo.phone,
    countryCode: '',
  }
  await sendmsg(params)
  uni.showToast({
    title: t('tips.vCodeHasSent'),
    icon: 'none',
    duration: 3000
  })
}

const getEmailCode = async () => {
  vcodeEmailRef.value.startCountdown()
  const params = {
    sendMsgType: '', // 手机或者邮箱
    userName: userInfo.email,
    countryCode: '',
  }
  await sendmsg(params)
  uni.showToast({
    title: t('tips.vCodeHasSent'),
    icon: 'none',
    duration: 3000
  })
}


defineExpose({
  showFLoatingPanel
})

</script>
<style lang="scss" scoped>
.contentTemp {
  .inputTemp {
    background: #F6F7FB;
    border-radius: 5px;
    .leftIcon {
      width: 12.7px;
      height: 13.7px;
    }
  }
  .right-icon {
    background: #F6F7FB;
  }
}
</style>