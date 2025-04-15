<template>
  <div class="forGotPWDIndex">
    <div class="header w-100 fw-b text-center text-black fs-22 pt-15 pb-15">{{ $t('homeIndex.login.resetPassword') }}</div>
    <div class="inputBox-wrap">
      <div class="inputBox">
        <!-- <div class="inputTitle fw-b mb-5">{{ $t('common.account') }}</div> -->
        <div class="flex">
          <input
            v-model="userName"
            class="flex-1 base-input"
            style="
                border:none;
                background-color: #F6F7FB;"
            :placeholder="$t('homeIndex.login.emailOrPhone')"
            placeholder-class="input-placeholder"
          />
        </div>
      </div>

      <div v-if="showResetPassword" class="inputBox mt-20">
        <!-- <div class="inputTitle fw-b mb-5">{{ $t('common.vCode') }}</div> -->
        <div class="flex">
          <div class="flex flex-1 items-center inputTemp mr-10">
            <image
              class="leftIcon mx-10"
              src="@/static/images/vCodeIcon.png"
            />
            <input
              v-model="vCode"
              class="flex-1 base-input"
              style="
              border: none;
              background-color: #F6F7FB;"
              :placeholder="$t('tips.enterVCode')"
              placeholder-class="input-placeholder"
            />
          </div>
          <baseVCodeButton
            ref="vcodeRef"
            :disabled="!userName"
            @get-code="getCode"
          />
        </div>
      </div>

      <div v-if="showResetPassword" class="inputBox mt-20">
        <!-- <div class="inputTitle fw-b mb-5">{{ $t('common.password') }}</div> -->
        <div class="flex outerBox">
          <div class="flex flex-1 items-center inputTemp">
            <image
              class="leftPwdIcon mx-10"
              src="@/static/images/pwdIcon.png"
            />
            <input
              v-model="password"
              style="min-height: 45px;
              height: 45px;
              background: #fff;
              padding-left: 10px;
              border-radius: 5px;
              background-color: #F6F7FB;
              border: none;"
              class="flex-1"
              :placeholder="$t('tips.enterPassword')"
              :password="showPassword"
            />
          </div>
          <text class="uni-icon flex justify-center items-center pr-5 right-icon">
            <van-icon name="eye" @click="changePassword"/>
          </text>
        </div>
      </div>
    </div>

    <div class="w-100 mt-25">
      <van-button
        v-if="!showResetPassword"
        class="w-100"
        type="primary"
        @click="verifyAccount"
      >{{ $t('homeIndex.login.verifyAccount') }}</van-button>
      <van-button
        v-else
        class="w-100"
        type="primary"
        @click="resetPassword"
      >{{ $t('homeIndex.login.resetPassword') }}</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import baseVCodeButton from '@/components/baseVCodeButton/index.vue';
import { chkAccount, findpwd, sendmsg } from '@/api/account';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const vcodeRef = ref()
const userName = ref('');
const vCode = ref('');
const password = ref('');

const showPassword = ref(true);

const showResetPassword = ref(false);

const verifyAccount = async () => {
  if (!userName.value) return uni.showToast({ title: t('tips.enterAccount'), icon: 'none' })
  const params = {
    userName: userName.value,
  }
  const data = await chkAccount(params);
  showResetPassword.value = true;
}

const resetPassword = async () => {
  console.log('reset password')
  const data = await findpwd({
    username: userName.value,
    password: password.value,
    code: vCode.value
  })
  if(!data || !data.errMsg){
  	  uni.showToast({
  		title: t('tips.modifySuccess'),
  		icon: 'success'
  	  })
  	  setTimeout(() => {
  		uni.navigateTo({
  		    url: '/pages/login/index'
  		})
  	  }, 2000)
  }
}

const changePassword = () => {
  console.log('change password')
  showPassword.value = !showPassword.value
}

const getCode = async () => {
  vcodeRef.value.startCountdown()
  const params = {
    userName: userName.value,
    countryCode: '',
  }
  await sendmsg(params)
  uni.showToast({
    title: t('tips.vCodeHasSent'),
    icon: 'none'
  })
}

</script>

<style lang="scss" scoped>
.forGotPWDIndex {
  // background-color: #f8f8f8;
  height: 100vh;
  padding: 0 20px;
  .inputBox-wrap {
    margin-top: 60px;
    .inputBox {
      .outerBox {
        // border: 1px solid #d5d5d5;
        border-radius: 5px;
        .right-icon {
          background: #F6F7FB;
        }
      }
    }
    .inputTemp {
      background: #F6F7FB;
      border-radius: 5px;
      .leftPwdIcon {
        width: 13.5px;
        height: 13.5px;
      }
      .leftIcon {
        width: 12.7px;
        height: 13.7px;
      }
    }
  }
}
</style>