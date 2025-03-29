<template>
  <div class="home-index">
    <van-sticky>
      <div class="flex justify-between items-center pl-15 pr-15 headerTemp">
        <div @click="goUser" class="flex items-center home_icon">
           <image src="/static/svg/home/user.svg" />
        </div>
        <div class="fw-b fs-26 text-black ml-20">BYBIT</div>
        <div class="flex justify-between">
          <div class="flex items-center home_right_icon mr-20">
            <image
              src="/static/svg/home/c_service.svg"
              mode="scaleToFill"
          />
          </div>
          <div class="flex items-center home_right_icon" @click="goMessageList">
             <image
              src="/static/svg/home/msg.svg"
              mode="scaleToFill"
             />
          </div>
        </div>
      </div>
    </van-sticky>
    <div v-if="userStore.userInfo" class="assetsInfo">
      <p class="fs-14 text-gray">总资产折合</p>
      <p class="mt-15">
        <span class="fs-32 fw-b text-black mr-10">0.00</span>
        <span class="fs-14 text-black">USD</span>
      </p>
      <div class="flex justify-between items-end">
        <p class="text-gray mt-15">≈ 0.00000000  BTC</p>
      </div>
    </div>
    <div v-else class="noLoginTemp bg-white py-25">
      <div class="noLoginBox  w-100 flex-col items-center">
        <div class="fw-b fs-16 text-black">
          注册解锁高达<text class="text-light-blue">$5050</text>奖励
        </div>
        <div class="mt-15">
          <van-button
            class="myBtn"
            type="primary"
            @click="goRegister"
          >
            <text class="fs-14 text-white py-5">注册/登录</text>
          </van-button>
        </div>
      </div>
    </div>
    <div class="pl-20 pr-20 pt-5 pb-5 pt-25 walletInfo">
      <div class="flex items-center">
        <van-image width="17.45" height="16" src="/static/svg/home/horn.svg" />
        <p 
          style="background: #F6F7FB;
          border-radius: 5px 5px 5px 5px;"
          class="w-100 ml-5 pl-5 fs-14 bg-warning text-black">
          This is Broadcast
        </p>
      </div>
    </div>
    <div class="pl-20 pr-20 pt-15 pb-10 bg-white">
      <div class="pl-20 pr-20 pt-15 pb-15 flex justify-between ribbon">
        <div class="flex-col items-center" @click="sendMessage">
          <van-image width="28" hidden="30" src="/static/svg/home/recharge.svg" />
          <p class="mt-5 text-by-black" style="font-size: 3.2vw;">Recharge</p>
        </div>
        <div class="flex-col items-center" @click="goTransfer">
          <van-image width="28" hidden="30" src="/static/svg/home/transfer.svg" />
          <p class="mt-5 text-by-black" style="font-size: 3.2vw;">transfer</p>
        </div>
        <div class="flex-col items-center" @click="goWithdraw">
          <van-image width="28" hidden="28" src="/static/svg/home/withdraw.svg" />
          <p class="mt-5 text-by-black" style="font-size: 3.2vw;">withdraw</p>
        </div>
        <div class="flex-col items-center" @click="goInvite">
          <van-image width="28" hidden="30" src="/static/svg/home/invite.svg" />
          <p class="mt-5 text-by-black" style="font-size: 3.2vw;">Invite</p>
        </div>
      </div>
    </div>
    <div class="pl-5 pr-10 quotes bg-white">
      <van-tabs
        v-model:active="active" 
        shrink
        class="mt-20"
        title-active-color="#333333"
        title-inactive-color="#B0B0B0"
        @click-tab="onClickTab"
      >
        <van-tab title="币种">
          <quoteList
            ref="spotQuoteListRefs"
            type="SPOT"
            :needPullRefresh="false"
          ></quoteList>
          <div class="moreTemp flex justify-center items-center" @click="viewMore">
            <p class="fs-12">View More</p>
            <van-image class="ml-5" width="8" height="10" src="/static/images/right.png" />
          </div>
        </van-tab>
        <van-tab title="合约">
          <quoteList
            ref="futuresQuoteListRefs"
            type="FUTURES"
            :needPullRefresh="false"
          ></quoteList>
          <div class="moreTemp flex justify-center items-center" @click="viewMore">
            <p class="fs-12">View More</p>
            <van-image class="ml-5" width="9" height="7" src="/static/images/right.png" />
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="mt-5 pt-10 bg-white news">
      <van-tabs v-model:active="tabType" shrink>
        <van-tab title="探索">
          <div class="newsTemp mt-20 ml-15 mr-15 ">
            <div class="title flex justify-start items-center">
              <div class="Dot"></div>
              <text class="ml-10 fs-14 fw-b text-balck">2025年2月22日</text>
            </div>
          </div>
          <div class="article ml-15 mr-15">
            <div class="entry">
              <div class="time flex items-center text-gray fs-12">
                <div style="
                  width: 5px;
                  height: 5px;
                  border-radius: 50%;
                  background: #B0B0B0;"
                ></div>
                <text class="ml-15">20:33</text>
              </div>
              <div class="title ml-15 fw-b text-black mt-10 fs-16">美聯儲官員下週密集發聲，市場注核心PCE物價指數</div>
              <div class="mt-20">
                <a href="#" class="view-source ml-15 fs-12">查看原文</a>
              </div>
            </div>

            <div class="entry mt-25">
              <div class="time flex items-center text-gray fs-12">
                <div style="
                  width: 5px;
                  height: 5px;
                  border-radius: 50%;
                  background: #B0B0B0;"
                ></div>
                <text class="ml-15">20:33</text>
              </div>
              <div class="title ml-15 fw-b text-black mt-10 fs-16">美聯儲官員下週密集發聲，市場注核心PCE物價指數</div>
              <div class="mt-20">
                <a href="#" class="view-source ml-15 fs-12">查看原文</a>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="关注中"></van-tab>
        <van-tab title="公告"></van-tab>
        <van-tab title="新闻"></van-tab>
      </van-tabs>
    </div>
    <CustomNavBar></CustomNavBar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { onLaunch } from "@dcloudio/uni-app";
