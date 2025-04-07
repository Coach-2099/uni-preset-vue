<template>
  <div class="register-index">
    <!-- <div class="header w-100 fw-b text-center text-black fs-22 pt-15 pb-15">{{ $t('homeIndex.login.registerIn') }}</div> -->
    <div class="logoTemp w-100 flex justify-center items-center">
      <image
        src="/static/images/logo-text.png"
        mode="scaleToFill"
      />
    </div>

    <div class="register-form">
      <van-tabs
        v-moiphonedel:active="active"
        shrink
        @click-tab="onClickTab"
      >
        <van-tab title="Email">
          <div class="inputBox mt-20">
            <div class="flex items-center inputTemp">
              <image
                class="leftEmailIcon mx-10"
                src="@/static/images/emailIcon.png"
              />
              <input
                v-model="userName"
                class="flex-1 base-input"
                style="
                  border:none;
                  background-color: #F6F7FB;"
                placeholder="eg: xxxx@gmail.com"
                placeholder-class="input-placeholder"
                @input="inputPhone"
              />
            </div>
          </div>
        </van-tab>
        <van-tab title="Phone">
          <div class="inputBox mt-20">
            <!-- <div class="inputTitle fw-b mb-5">{{ $t('common.phone') }}</div> -->
            <div class="flex">
              <div class="countryBox mr-10">
                <van-button type="default" style="width: 90px;background-color: #F6F7FB;border: none;" @click="checkCountryFun">
                  <template #default>
                    <div class="flex items-center inputTemp">
                      <image
                        class="leftPhoneIcon mx-10"
                        src="@/static/images/phoneIcon.png"
                      />
                      <div>+{{ countryCode }}</div>
                      <image
                        class="rightDownIcon mx-10"
                        src="@/static/images/down.png"
                      />
                    </div>
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
                style="background-color: #F6F7FB;border: none;"
                :placeholder="$t('tips.enterPhone')"
                placeholder-class="input-placeholder"
              />
            </div>
          </div>
        </van-tab>
      </van-tabs>

      <div class="inputBox mt-20">
        <div class="flex outerCodeBox">
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
              @input="inputPhoneCode"
            />
          </div>
          <baseVCodeButton
            ref="vcodeRef"
            :disabled="!userName"
            @get-code="getCode"
          />
        </div>
      </div>

      <div class="inputBox mt-20">
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
              border: none;
              padding-left: 10px;
              border-radius: 5px;
              background-color: #F6F7FB;"
              class="flex-1"
              :placeholder="$t('tips.enterPassword')"
              :password="showPassword"
              @input="inputPassword"
            />
          </div>
          <text class="uni-icon flex justify-center items-center pr-5 right-icon">
            <van-icon name="eye" @click="changePassword"/>
          </text>
        </div>
      </div>

      <div class="inputBox mt-20 animate__animated animate__headShake">
        <!-- <div class="inputTitle fw-b mb-5 text-red">{{ $t('common.iCode') }}*</div> -->
        <div class="flex flex-1 items-center inputTemp">
          <image
            class="leftIcodeIcon mx-10"
            src="@/static/images/ICodeIcon.png"
            mode="scaleToFill"
          />
          <input
            v-model="InvitationCode"
            style="
              background-color: #F6F7FB;
              border: none;"
            class="flex-1 base-input"
            placeholder-style="color: #FF3E47" 
            :placeholder="$t('tips.enterICode')"
            :disabled="urlInviteCode"
            placeholder-class="input-placeholder"
            @input="inputInvitationCode"
          />
        </div>
      </div>
    </div>

    <div class="notes flex justify-end mt-10">
      <div>{{ $t('common.hasAccount') }}</div>
      <div @click="goLogin" class="text-blue">{{ $t('common.goLogin') }}</div>
    </div>

    <div class="my-25">
      <van-button class="w-100" type="primary" @click="signUp">{{ $t('common.register') }}</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { chkAccount, sendmsg, register } from '@/api/account'
import { getUrlParams, isEmail } from '@/utils/util'
import baseVCodeButton from '@/components/baseVCodeButton/index.vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const active = ref(0)
const showPicker = ref(false)
const countryCode = ref('1')
const pickVal = ref<number[]>([])
const checkCountry = ref({ value: '1', text: 'USA +1', name: 'USA', flag: '/static/images/flags/US.png' })

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

const vcodeRef = ref()

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
  vcodeRef.value.startCountdown()
  const params = {
    sendMsgType: '', // 手机或者邮箱
    userName: userName.value,
    countryCode: isEmail(userName.value)?'':countryCode.value,
  }
  await sendmsg(params)
  uni.showToast({
    title: t('tips.vCodeHasSent'),
    icon: 'none',
    duration: 3000
  })
}

const goLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
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
    countryCode: isEmail(userName.value)?'':countryCode.value,
    // countryName: checkCountry.value.name,
    // countryCode: checkCountry.value.value,
    code: vCode.value,
    inviteCode: InvitationCode.value
  }
  const data = await register(params)
  if(!data || !data.errMsg){
	  uni.showToast({
	  		title: t('tips.registerSuccess'),
	  		icon: 'success'
	  })
	  setTimeout(() => {
	  		goLogin()
	  }, 2000)
  }
}

</script>

<style lang="scss" scoped>
.register-index {
  // background-color: #f8f8f8;
  height: 100vh;
  padding: 0 20px;
  .logoTemp {
    padding-top: 20%;
    image {
      width: 100px;
      height: 120px;
    }
  }
  .register-form {
    margin-top: 20%;
    .inputBox {
      .outerBox {
        border: none;
        border-radius: 8px;
        .right-icon {
          background: #F6F7FB;
        }
      }
      .countryBox {
        // width: 200px;
      }
      .outerCodeBox {
        .codeBtnBox {
  
        }
      }
      .inputTemp {
        // border: 1px solid #d5d5d5;
        background: #F6F7FB;
        border-radius: 5px;
        .leftIcon {
          width: 12.7px;
          height: 13.7px;
        }
        .leftEmailIcon {
          width: 13.5px;
          height: 9.93px;
        }
        .leftPwdIcon {
          width: 13.5px;
          height: 13.5px;
        }
        .leftIcodeIcon {
          width: 14px;
          height: 13.5px;
        }
        .leftPhoneIcon {
          width: 13.9px;
          height: 13.5px;
        }
        .rightDownIcon {
          width: 7px;
          height: 5px;
        }
      }
    }
  }
  .notes {
    // margin-top: 10%;
  }
}
</style> 