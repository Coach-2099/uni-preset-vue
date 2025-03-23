<template>
  <div class="modifyEmail-index">
    <navigationBar title="修改邮箱"></navigationBar>
    <div class="inputTemp mt-25 px-20">
      <div>
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">邮箱</p>
        </div>
        <div class="baseInput mt-5 flex justify-between items-center">
          <input
            v-model="password"
            class="myInput flex-1 px-10 py-10 w-100"
            placeholder="enter your password"
            @input="inputPassword"
          />
          <div class="codeBtnBox ml-5" @click="getCode">
            <van-button type="primary">获取验证码</van-button>
          </div>
        </div>
      </div>
      <div class="mt-10">
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">验证码</p>
        </div>
        <div class="baseInput mt-5 flex justify-between items-center">
          <input
            v-model="password"
            class="myInput flex-1 px-10 py-10 w-100"
            placeholder="enter your password"
            @input="inputPassword"
          />
        </div>
      </div>
      <div class="mt-10">
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
      <div class="mt-10">
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
      </div>
    </div>
    <div class="btnBox bg-white w-100 pos-fixed">
      <van-button
        class="confirmBtn w-100 fw-b fs-20"
        type="primary"
      >confirm</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';

const showPassword = ref(false);
const password = ref('')

const changePassword = () => {
  showPassword.value = !showPassword.value
}

const inputPassword = () => {
  console.log(password.value);
}

const getCode = () => {
  console.log('获取验证码');
}


</script>

<style lang="scss">
.modifyEmail-index {
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
        min-height: 52px;
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