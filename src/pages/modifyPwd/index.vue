<template>
  <div class="modifyPwd-index">
    <navigationBar title="修改密码"></navigationBar>
    <div class="inputTemp mt-25 px-20">

      <van-tabs v-moiphonedel:active="active" shrink>
        <van-tab title="phone">
          <div class="mt-20">
            <div class="flex justify-between items-center">
              <p class="fs-14 text-black">手机</p>
            </div>
            <div class="baseInput mt-5 flex justify-between items-center">
              <input
                v-model="phone"
                class="myInput flex-1 px-10 py-10 w-100"
                placeholder="enter your password"
                @input="inputPassword"
              />
              <div class="codeBtnBox ml-5" @click="getCode">
                <van-button type="primary">获取验证码</van-button>
                <van-button v-if="false" type="primary" disabled>{{  countdown  }}</van-button>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="email">
          <div class="mt-20">
            <div class="flex justify-between items-center">
              <p class="fs-14 text-black">email</p>
            </div>
            <div class="baseInput mt-5 flex justify-between items-center">
              <input
                v-model="email"
                class="myInput flex-1 px-10 py-10 w-100"
                placeholder="enter your password"
                @input="inputPassword"
              />
              <div class="codeBtnBox ml-5" @click="getCode">
                <van-button type="primary">获取验证码</van-button>
                <van-button v-if="false" type="primary" disabled>{{  countdown  }}</van-button>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <div class="mt-15">
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">验证码</p>
        </div>
        <div class="baseInput mt-5 flex justify-between items-center">
          <input
            v-model="phoneCode"
            class="myInput flex-1 px-10 py-10 w-100"
            placeholder="enter your password"
            @input="inputPassword"
          />
        </div>
      </div>
      <div class="mt-15">
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">密码</p>
        </div>
        <div class="baseInput mt-5 flex justify-between items-center">
          <input
            v-model="password"
            class="myInput flex-1 px-10 py-10 w-100"
            placeholder="enter your password"
            :password="showPassword"
            @input="inputPassword"
          />
          <text class="uni-icon flex justify-center items-center pr-5 right-icon">
            <van-icon name="eye" @click="changePassword"/>
          </text>
        </div>
      </div>
      <!-- <div class="mt-10">
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">旧密码</p>
        </div>
        <div class="baseInput mt-5 flex justify-between items-center">
          <input
            v-model="password"
            class="myInput flex-1 px-10 py-10 w-100"
            placeholder="enter your password"
            :password="showPassword"
            @input="inputPassword"
          />
        </div>
      </div> -->
    </div>
    <div class="btnBox bg-white w-100 pos-fixed">
      <van-button
        class="confirmBtn w-100 fw-b fs-20"
        type="primary"
        @click="confirmFun"
      >confirm</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';
import { sendmsg, updatepwd } from '@/api/account'

const showPassword = ref(false);
const phone = ref('');
const email = ref('');

const phoneCode = ref('');
const password = ref('')
const countdown = ref(60)

const active = ref(0)

const changePassword = () => {
  showPassword.value = !showPassword.value
}

const inputPassword = () => {
  console.log(password.value);
}

const getCode = async () => {
  if (!phone.value) return uni.showToast({ title: '请输入手机号', icon: 'none' })
  const params = {
    sendMsgType: '', // 手机或者邮箱
    userName: phone.value,
    // countryCode: countryCode.value,
  }
  await sendmsg(params)
  uni.showToast({
    title: '验证码已发送,请查收',
    icon: 'none'
  })
}

const confirmFun = async () => {
  const params = {
    username: phone.value,
    password: password.value,
    code: phoneCode.value
  }
  await updatepwd(params)
  uni.showToast({
    title: '修改成功,3s后前往登录',
    icon: 'none',
    duration: 3000,
    mask: true
  })
  setTimeout(() => {
    uni.navigateTo({
      url: '/pages/login/index' 
    })
  }, 3000)
}

</script>

<style lang="scss" scoped>
.modifyPwd-index {
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