<template>
  <div class="quotes-index">
    <div class="mt-15">
      <van-search v-model="value" placeholder="BTC/USDT" shape="round" @click="goSearchMore" />
    </div>
    <div class="quotesList">
      <van-tabs v-model:active="active" @click-tab="onClickTab" sticky shrink>
        <van-tab :title="$t('noun.spotGoods')">
          <quoteList ref="spotQuoteListRefs" type="SPOT"></quoteList>
        </van-tab>
        <van-tab :title="$t('noun.futureGoods')">
          <quoteList ref="futuresQuoteListRefs" type="FUTURES"></quoteList>
        </van-tab>
        <van-tab :title="$t('noun.metalsGoods')">
          <quoteList ref="metalsQuoteListRefs" type="METALS"></quoteList>
        </van-tab>
      </van-tabs>
    </div>
    <CustomNavBar></CustomNavBar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import CustomNavBar from '@/components/customNavBar/index.vue'; // 使用大驼峰命名
import quoteList from '@/components/business/quoteList/index.vue'; // 使用大驼峰命名

const spotQuoteListRefs = ref<InstanceType<typeof quoteList> | null>(null);
const futuresQuoteListRefs = ref<InstanceType<typeof quoteList> | null>(null);
const metalsQuoteListRefs = ref<InstanceType<typeof quoteList> | null>(null);

const value = ref('')
const active = ref(0)
const loading = ref(false)

const listData = ref([]); // 从API获取的真实数据
const sortField = ref('symbol');
const sortDirection = ref('asc');

onMounted(() => {
  nextTick(() => {
    onClickTab({name: 0})
  })
})

const onClickTab = (name: any) => {
  console.log('点击了标签页', name);
  console.log('quoteListRefs.value', spotQuoteListRefs.value)

  nextTick(() => {
    const currentRef = active.value === 0 ? spotQuoteListRefs : active.value === 1 ? futuresQuoteListRefs : metalsQuoteListRefs;
    console.log('currentRef', currentRef.value)
    currentRef.value?.clearData();
    currentRef.value?.loadData();
  })
 };

const goSearchMore = () => {
  uni.navigateTo({
    url: '/pages/searchMore/index'
  })
}

</script>

<style lang="scss" scoped>
.quotes-index {
  height: 100%;
  .quotesList {
    padding-bottom: 90px;
    .sortImg {
      width: 7px;
      height: 7px;
      margin-left: 3px;
    }
    .divLine {
      margin-left: 3px;
      margin-right: 3px ;
    }
  }
}
</style>