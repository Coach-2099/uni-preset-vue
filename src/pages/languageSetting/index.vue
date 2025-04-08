<template>
  <div class="languageSetting-index ba-white pos-relative">
    <navigationBar :title="$t('navigationBarTitle.settingLanguage')"></navigationBar>
    <div class="mt-20">
      <van-radio-group v-model="checkRadio">
        <van-cell-group inset>
          <van-cell :title="$t('language.chinese')" clickable @click="checked('1')">
            <template #right-icon>
              <van-radio name="1" />
            </template>
          </van-cell>
          <van-cell :title="$t('language.english')" clickable @click="checked('2')">
            <template #right-icon>
              <van-radio name="2" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div class="myBtn pos-fixed w-100">
        <van-button type="primary" class="w-100 mt-20" @click="confirm">{{ $t('common.confirm') }}</van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import navigationBar from '@/components/navigationBar/index.vue'
// 引入i18n实例
import { useI18n } from 'vue-i18n';
import { onLoad } from '@dcloudio/uni-app';
const { locale } = useI18n();
// 初始化时根据存储值设置选中状态
const checkRadio = ref('1')

onLoad(() => {
  const lang = uni.getStorageSync('language')
  if (lang === 'zh-Hans') {
    checkRadio.value = '1'
  } else if (lang === 'en') {
    checkRadio.value = '2'
  }
})

const checked = (e:any) => {
  checkRadio.value = e
}

const confirm = () => {
  // 转换语言标识符为i18n标准格式
  const langMap: any = {
    '1': 'zh-Hans',
    '2': 'en'
  };
  const selectedLang = langMap[checkRadio.value];
  
  // 设置全局语言并存储到本地（已实现）
  locale.value = selectedLang;
  uni.setStorageSync('language', selectedLang); // 这行代码已正确保存到本地

  // 重启应用使语言设置全局生效
  uni.reLaunch({
    url: '/pages/home/index'
  });
}

</script>

<style lang="scss" scoped>
.languageSetting-index {
  .myBtn {
    bottom: 80px;
    left: 0;
    right: 0;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>