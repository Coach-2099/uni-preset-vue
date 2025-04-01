<template>
  <div class="register-index">
    <!-- <div class="pt-25">
      <van-icon class="animate__animated animate__rotateIn" name="cross" size="25" @click="goBack"/>
    </div> -->
    <div class="fs-24 pt-25 pb-25 fw-b">{{ $t('homeIndex.login.registerIn') }}</div>
    <van-tabs
      v-moiphonedel:active="active"
      background="#f8f8f8"
      shrink
      @click-tab="onClickTab"
    >
      <van-tab title="phone">
        <div class="inputBox mt-20">
          <div class="inputTitle fw-b mb-5">{{ $t('common.phone') }}</div>
          <div class="flex">
            <div class="countryBox">
              <van-button type="default" style="width: 60px;" @click="checkCountryFun">
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
              v-model="userName"
              class="flex-1 base-input"
              :placeholder="$t('tips.enterPhone')"
              placeholder-class="input-placeholder"
            />
          </div>
        </div>
        <div class="inputBox mt-20">
          <div class="inputTitle fw-b mb-5">{{ $t('common.vCode') }}</div>
          <div class="flex outerCodeBox">
            <input
              v-model="vCode"
              class="flex-1 base-input"
              :placeholder="$t('tips.enterVCode')"
              placeholder-class="input-placeholder"
              @input="inputPhoneCode"
            />
            <baseVCodeButton 
              :disabled="!userName"
              @get-code="getCode"
            />
            <!-- <div class="codeBtnBox ml-5">
              <van-button @click="getCode" type="primary">{{ $t('common.getVCode') }}</van-button>
            </div> -->
          </div>
        </div>
      </van-tab>
      <van-tab title="email">
        <div class="inputBox mt-20">
          <div class="inputTitle fw-b mb-5">{{ $t('common.email') }}</div>
          <div class="flex">
            <input
              v-model="userName"
              class="flex-1 base-input"
              placeholder="eg: xxxx@gmail.com"
              placeholder-class="input-placeholder"
              @input="inputPhone"
            />
          </div>
        </div>
        <div class="inputBox mt-20">
          <div class="inputTitle fw-b mb-5">{{ $t('common.vCode') }}</div>
          <div class="flex outerCodeBox">
            <input
              v-model="vCode"
              class="flex-1 base-input"
              :placeholder="$t('tips.enterVCode')"
              placeholder-class="input-placeholder"
              @input="inputPhoneCode"
            />
            <baseVCodeButton 
              :disabled="!userName"
              @get-code="getCode"
            />
          </div>
        </div>

      </van-tab>
    </van-tabs>

    <div class="inputBox mt-20">
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
          @input="inputPassword"
        />
        <text class="uni-icon flex justify-center items-center pr-5 right-icon">
          <van-icon name="eye" @click="changePassword"/>
        </text>
      </div>
    </div>

    <div class="inputBox mt-20 animate__animated animate__headShake">
      <div class="inputTitle fw-b mb-5 text-red">{{ $t('common.iCode') }}*</div>
      <input
        v-model="InvitationCode"
        class="flex-1 base-input "
        :placeholder="$t('tips.enterICode')"
        :disabled="urlInviteCode"
        placeholder-class="input-placeholder"
        @input="inputInvitationCode"
      />
    </div>

    <div class="mt-25">
      <van-button class="w-100" type="primary" @click="signUp">{{ $t('common.register') }}</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { chkAccount, sendmsg, register } from '@/api/account'
import { getUrlParams } from '@/utils/util'
import baseVCodeButton from '@/components/baseVCodeButton/index.vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const active = ref(0)
const showPicker = ref(false)
const countryCode = ref('86')
const pickVal = ref<number[]>([])
const checkCountry = ref({ value: '86', text: 'China +86', name: 'CN', flag: '/static/images/flags/CN.png' })

// 使用 ref 创建响应式数据
const countryCodeArray = [
  { value: '1', text: 'USA +1', name: 'USA', flag: '/static/images/flags/US.png' },
  { value: '81', text: 'Japan +81', name: "JP", flag: '/static/images/flags/JP.png' },
  { value: '82', text: 'Korea +82', name: 'KR', flag: '/static/images/flags/KR.png' },
  { value: '86', text: 'China +86', name: 'CN', flag: '/static/images/flags/CN.png' },
  { value: '852', text: 'Hong Kong +852', name: 'HK', flag: '/static/images/flags/HK.png' },
  { value: '886', text: 'Taiwan +886', name: 'TW', flag: '/static/images/flags/TW.png' }
];

const email = ref('')
const emailCode = ref('')

const phone = ref()

const userName = ref()
const vCode = ref('')



const password = ref()

const InvitationCode = ref()

const showPassword = ref(true)

const urlInviteCode = ref('')

onMounted(() => {
  const params = getUrlParams()
  urlInviteCode.value = params.inviteCode
  InvitationCode.value = params.inviteCode
})

// 获取验证码
const getCode = async () => {
  if (!userName.value) return uni.showToast({ title: t('tips.enterAccount'), icon: 'none' })
  const params = {
    sendMsgType: '', // 手机或者邮箱
    userName: userName.value,
    countryCode: countryCode.value,
  }
  await sendmsg(params)
  uni.showToast({
    title: t('tips.vCodeHasSent'),
    icon: 'none',
    duration: 3000
  })
}

const goBack = () => {
  uni.navigateTo({
    url: '/pages/welcomPage/index'
  })
}

const onClickTab = (e: any) => {
  console.log('e: ', e)
  userName.value = ''
  active.value = e.name
}

const inputPhone = () => {
  console.log('userName', userName.value)
}


// 检查手机号-帐号-邮箱是否存在
const checkAccount = async () => {
  const data = await chkAccount(userName.value);
  // 如果后续需要使用 data，可以在这里添加相应逻辑
  console.log('data', data);
};

const inputPhoneCode = () => {
  console.log('vCode', vCode.value)
}

const inputInvitationCode = () => {
  console.log('InvitationCode', InvitationCode.value)

}

const checkCountryFun = () => {
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
  checkCountry.value = selectedOptions[0];
  console.log('checkCountry:', checkCountry.value)
  // 修复类型错误，将 pickVal 的类型定义为 number[]
  pickVal.value = selectedValues;
  showPicker.value = false;
}

const signUp = async () => {
  const params = {
    username: userName.value ,
    password: password.value,
    countryName: '',
    countryCode: '',
    // countryName: checkCountry.value.name,
    // countryCode: checkCountry.value.value,
    code: '111111',
    inviteCode: InvitationCode.value
  }
  const data = await register(params)
  console.log('data', data)
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