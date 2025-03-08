<template>
  <div class="login-index">
    <div class="pt-25">
      <van-icon class="animate__animated animate__rotateIn" name="cross" size="25" @click="goBack"/>
    </div>
    <div class="fs-24 mt-25 mb-25 fw-b">sign in to bybit</div>
    <div class="inputBox">
      <div class="inputTitle fw-b mb-5">Email</div>
      <input
        v-model="email"
        class="base-input"
        placeholder="eg: xxxx@gmail.com"
        placeholder-class="input-placeholder"
        @input="inputEmail"
      />
    </div>
    <div class="inputBox mt-20">
      <div class="inputTitle fw-b mb-5">Password</div>
      <div class="flex outerBox">
        <input
          v-model="password"
          style="min-height: 45px;
          height: 45px;
          background: #fff;
          padding-left: 10px;
          border-radius: 5px;"
          class="flex-1"
          placeholder="enter your password"
          :password="showPassword"
          @input="inputPassword"
        />
        <text class="uni-icon flex justify-center items-center pr-5 right-icon">
          <van-icon name="eye" @click="changePassword"/>
        </text>
      </div>
    </div>

    <div class="notes flex justify-between">
      <!-- 忘记密码 -->
      <div class="text-blue">Forgot password</div>
      <!-- 隐私政策 -->
      <div @click="goPrivacy" class="text-blue">Privacy policy</div>
    </div>

    <div class="signBtn">
      <van-button class="w-100" type="primary" @click="signIn">sign in</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const showPassword = ref(false)
const inputEmail =() => {
  console.log('input Email', email.value)
}

const inputPassword =() => {
  console.log('input Password', password.value)
}

const signIn = () => {
  console.log('sign in')
}

const goBack = () => {
  uni.navigateTo({
    url: '/pages/welcomPage/index'
  })
}

const goPrivacy = () => {
  console.log('这是隐私协议')

  // 暂时设置前往注册页面
  uni.navigateTo({
    url: '/pages/register/index'
  })
}

const changePassword = () => {
  console.log('change password')
  showPassword.value = !showPassword.value
}
</script>

<style lang="scss" scoped>
.login-index {
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
  .notes {
    margin-top: 40px;
  }
  .signBtn {
    width: 100%;
    margin-top: 60px;
  }
}
</style>