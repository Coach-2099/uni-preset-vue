<template>
  <div class="forGotPWDIndex">
    <div class="fs-24 pt-25 pb-25 fw-b">重置密码</div>

    <div class="inputBox">
      <div class="inputTitle fw-b mb-5">{{ $t('common.account') }}</div>
      <div class="flex">
        <input
          v-model="userName"
          class="flex-1 base-input"
          :placeholder="$t('homeIndex.login.emailOrPhone')"
          placeholder-class="input-placeholder"
        />
      </div>
    </div>

    <div v-if="showResetPassword" class="inputBox mt-20">
      <div class="inputTitle fw-b mb-5">{{ $t('common.vCode') }}</div>
      <div class="flex">
        <input
          v-model="vCode"
          class="flex-1 base-input"
          :placeholder="$t('tips.enterVCode')"
          placeholder-class="input-placeholder"
        />
        <baseVCodeButton 
          :disabled="!userName"
          @get-code="getCode"
        />
      </div>
    </div>

    <div v-if="showResetPassword" class="inputBox mt-20">
      <div class="inputTitle fw-b mb-5">{{ $t('common.password') }}</div>
      <div class="flex outerBox">
        <input
          v-model="password"
          style="min-height: 45px;
          height: 45px;
          background: #fff;
          padding-left: 10px;
          border-radius: 5px;"
          class="flex-1"
          :placeholder="$t('tips.enterPassword')"
          :password="showPassword"
        />
        <text class="uni-icon flex justify-center items-center pr-5 right-icon">
          <van-icon name="eye" @click="changePassword"/>
        </text>
      </div>
    </div>

    <div class="w-100 mt-25">
      <van-button
        v-if="!showResetPassword"
        class="w-100"
        type="primary"
        @click="verifyAccount"
      >验证账号</van-button>
      <van-button
        v-else
        class="w-100"
        type="primary"
        @click="resetPassword"
      >重置密码</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import baseVCodeButton from '@/components/baseVCodeButton/index.vue';
import { chkAccount, findpwd } from '@/api/account';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const userName = ref('');
const vCode = ref('');
const password = ref('');

const showPassword = ref(false);

const showResetPassword = ref(false);

const verifyAccount = async () => {
  if (!userName.value) return uni.showToast({ title: t('tips.enterAccount'), icon: 'none' })
  const data = await chkAccount(userName.value);
  showResetPassword.value = true;
}

const resetPassword = async () => {
  console.log('reset password')
  const data = await findpwd({
    username: userName.value,
    password: password.value,
    code: vCode.value
  })
  console.log('data: ', data)
}

const changePassword = () => {
  console.log('change password')
  showPassword.value = !showPassword.value
}

</script>

<style lang="scss" scoped>
.forGotPWDIndex {
  background-color: #f8f8f8;
  height: 100vh;
  padding: 0 20px;
  .inputBox {
    .outerBox {
      border: 1px solid #d5d5d5;
      border-radius: 5px;
      .right-icon {
        background: #fff;
      }
    }
  }
}
</style>