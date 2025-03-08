<template>
  <div class="register-index">
    <div class="pt-25">
      <van-icon class="animate__animated animate__rotateIn" name="cross" size="25" @click="goBack"/>
    </div>
    <div class="fs-24 mt-25 mb-25 fw-b">register in bybit</div>
    <!-- <div class="inputBox">
      <div class="inputTitle fw-b mb-5">Email</div>
      <input
        v-model="email"
        class="base-input"
        placeholder="eg: xxxx@gmail.com"
        placeholder-class="input-placeholder"
        @input="inputPhone"
      />
    </div> -->
    <van-tabs v-moiphonedel:active="active" background="#f8f8f8" shrink>
      <van-tab title="phone">
        <div class="inputBox mt-20">
          <div class="inputTitle fw-b mb-5">Phone</div>
          <div class="flex">
            <div class="countryBox">
              <van-button type="default" style="width: 60px;" @click="checkCountry">
                <template #default>
                  +{{ countryCode }}
                </template>
              </van-button>

              <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
                <van-picker
                  :columns="countryCodeArray"
                  :model-value="pickVal"
                  @confirm="onConfirm"
                  @cancel="showPicker = false"
                >
                  <template #option="option">
                    <img :src="option.flag" alt="flag" style="width: 25px; height: 18px; margin-right: 5px;" />
                    {{ option.text }}
                  </template>
                </van-picker>
              </van-popup>
            </div>
            <input
              v-model="phone"
              class="flex-1 base-input"
              placeholder="enter phone number"
              placeholder-class="input-placeholder"
              @input="inputPhone"
            />
          </div>
        </div>
        <div class="inputBox mt-20">
          <div class="inputTitle fw-b mb-5">code</div>
          <div class="flex outerCodeBox">
            <input
              v-model="phoneCode"
              class="flex-1 base-input"
              placeholder="phone number code"
              placeholder-class="input-placeholder"
              @input="inputPhoneCode"
            />
            <div class="codeBtnBox ml-5">
              <van-button type="primary">获取验证码</van-button>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="email">
        <div class="inputBox mt-20">
          <div class="inputTitle fw-b mb-5">Email</div>
          <input
            v-model="email"
            class="base-input"
            placeholder="eg: xxxx@gmail.com"
            placeholder-class="input-placeholder"
            @input="inputPhone"
          />
        </div>
        <div class="inputBox mt-20">
          <div class="inputTitle fw-b mb-5">Code</div>
          <div class="flex outerCodeBox">
            <input
              v-model="phoneCode"
              class="flex-1 base-input"
              placeholder="phone number code"
              placeholder-class="input-placeholder"
              @input="inputPhoneCode"
            />
            <div class="codeBtnBox ml-5">
              <van-button type="primary">获取验证码</van-button>
            </div>
          </div>
        </div>

      </van-tab>
    </van-tabs>

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

    <div class="inputBox mt-20 animate__animated animate__headShake">
      <div class="inputTitle fw-b mb-5 text-red">Invitation Code*</div>
      <input
        v-model="InvitationCode"
        class="flex-1 base-input "
        placeholder="phone number code"
        placeholder-class="input-placeholder"
        @input="inputInvitationCode"
      />
    </div>

    <div class="mt-25">
      <van-button class="w-100" type="primary" @click="signUp">sign up</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { ref } from 'vue'

const active = ref(0)
const showPicker = ref(false)
const countryCode = ref(86)
const pickVal = ref([])

// 使用 ref 创建响应式数据
const countryCodeArray = [
  { value: 1, text: 'USA +1', flag: '/static/images/flags/US.png' },
  { value: 81, text: 'Japan +81', flag: '/static/images/flags/JP.png' },
  { value: 82, text: 'Korea +82', flag: '/static/images/flags/KR.png' },
  { value: 86, text: 'China +86', flag: '/static/images/flags/CN.png' },
  { value: 852, text: 'Hong Kong +852', flag: '/static/images/flags/HK.png' },
  { value: 886, text: 'Taiwan +886', flag: '/static/images/flags/TW.png' }
];

const email = ref('')
const emailCode = ref('')

const phone = ref()
const phoneCode = ref()

const password = ref()

const InvitationCode = ref()

const showPassword = ref(false)

const goBack = () => {
  uni.navigateTo({
    url: '/pages/welcomPage/index'
  })
}

const inputPhone = () => {
  console.log('phone', phone.value)
}

const inputPhoneCode = () => {
  console.log('phoneCode', phoneCode.value)
}

const inputInvitationCode = () => {
  console.log('InvitationCode', InvitationCode.value)

}

const checkCountry = () => {
  console.log('选择区号')
  showPicker.value = true
}

const inputPassword = () => {
  console.log('输入密码')
}

const changePassword = () => {
  console.log('change password')
  showPassword.value = !showPassword.value
}

interface PickerConfirmEvent {
  selectedValues: number[];
  selectedOptions: { value: number; text: string }[];
}

const onConfirm = ({ selectedValues, selectedOptions }: PickerConfirmEvent) => {
  console.log('selectedValues', selectedValues);
  console.log('selectedOptions', selectedOptions[0]);
  countryCode.value = selectedOptions[0].value;
  pickVal.value = selectedValues;
  showPicker.value = false;
  console.log('countryCode', countryCode.value)
}

const signUp = () => {
  console.log('sign up')
}

</script>

<style lang="scss" scoped>
.register-index {
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
    .countryBox {
      // width: 200px;
    }
    .outerCodeBox {
      .codeBtnBox {

      }
    }
  }
}
</style> 