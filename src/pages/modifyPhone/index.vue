<template>
  <div class="modifyPhone-index">
    <navigationBar title="绑定手机"></navigationBar>
    <div class="inputBox mt-25 px-20">
      <div>
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">{{ $t('common.phone') }}</p>
        </div>
        <div class="flex">
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
          </div>
          <div class="baseInput w-100 flex justify-between items-center">
            <input
              v-model="phone"
              class="myInput flex-1 px-10 py-10 w-100"
              :placeholder="$t('tips.enterPhone')"
            />
          </div>
        </div>
      </div>
      <div class="mt-10">
        <div class="flex justify-between items-center">
          <p class="fs-14 text-black">{{ $t('common.vCode') }}</p>
        </div>
        <div class="baseInput mt-5 flex justify-between items-center">
          <input
            v-model="vCode"
            class="myInput flex-1 px-10 py-10 w-100 mr-10"
            :placeholder="$t('tips.enterVCode')"
          />
          <baseVCodeButton
            ref="vcodeRef"
            :disabled="!phone"
            @get-code="getCode"
          />
        </div>
      </div>
    </div>
    <div class="btnBox bg-white w-100 pos-fixed">
      <van-button
        class="confirmBtn w-100 fw-b fs-20"
        type="primary"
        @click="confirm"
      >{{ $t('common.confirm') }}</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';
import baseVCodeButton from '@/components/baseVCodeButton/index.vue';
import { sendmsg } from '@/api/account'
import { bindPhoneOrEmail } from '@/api/user'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const vcodeRef = ref()
const phone = ref('')
const vCode = ref('')
const countryCode = ref('86')
const showPicker = ref(false)
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


const getCode = async () => {
  vcodeRef.value.startCountdown()
  const params = {
    sendMsgType: '', // 手机或者邮箱
    userName: phone.value,
    countryCode: countryCode.value,
  }
  await sendmsg(params)
  uni.showToast({
    title: t('tips.vCodeHasSent'),
    icon: 'none'
  })
}

const confirm = async () => {
  if (!phone.value) {
    return uni.showToast({ title: t('tips.enterEmail'), icon: 'none' })
  }
  if (!vCode.value) {
    return uni.showToast({ title: t('tips.enterVCode'), icon: 'none' })
  }
  const params = {
    userName: phone.value,
    msgCode: vCode.value,
    countryCode: countryCode.value,
  }
  await bindPhoneOrEmail(params)
  uni.showToast({
    title: t('tips.bindSuccess'),
    icon: 'none'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}

const checkCountryFun = () => {
  showPicker.value = true
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
  // 修复类型错误，将 pickVal 的类型定义为 number[]
  pickVal.value = selectedValues;
  showPicker.value = false;
}

</script>

<style lang="scss">
.modifyPhone-index {
  .inputBox {
    padding-bottom: 100px;
    .baseInput {
      .myInput {
        min-height: 45px;
        background: #F6F7FB;
        border-radius: 8px 8px 8px 8px;
      }
      .rightText {
        background: #F6F7FB;
        min-height: 45px;
        line-height: 45px;
        margin-left: -5px;
        border-radius: 0px 8px 8px 0px;
      }
      .right-icon {
        min-height: 45px;
        margin-left: -5px;
        background: #F6F7FB;
      }
    }
    .countryBox {
      .inputTemp {
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