<template>
  <div class="assetDetail-index">
    <navigationBar :title="$t('navBar.assetDetail')"></navigationBar>
    <div class="bg-white pt-25 pb-25">
      <div class="text-center">
        <!-- <p class="fs-14 text-gray">Quantity</p> -->
        <p class="fs-24 mt-20 fw-b text-black">
          $
          <text v-if="type == 'Deposit'">{{ detailInfo.rechargeAmount }}</text>
          <text v-if="type == 'Withdraw'">{{ detailInfo.arrivalAmoumt }}</text>
          <text v-if="type == 'Transfer'">{{ detailInfo.arrivalAmoumt }}</text>
          - {{ detailInfo.symbol }}
        </p>
        <div class="successTemp mt-20 w-100 flex justify-center items-center">
          <image
            class="successIcon"
            src="/static/images/success.png"
            mode="scaleToFill"
          />
          <p class="text-green">{{ $t('common.succeeded') }}</p>
        </div>
      </div>
    </div>
    <div class="mt-5 pt-20 bg-white contentBox fs-14">
      <div class="flex justify-between items-center">
        <p class="text-gray">{{ $t('noun.depositAccount') }}</p>
        <P class="text-black">{{ detailInfo.userAddress }}</P>
      </div>
      <div class="flex justify-between items-center mt-25">
        <p class="text-gray">{{ $t('noun.chainType') }}</p>
        <p class="text-black">{{ detailInfo.protocolType }}</P>
      </div>
      <div class="flex justify-between items-center mt-25">
        <p class="text-gray">{{ $t('noun.time') }}</p>
        <p class="text-black">{{ formatISODate(detailInfo.createTime) }}</P>
      </div>
      <div v-if="type == 'Withdraw'" class="flex justify-between items-baseline mt-25">
        <p class="text-gray">{{ $t('noun.transferId') }}</p>
        <div class="flex justify-end items-baseline">
          <p class="text-black text-right text-wrap copyText">
            {{ detailInfo.transactionId }}
          </P>
          <image
            @click="copyText(AddressAddressVal)"
            class="copyIcon ml-5"
            src="/static/images/copy.png"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div v-if="type == 'Transfer'" class="flex justify-between items-baseline mt-25">
        <p class="text-gray ">{{ $t('noun.transactionHash') }}</p>
        <div class="flex justify-end items-baseline">
          <p class="text-black text-right text-wrap copyText">
            {{ HashVal }}
          </P>
          <image
            @click="copyText(HashVal)"
            class="copyIcon ml-5"
            src="/static/images/copy.png"
            mode="scaleToFill"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'
import { onShow, onLoad } from '@dcloudio/uni-app';
import { formatISODate } from '@/utils/util'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const AddressAddressVal = ref('TCkPH6qgSRPNZZrfuvAoW2rZ8K10wLmNcB');
const HashVal = ref('be2dca069689d766e860012f18602d0d909002c42cb331ff7da4ebb58b5fcc02');

const detailInfo = ref({})
const type = ref('')

const copyText = (value:string) => {
  uni.setClipboardData({
    data: value,
    success: () => {
      uni.showToast({
        title: t('tips.copySuccess'),
        icon: 'none'
      })
    }
  })
}

onLoad((option:any) =>{
  console.log('option', option)
  const item = JSON.parse(decodeURIComponent(option.item));
  detailInfo.value = item
  type.value = option.type
  console.log('detailInfo.value', detailInfo.value)
  console.log('type.value', type.value)
})


</script>

<style lang="scss">
.assetDetail-index {
  background: #F6F7FB;
  .successTemp {
    .successIcon {
      width: 8.54px;
      height: 8.54px;
    }
  }
  .contentBox {
    padding-left: 18px;
    padding-right: 18px;
  }
  .copyIcon {
    width: 16px;
    height: 16px;
  }
  .copyText {
    width: 200px;
  }
}
</style>