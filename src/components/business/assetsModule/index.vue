<template>
  <div class="assetsModule-temp mt-15">
    <div>
      <div class="flex items-center justify-between" v-if="type === 'wallet' || type === 'spot'">
        <div class="flex-1">
          <van-checkbox v-model="checked" @change="checkZero" shape="square">
            <template #icon="props">
              <image class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
            </template>
            <text
              class="fs-14"
              :class="checked ? 'text-black' : 'text-gray'"
            >{{ $t('module.assetsModule.hideZeroBalances')}}</text>
          </van-checkbox>
        </div>
        <div class="searchBox">
          <van-search
            v-model="searchValue"
            shape="round"
            placeholder="Search"
            :clearable="false"
			      @update:model-value="onSearch"
          >
            <template #left-icon>
              <div class="flex items-center justify-between">
                <image class="img-icon" :src="searchIcon" />
              </div>
            </template>
          </van-search>
        </div>
      </div>
      <div v-if="type === 'wallet' || type === 'spot'"
        v-for="(item,index) in searchItems" :key="index" 
        class="flex items-center justify-between mt-15"
        @click="goDetail"
      >
        <div class="flex items-center">
          <image
            class="currencyImg"
            :src="item.img"
            mode="scaleToFill"
          />
          <div class="ml-10">
            <p class="fs-16 fw-b text-black">{{item.symbol}}</p>
            <!-- <p class="fs-12 text-gray">bitcion</p> -->
          </div>
        </div>
        <div class="text-right">
          <p class="fs-16 fw-b text-black">{{item.availableAmount}}</p>
          <p class="fs-12 text-gray">≈{{Number(item.availableAmount*(symbolMap.get(item.symbol)?symbolMap.get(item.symbol):1)).toFixed(2)}} USD</p>
        </div>
      </div>
	  <div v-else
	    class="flex items-center justify-between mt-15"
	    @click="goDetail"
	  >
	    <div class="flex items-center">
	      <image
	        class="currencyImg"
	        :src="data.img"
	        mode="scaleToFill"
	      />
	      <div class="ml-10">
	        <p class="fs-16 fw-b text-black">{{data.symbol}}</p>
	        <!-- <p class="fs-12 text-gray">bitcion</p> -->
	      </div>
	    </div>
	    <div class="text-right">
	      <p class="fs-16 fw-b text-black">{{roundDown(data.marginBalance,2)}}</p>
	      <p class="fs-12 text-gray">≈{{roundDown(data.marginBalance,2)}} USD</p>
	    </div>
	  </div>
    </div>
    <!-- <div class="defaultTemp">
      <dataDefault></dataDefault>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import {   ref, watch,reactive } from 'vue'
import square  from '@/static/images/square.png'
import checkSquare from '@/static/images/checkSquare.png'
import searchIcon from '@/static/images/search.png'
import { getAsset } from '@/api/asset';
import { getSymbolsLastPrice } from '@/api/quotes'
import { roundDown } from '@/utils/util';
import { nextTick } from 'process';
import { onLoad, onShow } from '@dcloudio/uni-app';
// import dataDefault from '@/components/dataDefault/index.vue'

const checked = ref(false)
const searchValue = ref('')

const activeIcon = ref(checkSquare)
const inactiveIcon = ref(square)
let searchItems =ref([])

const symbolMap = reactive(new Map())

const props = defineProps({
  type:{
	  data:String,
	  default: 'wallet'
  },
  data: {
    data: Object,
    default: null
  },
  active:{
	  data:String,
	  default:'wallet'
  }
});

watch(
  () => props.data,
  (newVal, oldVal) => {
	if(props.type === 'wallet'|| props.type === 'spot'){
		searchItems.value = props.data
	}
  }
)

// 自主获取数据
const loadData = async () => {
  try {
    const params = {
      klineType: 'SPOT',
    }
    const data = await getSymbolsLastPrice(params)
    data.forEach((item: any) => {
		const tradeToken = item.symbol.split('/')[0]
	    symbolMap.set(tradeToken,item.close)
      // item.price = item.price.toFixed(2)
    })
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const goDetail = () => {
  // uni.navigateTo({
  //   url: '/pages/currencyDetails/index'
  // })

}

const checkZero = (checked:boolean) => {
	if(checked){
		if(props.active === 'wallet'||props.active === 'spot'){
			searchItems.value = props.data.filter((item: any)=>{return item.availableAmount>0})		
		}
	}else{
		searchItems.value = props.data
	}
}

const onSearch = (val:string) => {
  console.log('val', val)
	if(val.length>0){
    const searchKey = val.toLocaleLowerCase()
		searchItems.value = props.data.filter(
      (item: any)=>{
        return item.symbol.toLocaleLowerCase().includes(searchKey)
      }
    )
	}else{
		searchItems.value = props.data
	}
}

onShow(()=>{
	if(props.type === 'wallet'|| props.type === 'spot'){
		searchItems.value = props.data
	}
	loadData()
})

</script>

<style lang="scss" scoped>
.assetsModule-temp {
  padding-bottom: 120px;
  .img-icon {
    width: 18px;
    height: 18px;
  }
  .currencyImg {
    width: 21px;
    height: 21px;
  }
  .searchBox {
    width: 35vw;
  }
  :deep(.van-search) {
    padding-right: 0px !important;
    background: var(--color-background) !important;
  }
  .defaultTemp {
    margin-top: 90px;
    padding-bottom: 120px;
  }
}
</style>