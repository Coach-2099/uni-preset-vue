<template>
  <div class="IdentityAuth-index">
    <navigationBar title="身份认证"></navigationBar>
    <div class="container w-100">
      <div class="flex justify-between items-center mt-20">
        <div class="label">Family Name</div>
        <input
          v-model="firstName"
          class="base-input w-100"
          placeholder="Please enter the family name."
          placeholder-class="input-placeholder"
          @input="inputfirstName"
        />
      </div>
      <div class="flex justify-between items-center mt-20">
        <div class="label">Last Name</div>
        <input
          v-model="lastName"
          class="base-input w-100"
          placeholder="Please enter the first name."
          placeholder-class="input-placeholder"
          @input="inputlastName"
        />
      </div>
      <div class="flex justify-between items-center mt-20">
        <div class="label">card Number</div>
        <input
          v-model="idNuber"
          class="base-input w-100"
          placeholder="Please enter the card number."
          placeholder-class="input-placeholder"
          @input="inputIdNumber"
        />
      </div>
      <div class="flex justify-between items-center mt-20">
        <div class="label">Identity Type</div>
        <div class="w-100 base-input">
          <picker
            @change="bindPickerChange"
            :value="checkType"
            :range="typeArray"
            range-key="text">
						<view class="uni-input">{{typeArray[checkType].text}}</view>
					</picker>
        </div>
      </div>

      <div class="uploadBox">
        <p class="fs-16 text-black">Please take/upload xxx's personal ID card.</p>
        <p class="fs-12 mt-10 text-gray">Please ensure that the ID border is complete, the font is clear, and the
          brightness is uniform.
        </p>
        <div class="mt-15 flex justify-between">
          <div class="pos-relative">
            <van-uploader
              class="mr-15"
              v-model="fileListFront"
              :max-count="1"
              reupload
              preview-size="9rem"
              :after-read="afterReadFront"
            >
              <div class="upuloadTemp flex-col items-center">
                <image
                  src="/static/images/IDCardFront.png "
                  mode="scaleToFill"
                />
                <p class="mt-15 fs-12">Front photo of ID card</p>
              </div>
            </van-uploader>
            <div v-if="fileFront" class="myPreview bg-white flex-col items-center pos-absolute">
              <image
                class="myPreviewImg"
                :src="fileFront"
                mode="scaleToFill"
              />
            </div>
          </div>
          <div class="pos-relative">
            <van-uploader
              v-model="fileListBack"
              :max-count="1"
              reupload
              preview-size="9rem"
              :after-read="afterReadBack"
            >
              <div class="upuloadTemp flex-col items-center">
                <image
                  src="/static/images/IDCardBack.png"
                  mode="scaleToFill"
                />
                <p class="mt-15 fs-12 text-black">Reverse photo of ID card</p>
              </div>
            </van-uploader>
            <div v-if="fileBack" class="myPreview bg-white flex-col items-center pos-absolute">
              <image
                class="myPreviewImg"
                :src="fileBack"
                mode="scaleToFill"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pos-fixed btnBox bg-white">
      <p class="fs-12 text-gray btnText">
        BYBIT will encrypt information to ensure
        real-time information security.
      </p>
      <van-button class="uploadBtn w-100 mt-15" @click="uploadFun">
        <text class="fs-20 text-white fw-b">Upload</text>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import navigationBar from '@/components/navigationBar/index.vue'
import { uploadImage } from '@/api/app'
import { userKyc } from '@/api/account'

const firstName = ref('')
const lastName = ref('')
const idNuber = ref('')

const fileFront = ref('')
const fileBack = ref('')

const fileFrontSrc = ref('')
const fileBackSrc = ref('')

const fileListFront = ref([])
const fileListBack = ref([])

const typeArray = ref([{text: '身份证', value: 'IDCARD'}, {text: '护照', value: 'PASSPORT'}, {text: '驾照', value: 'DRVING_LICENSE'}])
const checkType = ref(0)

const inputfirstName = () => {
  console.log('firstName', firstName.value)
}

const inputlastName = () => {
  console.log('lastName', lastName.value)
}

const inputIdNumber = () => {
  console.log('idNuber', idNuber.value)
}

const afterReadFront = async (file: any) => {
  const data = await uploadImage(file.content)
  fileFront.value = file.content
  fileFrontSrc.value = data?.url
}


const afterReadBack = async (file: any) => {
  const data = await uploadImage(file.content)
  fileBack.value = file.content
  fileBackSrc.value = data?.content
}

const bindPickerChange = (e:any) => {
  console.log('e', e)
  checkType.value = e.detail.value

}

const uploadFun = async () => {
  const params = {
    name: firstName.value,
    lastName: lastName.value,
    idCard: idNuber.value,
    type: typeArray.value[checkType.value].text, // IDCARD:身份证,PASSPORT:护照,DRVING_LICENSE:驾照
    zmImg: fileFrontSrc.value,
    fmImg: fileBackSrc.value
  }
  await userKyc(params)
  uni.showToast({ title: '认证成功', icon: 'none' })
  uni.redirectTo({
    url: '/pages/userInfo/index'
  })
}

</script>

<style lang="scss" scoped>
.IdentityAuth-index {
  height: 100%;
  background: #fff;
  .container {
    padding-bottom: 150px;
    .label {
      width: 160px;
    }
    .base-input {
      line-height: 42px;
      height: 42px;
      background: #F6F7FB;
      border-radius: 8px;
    }
    .input-placeholder {
      font-size: 14px;
      color: #B0B0B0;
    }
  }
  .uploadBox {
    margin-top: 35px;
    .upuloadTemp {
      border: 1px dashed #237eff;
      background: #f6f7fb;
      padding: 2.2rem 1.19rem;
      image {
        width: 3.49rem;
        height: 2.82rem;
      }
    }
    .myPreview {
      height: 9.22rem;
      width: 9.77rem;
      border: 1px dashed #237eff;
      pointer-events: none;
      top: 0;
      left: 0;
      .myPreviewImg {
        width: 100%;
        height: 100%;
      }
    }
  }
  .btnBox {
    bottom: 0px;
    padding: 0 16px;
    padding-bottom: 40px;
    .btnText {
      padding: 0 20% 18px 20%;
    }
    .uploadBtn {
      background: #1777ff;
    }
  }
}
</style>