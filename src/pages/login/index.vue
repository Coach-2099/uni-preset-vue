<template>
  <div class="login-index">
    <!-- <div class="header w-100 fw-b text-center text-black fs-22 pt-15 pb-15">
      {{ $t('common.login') }}
    </div> -->
    <div class="logoTemp w-100 flex justify-center items-center">
      <image
        src="/static/images/logo-text.png"
        mode="scaleToFill"
      />
    </div>

    <div class="inputBox-wrap">
      <div class="inputBox">
        <input
          v-model="account"
          class="base-input"
          style="border: none;"
          :placeholder="$t('homeIndex.login.emailOrPhone')"
          placeholder-class="input-placeholder"
        />
      </div>
      <div class="inputBox mt-20">
        <div class="flex outerBox">
          <input
            v-model="password"
            style="min-height: 45px;
            height: 45px;
            padding-left: 10px;
            border: 0px;
            border-radius: 5px;"
            class="flex-1 base-input"
            :placeholder="$t('tips.enterPassword')"
            :password="showPassword"
          />
          <text class="uni-icon flex justify-center items-center pr-5 right-icon">
            <van-icon name="eye" @click="changePassword"/>
          </text>
        </div>
      </div>
    </div>

    <div class="notes flex justify-between">
      <!-- 忘记密码 -->
      <div @click="goForgotPWD" class="text-blue">{{ $t('common.forgetPassword') }}</div>
      <!-- 隐私政策 -->
      <!-- <div @click="goPrivacy" class="text-blue">{{ $t('common.privacypolicy') }}</div> -->
      <!-- 前往注册 -->
      <div @click="goRegister" class="text-blue">{{ $t('common.goToRegister') }}</div>
    </div>

    <div class="signBtn">
      <van-button class="w-100" type="primary" @click="signIn">{{ $t('common.login') }}</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { accountLogin } from '@/api/account';
import { useUserStore } from '@/stores/user';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const userStore = useUserStore();

const account = ref('');
const password = ref('');
const showPassword = ref(true)


const signIn = async () => {
  console.log('sign in')
  if (!account.value) return uni.showToast({ title: t('tips.enterAccount'), icon: 'none' })
  if (!password.value) return uni.showToast({ title: t('tips.enterPassword'), icon: 'none' })
  const params = {
    username: account.value,
    password: password.value,
  }
  const data = await accountLogin(params)
  console.log('data', data)
  if (data) {
    loginHandle(data) 
  }
}

const loginHandle = async (data: any) => {
  const { access_token } = data
  userStore.login(access_token)
  await userStore.getUser()
  await userStore.getCustomerServiceFun()
  uni.switchTab({ url: '/pages/home/index' })
}

const goBack = () => {
  uni.navigateTo({
    url: '/pages/welcomPage/index'
  })
}

const goRegister = () => {
  uni.navigateTo({
    url: '/pages/register/index'
  })
}

const goPrivacy = () => {
  console.log('这是隐私协议')
}

const goForgotPWD = () => {
  console.log('忘记密码')
  uni.navigateTo({
    url: '/pages/forGotPWD/index'
  })
}

const changePassword = () => {
  console.log('change password')
  showPassword.value = !showPassword.value
}
</script>

<style lang="scss" scoped>
.login-index {
  height: 100vh;
  padding: 0 20px;
  .logoTemp {
    padding-top: 30%;
    image {
      width: 100px;
      height: 120px;
    }
  }
  .inputBox {
    .outerBox {
      // border: 1px solid #d5d5d5;
      border: none;
      border-radius: 5px;
      .right-icon {
        background: var(--color-background-box);
      }
    }
  }
  .inputBox-wrap {
    margin-top: 20%;
  }
  .base-input {
    background: var(--color-background-box);
  }
  .notes {
    margin-top: 30px;
  }
  .signBtn {
    width: 100%;
    margin-top: 60px;
  }
}
</style>