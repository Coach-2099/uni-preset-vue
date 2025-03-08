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

      <div class="uploadBox">
        <p class="fs-16 text-black">Please take/upload xxx's personal ID card.</p>
        <p class="fs-12 mt-10 text-gray">Please ensure that the ID border is complete, the font is clear, and the
          brightness is uniform.
        </p>
        <div class="mt-15 flex justify-between">
          <van-uploader class="mr-15" v-model="fileList" multiple :max-count="1" >
            <div class="upuloadTemp flex-col items-center">
              <image
                src="/static/svg/tools/upload.svg"
                mode="scaleToFill"
              />
              <p class="mt-15 fs-12">Front photo of ID card</p>
            </div>
          </van-uploader>
          <van-uploader v-model="fileList" multiple :max-count="1">
            <div class="upuloadTemp flex-col items-center">
              <image
                src="/static/svg/tools/upload.svg"
                mode="scaleToFill"
              />
              <p class="mt-15 fs-12 text-black">Front photo of ID card</p>
            </div>
          </van-uploader>
        </div>
      </div>
    </div>
    <div class="pos-fixed btnBox bg-white">
      <p class="fs-12 text-gray btnText">
        BYBIT will encrypt information to ensure
        real-time information security.
      </p>
      <van-button class="uploadBtn w-100 mt-15">
        <text class="fs-20 text-white fw-b">Upload</text>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import navigationBar from '@/components/navigationBar/index.vue'

const firstName = ref('')
const lastName = ref('')
const idNuber = ref('')

const fileList = ref([])
const inputfirstName = () => {
  console.log('firstName', firstName.value)
}

const inputlastName = () => {
  console.log('lastName', lastName.value)
}

const inputIdNumber = () => {
  console.log('idNuber', idNuber.value)
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