import { useSocket } from '@/utils/socket';
import CustomNavBar from '@/components/customNavBar/index.vue'; // 使用大驼峰命名
import quoteList from '@/components/business/quoteList/index.vue'; // 使用大驼峰命名
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const active = ref(0);
const tabType = ref(0)

// 新增响应式数据存储
const tickerData = ref<Record<string, any>>({});
const depthData = ref<Record<string, any>>({});
const userData = ref({
  balance: 0,
  orders: [] as any[]
});

const spotQuoteListRefs = ref<InstanceType<typeof quoteList> | null>(null);
const futuresQuoteListRefs = ref<InstanceType<typeof quoteList> | null>(null);
const socketService = computed(() => userStore.socketService);

  onLaunch(() => {
    uni.hideTabBar();
  })

  // Connect to the socket server
  onMounted(() => {
    // 切换类型时请求
    nextTick(() => {
      onClickTab({name: 0})
    })

    // 订阅BTC/USDT的实时行情
    socketService.value.subscribe('ticker');

    // 添加行情数据监听
    socketService.value.on('ticker', (data: any) => {
      console.log('收到行情数据:', data);
      // 示例数据结构处理：{ symbol: 'BTC/USDT', price: 50000, change: 0.22 }
      tickerData.value[data.symbol] = data;
	  let currentRef : any
	  switch(active.value){
		  case 0:
		  currentRef = spotQuoteListRefs
		  break
		  case 1:
		  currentRef = futuresQuoteListRefs
		  break
		  default:
		  
	  }
	  currentRef.value?.refreshData(data);
	  
    });
  });

  // Disconnect from the socket server when the component is unmounted
  onUnmounted(() => {
    // 取消所有订阅
    socketService.value.unsubscribe('ticker');
  });

  const subscribeFun = () => {
    
  }

  const goTransfer = () => {
    uni.navigateTo({
      url: '/pages/transfer/index',
    });
  };

  const goWithdraw = () => {
    uni.navigateTo({
      url: '/pages/withdrawl/index',
    });
  }

  const goInvite = () => {
    uni.navigateTo({
      url: '/pages/invite/index',
    });
  }

  const goUser = () => {
    uni.navigateTo({
      url: '/pages/userInfo/index',
    });
  };
  // Function to send a message
  const sendMessage = () => {
    console.log('发送消息')
    socketService.value.emit('message', 'Hello from client');
  };

  // 切换标签
  const onClickTab = (e: any) => {
    console.log('点击了标签页', e);
    nextTick(() => {
      const currentRef = active.value === 0 ? spotQuoteListRefs : futuresQuoteListRefs;
      console.log('currentRef', currentRef.value)
      currentRef.value?.clearData();
      currentRef.value?.loadData();
    })
  };

  const viewMore = () => {
    uni.switchTab({
      url: '/pages/quotes/index',
    });
  }

  const goRegister = () => {
    uni.navigateTo({
      url: '/pages/register/index',
    });
  }
  const goMessageList = () => {
    uni.navigateTo({
      url: '/pages/messageList/index',
    });
  }

</script>

<style lang="scss" scoped>
.home-index {
  height: 100%;
  background: #F6F8FC;
  .headerTemp {
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    .home_icon {
      width: 28px;
      height: 28px;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .home_right_icon {
      width: 22px;
      height: 22px;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .my-swipe .van-swipe-item {
    color: #000;
    font-size: 20px;
    height: 25vh;
    line-height: 150px;
    text-align: center;
    background-color: #fff;
  }
  .assetsInfo {
    padding-top: 42px;
    padding-left: 22px;
    padding-right: 18px;
    background-color: #ffffff;
    .deposit-btn {
      width: 84px;
      height: 28px;
    }
  }
  .noLoginTemp {
    .noLoginBox {
      background-image: url('/static/images/homeBg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      height: 80px;
      .myBtn {
        border-radius: 6px;
        height: 28px;
        width: 167px;
      }
    }
  }
  .walletInfo {
    background: #fff;
  }
  .ribbon {
    background: #FFFFFF;
    box-shadow: 0px 0px 6px 1px rgba(0,8,242,0.08);
    border-radius: 16px 16px 16px 16px;
    // color: #fff;
  }
  .quotes {
    padding-top: 29px;
    background: #fff;
    .rises_falls_btn {
      width: 84px;
      height: 28px;
      border-radius: 6px 6px 6px 6px;
    }
  }
  .news {
    padding-bottom: 90px;
    .newsTemp {
      .Dot {
        width: 8px;
        height: 8px;
        background: #1777FF;
        border-radius: 50%;
      }
    }
    .article {
      .entry:not(:first-child)::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-left: 1px dashed #ccc;
      }
    }
  }
  .moreTemp {
    height: 10.8vw;
    line-height: 10.8vw;
    border-top: 1px solid #f5f7fa;
    color: #81858c;
  }
}
</style>