<template>
  <div class="modifyEmail-index">
    <navigationBar title="绑定邮箱"></navigationBar>
    <div v-if="showEnterVcode" class="myEnterVcode">
      <van-password-input
        :value="vCode"
        :mask="false"
        :focused="true"
        :length="6"
        :gutter="10"
        @focus="showKeyboard = true"
      />
      <!-- 数字键盘 -->
      <van-number-keyboard
        v-model="vCode"
        :show="showKeyboard"
        @blur="showKeyboard = false"
      />
      <!-- showKeyboard = false -->
    </div>
    <div v-else>
      <div class="inputTemp mt-25 px-20">
        <div>
          <div class="flex justify-between items-center">
            <!-- <p class="fs-14 text-black">邮箱</p> -->
          </div>
          <div class="baseInput mt-5 flex justify-between items-center">
            <input
              v-model="email"
              class="myInput flex-1 px-10 py-10 w-100"
              :placeholder="$t('tips.enterEmail')"
            />
          </div>
        </div>
        <!-- <div class="mt-10">
          <div class="flex justify-between items-center">
            <p class="fs-14 text-black">验证码</p>
          </div>
          <div class="baseInput mt-5 flex justify-between items-center">
            <input
              v-model="vCode"
              class="myInput flex-1 px-10 py-10 w-100 mr-10"
              :placeholder="$t('tips.enterVCode')"
            />
            <baseVCodeButton
              ref="vcodeRef"
              :disabled="!email"
              @get-code="getCode"
            />
          </div>
        </div> -->
      </div>
      <div class="btnBox bg-white w-100 pos-fixed">
        <van-button
          class="confirmBtn w-100 fw-b fs-20"
          type="primary"
          @click="confirm"
        >确 认</van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';
import baseVCodeButton from '@/components/baseVCodeButton/index.vue';
import { sendmsg } from '@/api/account'
import { useUserStore } from '@/stores/user';
import { bindPhoneOrEmail } from '@/api/user'
import { useI18n } from 'vue-i18n'
import { onShow } from '@dcloudio/uni-app';
const { t } = useI18n()

const showKeyboard = ref(true);
const showEnterVcode = ref(true) // 是否显示验证码输入 fiel
const userStore = useUserStore();
const userInfo = ref(); // 用户信息 re
const vcodeRef = ref()
const vCode = ref('')
const email = ref('')

// 添加监听器
watch(() => vCode.value, (newVal) => {
  if (newVal.length === 6) {
    // confirm() // 当验证码长度为6时自动触发确认方法
    showKeyboard.value = false
    verifyVcode()
  }
})


onMounted(() => {
  getCode()
})

const getCode = async () => {
  userInfo.value = userStore.userInfo;
  console.log('userInfo.value', userInfo.value)
  const params = {
    sendMsgType: '', // 手机或者邮箱
    userName: userInfo.value.username, // 手机号或者邮箱,
    // countryCode: countryCode.value,
  }
  await sendmsg(params)
  uni.showToast({
    title: t('tips.vCodeHasSent'),
    icon: 'none'
  })
}

const verifyVcode = () => {
  console.log('此处校验验证码是否正确')
  showEnterVcode.value = false
}

const confirm = async () => {
  if (!email.value) {
    return uni.showToast({ title: t('tips.enterEmail'), icon: 'none' })
  }
  if (!vCode.value) {
    return uni.showToast({ title: t('tips.enterVCode'), icon: 'none' })
  }
  const params = {
    userName: email.value,
    msgCode: vCode.value,
    countryCode: ''
  }
  await bindPhoneOrEmail(params)
  uni.showToast({
    title: t('tips.bindSuccess'),
    icon: 'none'
  })
  await userStore.getUser()
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}


</script>

<style lang="scss" scoped>
.modifyEmail-index {
  .myEnterVcode {
    margin-top: 30px;
    :deep(.van-password-input__security) {
      .van-password-input__item {
        background-color: #f7f8fa !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
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