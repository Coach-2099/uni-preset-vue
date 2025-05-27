<template>
  <div class="home-index">
    <div style="height: var(--status-bar-height)"></div>
    <van-config-provider :theme="themeVal">
      <van-sticky>
        <div class="flex justify-between items-center pl-15 pr-15 headerTemp">
          <div @click="goUser" class="flex items-center home_icon">
            <!-- <image src="/static/svg/home/user.svg" /> -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
              <defs>
                <clipPath id="a">
                  <path d="M0 0h28v28H0z" style="fill:none"/>
                </clipPath>
              </defs>
              <g style="clip-path:url(#a)">
                <path d="M28 14a13.946 13.946 0 0 1-3.438 9.189c-.1.111-.2.222-.3.33a14 14 0 0 1-20.4.141 2.218 2.218 0 0 1-.133-.148A14 14 0 1 1 28 14" style="fill:#f6f7fb"/>
                <path d="M20.347 11.34a5.448 5.448 0 0 0-5.45 5.45 5.45 5.45 0 1 0 5.454-5.45m1.4 11.89h-2.8a9 9 0 0 0-8.863 7.421c.041.048.085.1.133.148a14 14 0 0 0 20.4-.141 9 9 0 0 0-8.863-7.429m.085 6.936-1.486.993-1.489-.993.993-4.954-.993-.989h2.975l-.993.989Z" style="fill:var(--color-light-primary)" transform="translate(-6.345 -7.138)"/>
              </g>
            </svg>
          </div>
          <div class="fw-b fs-26 text-black ml-20"><!-- XAUSWAP --></div>
          <div class="flex justify-between">
            <div class="flex items-center home_right_icon mr-20" @click="goCustomerService">
              <!-- <image
                src="/static/svg/home/c_service.svg"
                mode="scaleToFill"
              /> -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.054 22"
                style="color: var(--color-icon)"
              >
                <defs>
                  <clipPath id="a">
                    <path d="M0 0h22.054v22H0z" style="fill:none"/>
                  </clipPath>
                </defs>
                <g style="clip-path:url(#a)">
                  <path
                    d="M20.978 10.944C20.978 3.757 17.6 0 11.052 0s-9.926 3.757-9.98 11A2.94 2.94 0 0 0 0 13.254v2.573a2.978 2.978 0 0 0 2.256 2.845l.536.107a2.01 2.01 0 0 0 .59.054A2.518 2.518 0 0 0 5.9 16.309v-3.645a2.449 2.449 0 0 0-.054-.594 2.531 2.531 0 0 0-3.056-1.823h-.052c.214-5.847 2.949-8.639 8.314-8.639s8.1 2.792 8.264 8.586h-.054a2.01 2.01 0 0 0-.59-.054 2.521 2.521 0 0 0-2.524 2.524v3.646a2.4 2.4 0 0 0 .054.59 2.552 2.552 0 0 0 1.926 1.876 6.19 6.19 0 0 0 1.723-.157 2.934 2.934 0 0 0 2.2-2.845V13.2a3.016 3.016 0 0 0-1.076-2.256m-17.811.8a.966.966 0 0 1 1.126.7.322.322 0 0 1 .054.214v3.646a.943.943 0 0 1-.911.915c-.054 0-.161-.054-.214-.054l-.536-.107a1.38 1.38 0 0 1-1.022-1.291V13.2a1.521 1.521 0 0 1 .969-1.344Zm17.275 4.078a1.377 1.377 0 0 1-1.019 1.291l-.536.107a.923.923 0 0 1-1.072-.647.322.322 0 0 1-.054-.214v-3.642a.943.943 0 0 1 .911-.915c.054 0 .161.054.214.054l.536.107a1.377 1.377 0 0 1 1.019 1.291Z"
                    style="fill:var(--color-text)"
                  />
                  <path d="M36.364 48.62a3.946 3.946 0 0 1-.218.8A4.023 4.023 0 0 1 32.393 52h-4.829a.806.806 0 0 1 0-1.612h4.829a2.367 2.367 0 0 0 2.045-1.164 2.252 2.252 0 0 0 .211-.444s0 0-.008 0a6.19 6.19 0 0 0 1.723-.157" style="fill:var(--color-light-primary)" transform="translate(-16.512 -30.001)"/>
                </g>
              </svg>

            </div>
            <div class="flex items-center home_right_icon" @click="goMessageList">
              <!-- <image
                src="/static/svg/home/msg.svg"
                mode="scaleToFill"
              /> -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.617 22">
                <defs>
                  <clipPath id="a">
                    <path d="M0 0h21.617v22H0z" style="fill:none"/>
                  </clipPath>
                </defs>
                <g style="clip-path:url(#a)">
                  <path style="fill:var(--color-text)" d="M10.808 1.517a6.028 6.028 0 0 1 6.034 6.022 16.573 16.573 0 0 0 1.688 7.949 8.6 8.6 0 0 0 .88 1.32H2.205a8.613 8.613 0 0 0 .88-1.319 16.416 16.416 0 0 0 1.688-7.95A5.976 5.976 0 0 1 6.542 3.28a6.072 6.072 0 0 1 4.265-1.763Zm0-1.517a7.546 7.546 0 0 0-7.552 7.539 14.9 14.9 0 0 1-1.5 7.221 6.472 6.472 0 0 1-.961 1.358 3.5 3.5 0 0 1-.281.266.593.593 0 0 1-.059.047 1.037 1.037 0 0 0 .587 1.892h19.537a1.037 1.037 0 0 0 .587-1.892l-.059-.047a3.515 3.515 0 0 1-.281-.266 6.471 6.471 0 0 1-.962-1.358 14.923 14.923 0 0 1-1.5-7.221A7.546 7.546 0 0 0 10.808 0"/>
                  <path d="M18.008 53.6a14.524 14.524 0 0 1-5.943-1.257.742.742 0 0 1 .6-1.356 13.185 13.185 0 0 0 10.707-.013.742.742 0 0 1 .607 1.355 14.527 14.527 0 0 1-5.971 1.271Z" style="fill:var(--color-light-primary)" transform="translate(-7.215 -31.597)"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </van-sticky>
      <div v-if="userStore.userInfo" class="assetsInfo">
        <p class="fs-14 text-gray">{{ $t('homeIndex.totalAssets') }}</p>
        <p class="mt-15">
          <span class="fs-32 fw-b text-black mr-10">{{balance}}</span>
          <span class="fs-14 text-black">USDT</span>
        </p>
      <!-- <div class="flex justify-between items-end">
          <p class="text-gray mt-15">≈ 0.00000000  BTC</p>
        </div> -->
      </div>
      <div v-else class="noLoginTemp py-25">
        <div class="noLoginBox  w-100 flex-col items-center">
          <!-- <div class="fw-b fs-16 text-black">
            {{ $t('common.registerToUnlock') }}<text class="text-light-blue">$5050</text>{{ $t('common.award') }}
          </div> -->
          <div class="mt-15">
            <van-button
              class="myBtn"
              type="primary"
              @click="goRegister"
            >
              <text class="fs-14 text-white py-5">{{ $t('common.loginOrRegister') }}</text>
            </van-button>
          </div>
        </div>
      </div>
      <div class="pl-20 pr-20 pt-5 pb-5 pt-25 walletInfo">
        <div class="flex items-center">
          <svg style="width: 17.45px; height: 16px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.451 16">
            <defs>
              <clipPath id="a">
                <path d="M0 0h17.451v16H0z" style="fill:none"/>
              </clipPath>
            </defs>
            <g style="clip-path:url(#a)">
              <path style="fill:var(--color-light-primary)" d="M16.836 8.615h-3.159a.615.615 0 0 1 0-1.23h3.159a.615.615 0 0 1 0 1.23M4.421 10.181a.615.615 0 0 1-.615-.615v-3.16a.615.615 0 0 1 1.23 0v3.16a.615.615 0 0 1-.615.615M13.677 4.693a.615.615 0 0 1-.287-1.159l2.8-1.47a.615.615 0 0 1 .572 1.089l-2.8 1.471a.612.612 0 0 1-.286.07M16.477 13.717a.612.612 0 0 1-.286-.07l-2.8-1.471a.615.615 0 0 1 .572-1.089l2.8 1.47a.615.615 0 0 1-.287 1.159" class="c"/>
              <path style="fill:var(--color-text)" d="M10.773 1.23a.057.057 0 0 1 .031.007.079.079 0 0 1 .028.067V14.7a.055.055 0 0 1-.024.048l-.024.014-.012.008H10.743L4.8 11.305l-.287-.167H1.242c-.006 0-.011-.006-.012-.006V4.864s.008-.01.013-.01h3.271l.286-.167 5.911-3.444a.191.191 0 0 1 .062-.013m0-1.23a1.455 1.455 0 0 0-.617.143L4.182 3.624h-2.94A1.244 1.244 0 0 0 0 4.86v6.273a1.243 1.243 0 0 0 1.242 1.235h2.94l6.022 3.51a1.293 1.293 0 0 0 1.252-.086 1.284 1.284 0 0 0 .607-1.094V1.3a1.286 1.286 0 0 0-1.29-1.3"/>
            </g>
          </svg>
          <div
            style="background: var(--color-background-box);
            border-radius: 5px 5px 5px 5px;"
            class="w-100 ml-5 pl-5 fs-14 bg-warning text-black"
          >
            <div class="marquee-container flex">
              <div
                class="marquee-content"
                :style="{ width: `${noticeList.length * 100}%` }"
              >
                <div 
                  v-for="(item,index) in noticeList"
                  :key="index"
                  class="marquee-item"
                >{{item.title}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pl-20 pr-20 pt-15 pb-10 ribbonBox">
        <div class="pl-20 pr-20 pt-15 pb-15 flex justify-between ribbon">
          <div class="flex-col items-center" @click="goRecharge">
            <!-- <image 
              src="~@/static/svg/home/recharge.svg" 
              mode="widthFix" 
              style="width: 28px; height: 28px;"
            /> -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" style="width: 28px; height: 28px; color: var(--color-primary);">
              <defs>
                <clipPath id="a">
                  <path d="M0 0h32.223v26H0z" style="fill:none"/>
                </clipPath>
              </defs>
              <g style="clip-path:url(#a)" transform="translate(1.825 5)">
                <path style="fill:var(--color-text)" d="M25.631 10.147a.855.855 0 0 1 .854.854V22.88a.855.855 0 0 1-.854.854H5.598a.855.855 0 0 1-.854-.854V11.001a.855.855 0 0 1 .854-.854Zm0-2.265H5.598a3.119 3.119 0 0 0-3.119 3.119V22.88A3.119 3.119 0 0 0 5.598 26h20.033a3.119 3.119 0 0 0 3.119-3.12V11.001a3.119 3.119 0 0 0-3.119-3.121"/>
                <path style="fill:var(--color-text)" d="M2.213 17.689.119 9.167a4.059 4.059 0 0 1 2.975-4.912L19.932.119a4.061 4.061 0 0 1 4.912 2.974l1.4 5.687-2.2.54-1.4-5.687a1.8 1.8 0 0 0-2.172-1.316L3.634 6.454a1.8 1.8 0 0 0-1.315 2.172l2.093 8.523Z"/>
                <path style="fill:var(--color-light-primary)" d="M31.091 18.074H18.967a1.133 1.133 0 0 1 0-2.265h12.124a1.133 1.133 0 1 1 0 2.265"/>
                <path style="fill:var(--color-light-primary)" d="M22.09 21.716a1.13 1.13 0 0 1-.8-.332l-3.092-3.093a1.911 1.911 0 0 1 0-2.7l3.094-3.094a1.133 1.133 0 1 1 1.6 1.6l-2.844 2.844 2.843 2.842a1.132 1.132 0 0 1-.8 1.933"/>
              </g>
            </svg>
            <p class="mt-5 text-by-black" style="font-size: 3.2vw;">{{ $t('noun.recharge') }}</p>
          </div>
          <div class="flex-col items-center" @click="goTransfer">
            <!-- <image 
              src="~@/static/svg/home/transfer.svg" 
              mode="widthFix" 
              style="width: 28px; height: 28px;"
            /> -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" style="width: 28px; height: 28px; color: var(--color-primary);">
              <defs>
                <clipPath id="a">
                  <path d="M0 0h26v22.013H0z" style="fill:none"/>
                </clipPath>
              </defs>
              <g style="clip-path:url(#a)" transform="translate(5 6.994)">
                <path style="fill:var(--color-text)" d="M24.737 9.007H1.085a1.085 1.085 0 0 1 0-2.17h21.459l-4.983-4.984A1.086 1.086 0 0 1 19.099.318l6.53 6.534a1.262 1.262 0 0 1-.892 2.155"/>
                <path d="M7.672 38.969a1.083 1.083 0 0 1-.767-.318L.37 32.117a1.262 1.262 0 0 1 .892-2.155h23.652a1.085 1.085 0 1 1 0 2.17H3.455l4.984 4.983a1.085 1.085 0 0 1-.767 1.853" style="fill:var(--color-light-primary)" transform="translate(0 -16.956)"/>
              </g>
              <path d="M0 0h36v36H0z" style="fill:none"/>
            </svg>
            <p class="mt-5 text-by-black" style="font-size: 3.2vw;">{{ $t('noun.transfer') }}</p>
          </div>
          <div class="flex-col items-center" @click="goWithdraw">
            <!-- <van-image width="28" hidden="28" src="/static/svg/home/withdraw.svg" /> -->
            <!-- <image 
              src="~@/static/svg/home/withdraw.svg" 
              mode="widthFix" 
              style="width: 28px; height: 28px;"
            /> -->

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
              <defs>
                <clipPath id="a">
                  <path d="M0 0h26v26.239H0z" style="fill:none"/>
                </clipPath>
              </defs>
              <g style="clip-path:url(#a)" transform="translate(4.881 4.7)">
                <path style="fill:var(--color-text)" d="M21.356 26.24H4.644A4.65 4.65 0 0 1 0 21.591V15.62a1.087 1.087 0 0 1 2.173 0v5.971a2.474 2.474 0 0 0 2.471 2.472h16.712a2.474 2.474 0 0 0 2.472-2.472V15.62a1.087 1.087 0 1 1 2.173 0v5.971a4.65 4.65 0 0 1-4.644 4.645"/>
                <path style="fill:var(--color-light-primary)" d="M12.999 18.953a1.086 1.086 0 0 1-1.086-1.09V1.653a1.087 1.087 0 0 1 2.173 0v16.21a1.086 1.086 0 0 1-1.087 1.09"/>
                <path style="fill:var(--color-light-primary)" d="M19.844 8.411a1.084 1.084 0 0 1-.768-.318l-5.812-5.812a.373.373 0 0 0-.527 0L6.925 8.093a1.087 1.087 0 0 1-1.537-1.537L11.204.745a2.547 2.547 0 0 1 3.6 0l5.812 5.812a1.086 1.086 0 0 1-.768 1.855"/>
              </g>
              <path d="M0 0h36v36H0z" style="fill:none"/>
            </svg>

            <p class="mt-5 text-by-black" style="font-size: 3.2vw;">{{ $t('noun.withdraw') }}</p>
          </div>
          <div class="flex-col items-center" @click="goInvite">
            <!-- <image 
              src="~@/static/svg/home/invite.svg" 
              mode="widthFix" 
              style="width: 28px; height: 28px;"
            /> -->

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" style="width: 28px; height: 28px; color: var(--color-primary);">
              <defs>
                <clipPath id="a">
                  <path d="M0 0h29.32v26H0z" style="fill:none"/>
                </clipPath>
              </defs>
              <g style="clip-path:url(#a)" transform="translate(4 4.999)">
                <path style="fill:var(--color-light-primary)" d="M28.212 22.673h-6.654a1.107 1.107 0 0 1 0-2.215h6.654a1.107 1.107 0 1 1 0 2.215"/>
                <path style="fill:var(--color-light-primary)" d="M24.886 26a1.107 1.107 0 0 1-1.107-1.107v-6.655a1.107 1.107 0 1 1 2.215 0v6.654a1.107 1.107 0 0 1-1.107 1.107"/>
                <path style="fill:var(--color-text)" d="M13.953 2.215A2.988 2.988 0 1 1 10.964 5.2a2.992 2.992 0 0 1 2.989-2.989m0-2.215a5.2 5.2 0 1 0 5.2 5.2 5.2 5.2 0 0 0-5.2-5.2"/>
                <path style="fill:var(--color-text)" d="M1.107 25.564A1.107 1.107 0 0 1 0 24.456a13.954 13.954 0 0 1 24.787-8.793 1.108 1.108 0 0 1-1.719 1.4 11.739 11.739 0 0 0-20.853 7.4 1.107 1.107 0 0 1-1.107 1.107"/>
                <path style="fill:var(--color-text)" d="M16.062 22.231a3.042 3.042 0 0 1-2.993 2.37l-.224 1.163h-1.072l.239-1.241a2.817 2.817 0 0 1-2.108-1.819l1.135-.784a2.282 2.282 0 0 0 1.258 1.152l.573-2.937a2.386 2.386 0 0 1-1.469-2.653 2.821 2.821 0 0 1 2.4-2.108l.189-.974h1.065l-.189.968a2.247 2.247 0 0 1 1.875 1.6l-1.146.774a1.365 1.365 0 0 0-1-.979l-.489 2.509.167.095c1.262.739 2.052 1.6 1.791 2.864m-2.9-3.565.35-1.808a1.3 1.3 0 0 0-.718.907.908.908 0 0 0 .367.9m.662 2.058-.48 2.437a1.426 1.426 0 0 0 1.285-1.018c.117-.59-.306-1.057-.812-1.418"/>
              </g>
              <path d="M0 0h36v36H0z" style="fill:none"/>
            </svg>

            <p class="mt-5 text-by-black" style="font-size: 3.2vw;">{{ $t('noun.invite') }}</p>
          </div>
        </div>
      </div>
      <div class="pl-5 pr-10 quotes">
        <van-tabs
          v-show="vTabs"
          v-model:active="active"
          shrink
          type="line"
          ref="tabsTradeRefs"
          background="var(--color-background-1)"
          title-active-color="var(--color-tab-text)"
          title-inactive-color="#B0B0B0"
          @click-tab="onClickTab"
        >
          <van-tab :title="$t('noun.spotGoods')">
            <quoteList
              ref="spotQuoteListRefs"
              type="SPOT"
              :maxItems="5"
              :needPullRefresh="false"
            ></quoteList>
            <div class="moreTemp flex justify-center items-center" @click="viewMore">
              <p class="fs-12">{{ $t('homeIndex.viewMore') }}</p>
              <!-- <van-image class="ml-5" width="8" height="10" src="/static/images/right.png" /> -->
              <image
                src="~@/static/images/right.png"
                mode="widthFix"
                class="ml-5"
                style="width: 8px; height: 10px;"
              />
            </div>
          </van-tab>
          <van-tab :title="$t('noun.futureGoods')">
            <quoteList
              ref="futuresQuoteListRefs"
              type="FUTURES"
              :maxItems="5"
              :needPullRefresh="false"
            ></quoteList>
            <div class="moreTemp flex justify-center items-center" @click="viewMore">
              <p class="fs-12">{{ $t('homeIndex.viewMore') }}</p>
              <image
                src="~@/static/images/right.png"
                mode="widthFix"
                class="ml-5"
                style="width: 9px; height: 7px;"
              />
            </div>
          </van-tab>
          <van-tab :title="$t('noun.metalsGoods')">
            <quoteList
              ref="metalsQuoteListRefs"
              type="METALS"
              :maxItems="5"
              :needPullRefresh="false"
            ></quoteList>
            <div class="moreTemp flex justify-center items-center" @click="viewMore">
              <p class="fs-12">{{ $t('homeIndex.viewMore') }}</p>
              <!-- <van-image class="ml-5" width="9" height="7" src="/static/images/right.png" /> -->
              <image
                src="~@/static/images/right.png"
                mode="widthFix"
                class="ml-5"
                style="width: 9px; height: 7px;"
              />
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div class="mt-5 pt-10 news">
        <van-tabs
          v-model:active="tabType"
          ref="tabsNewsRefs"
          background="var(--color-background-1)"
          title-active-color="var(--color-tab-text)"
          title-inactive-color="#B0B0B0"
          @click-tab="clickNews"
          shrink
        >
          <van-tab :title="$t('news.cryptocurrency')" name="cryptocurrency">
            <div class="newsTemp mt-20 ml-15 mr-15 ">
              <div class="title flex justify-start items-center">
                <div class="Dot"></div>
                <text class="ml-10 fs-14 fw-b text-balck">{{formatDate(feed?.lastBuildDate,'PP')}}</text>
              </div>
            </div>
            <div class="article ml-15 mr-15">
              <div class="entry" v-for="(item,index) in feed?.items" :key="index">
                <div class="time flex items-center text-gray fs-12">
                  <div style="
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #B0B0B0;"
                  ></div>
                  <text class="ml-15">{{formatDate(item?.pubDate,'p')}}</text>
                </div>
                <div class="title ml-15 fw-b text-black mt-10 fs-16">{{item?.title}}</div>
                <div class="mt-20">
                  <a :href="item.link" target="_blank" class="view-source ml-15 fs-12" >{{$t('news.original_article')}}</a>
                </div>
              </div>

              <!-- <div class="entry mt-25">
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
              </div> -->
            </div>
          </van-tab>
          <van-tab :title="$t('news.metals')" name="metals">
        <!-- <div class="newsTemp mt-20 ml-15 mr-15 ">
          <div class="title flex justify-start items-center">
            <div class="Dot"></div>
            <text class="ml-10 fs-14 fw-b text-balck">{{formatDate(feed?.lastBuildDate,'PP')}}</text>
          </div>
        </div> -->
        <div class="article ml-15 mr-15">
          <div class="entry" v-for="(item,index) in feed?.items" :key="index">
            <div class="time flex items-center text-gray fs-12">
              <div style="
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: #B0B0B0;"
              ></div>
              <text class="ml-15">{{formatDate(item?.pubDate,'Pp')}}</text>
            </div>
            <div class="title ml-15 fw-b text-black mt-10 fs-16">{{item?.title}}</div>
            <div class="mt-20">
              <a :href="item.link" target="_blank" class="view-source ml-15 fs-12" >{{$t('news.original_article')}}</a>
            </div>
          </div>
        </div>
      </van-tab>
        </van-tabs>
      </div>
    </van-config-provider>
    <CustomNavBar></CustomNavBar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { onLaunch, onShow, onLoad, onUnload } from "@dcloudio/uni-app";
import { useSocket } from '@/utils/socket';
import CustomNavBar from '@/components/customNavBar/index.vue'; // 使用大驼峰命名
import quoteList from '@/components/business/quoteList/index.vue'; // 使用大驼峰命名
import { useUserStore } from '@/stores/user';
import { getAsset } from '@/api/asset';
import { roundDown, formatDate } from '@/utils/util';
import { getNotice,getCustomerService } from '@/api/common';
import rssService from '@/utils/rssService';
import newsService from '@/api/news'
import { useTheme } from '@/theme'

// import rechargeSVG from '@/static/svg/home/recharge.svg'; // 导入SVG文件
const themeVal = uni.getStorageSync('APP_THEME') || 'light'

const userStore = useUserStore();

const active = ref(0);
const tabType = ref(0)
const balance =ref(0) //当前账户总余额

const tabsTradeRefs:any = ref(null)
const tabsNewsRefs:any = ref(null)

// 新增响应式数据存储
const tickerData = ref<Record<string, any>>({});
const depthData = ref<Record<string, any>>({});
const userData = ref({
  balance: 0,
  orders: [] as any[]
});

const pages = ref({
  size: 3,
  current: 1
})

const noticeList =ref([]) //消息列表

const feed = ref({}) //rss 新闻订阅列表

const news =ref(null) //当前点击的新闻tabs

const customerUrl = ref('') //客服链接地址

const vTabs = ref(false) //是否显示tabs

const spotQuoteListRefs = ref<InstanceType<typeof quoteList> | null>(null);
const futuresQuoteListRefs = ref<InstanceType<typeof quoteList> | null>(null);
const metalsQuoteListRefs = ref<InstanceType<typeof quoteList> | null>(null);
const socketService = computed(() => userStore.socketService);

  onLoad(() => {
    uni.hideTabBar()
  })

  // Connect to the socket server
  onMounted(() => {
    vTabs.value = true

    // 切换类型时请求
    nextTick(() => {
      // 请求公告信息
      loadNoticeData()
      // 切换货币信息
      onClickTab({name: 0})
    })
	  getCustomer()
  });

  onShow(()=>{
	  if(userStore.userInfo.userId){
	  	getBalance()
	  }
	  subTicker()
	  rsssub()
  })

  // 手动修复指示器位置

  const setActive = () => {
    active.value = 0
  }

  const subTicker=()=>{
	  nextTick(() => {
	  // 订阅BTC/USDT的实时行情
	  setTimeout(()=>{
	    socketService.value.subscribe('ticker');
	    // 添加行情数据监听
	    socketService.value.on('ticker', (data: any) => {
	      // 示例数据结构处理：{ symbol: 'BTC/USDT', price: 50000, change: 0.22 }
	      // tickerData.value[data.symbol] = data;
	      let currentRef : any
	      switch(active.value){
	        case 0:
	        currentRef = spotQuoteListRefs
	        break
	        case 1:
	        currentRef = futuresQuoteListRefs
	        break
	      case 2:
	        currentRef =metalsQuoteListRefs
	        default:
	      }
	      currentRef.value?.refreshData(data);
	    });
	  },100)
	  })
  }

  // Disconnect from the socket server when the component is unmounted
  onUnmounted(() => {
    console.log('取消订阅 !!!!!!')
    // 取消所有订阅
    socketService.value.unsubscribe('ticker');
  });

  onUnload(() => {
    console.log('uniapp的取消订阅')
    // 取消所有订阅
    socketService.value.unsubscribe('ticker');
  })
const getCustomer =async() =>{
	const data = await getCustomerService()
	customerUrl.value = data
}

 const getBalance = async()=>{
	 const params = {
		 isLogin: false
	 }
	 const data = await  getAsset(params)
	 balance.value = roundDown(data.total,2)
 }
 
 const loadNoticeData = async () => {
   const data = await getNotice({pages: pages.value})
  //  noticeList.value = [{title: '这是公告1'}, {title: '这是公告2'}, {title: '这是公告3'}]
  if (data.records.length > 0) {
    noticeList.value = data.records
  }
 }

  const subscribeFun = () => {
    
  }

  const goTransfer = () => {
    uni.navigateTo({
      url: '/pages/transfer/index',
    });
  };

  const goWithdraw = () => {
    uni.navigateTo({
      url: '/pages/withdrawal/index',
    });
  }

  const goInvite = () => {
    uni.navigateTo({
      url: '/pages/InviteFriends/index',
    });
  }

  const goUser = () => {
    uni.navigateTo({
      url: '/pages/userInfo/index',
    });
  };
  // Function to send a message
  const goRecharge = () => {
    uni.navigateTo({
      url: '/pages/recharge/index'
    })
  };

  // 切换标签
  const onClickTab = (e: any) => {
    nextTick(() => {
	  let currentRef : any
	  switch(active.value){
	  		  case 0:
				currentRef = spotQuoteListRefs
	  		  break
	  		  case 1:
				currentRef = futuresQuoteListRefs
	  		  break
			  case 2:
			  	currentRef =metalsQuoteListRefs
	  		  default:
	  }
      console.log('currentRef', currentRef.value)
      tabsTradeRefs.value?.resize();
      currentRef.value?.clearData();
      currentRef.value?.loadData();
    })
  };

  // 切换新闻标签
  const clickNews = (e: any) => {
    // nextTick(() => {
    //   tabsNewsRefs.value?.resize();
    // })
	news.value = e
	rsssub()
  }

  const viewMore = () => {
    uni.navigateTo({
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
  const goCustomerService = () => {
    // uni.navigateTo({
    //   url: '/pages/customerService/index',
    // });
	location.href = 'https://msg.btchatc1.top?appId=0qkyvQAz&userId='+userStore.userInfo.userId+'&redirectUrl='+encodeURIComponent(customerUrl.value)
  }
  
  const rsssub = async()=>{
	  // console.log(' load rss')
	  if(!news.value || news.value.name === 'cryptocurrency'){
		  feed.value = await rssService.fetchRssFeed('https://rsshub.app/blockworks')
	  }else{
		  feed.value = await newsService.fetchRssData()
		  console.log('feed data = ',feed.value)
	  }
  }
  
  

</script>

<!-- #ifdef APP-PLUS -->
<script module="vconsole" lang="renderjs">  
   import VConsole from 'vconsole' // TODO
   new VConsole() // 使用vconsole
</script>
<!-- #endif -->

<style lang="scss" scoped>
/* App 端特定样式 */
// #ifdef APP-PLUS
:deep(.van-tabs) {
  /* 修复底部指示器样式 */
  .van-tabs__line {
    display: none!important;
  }
  /* 确保激活状态的标签颜色正确 */
  .van-tab--active {
    font-weight: bold;
    color: #333333 !important;
  }
}
// #endif
.home-index {
  min-height: 100vh;
  // background: #F6F8FC;
  background-color: var(--color-background);
  .headerTemp {
    height: 50px;
    line-height: 50px;
    // background: #ffffff;
    background-color: var(--color-background);
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
    background-color: var(--color-background);
    // background-color: #ffffff;
    .deposit-btn {
      width: 84px;
      height: 28px;
    }
  }
  .noLoginTemp {
    background-color: var(--color-background);
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
    // background: #fff;
    background-color: var(--color-background);
      /* 新增公告滚动样式 */
    .marquee-container {
      width: 100%;
      overflow: hidden;
      position: relative;
      min-height: 20px;
      &:empty {
        display: none; /* 当内容为空时隐藏容器 */
      }
      .marquee-content {
        display: flex;
        animation: marquee 10s linear infinite;  // 增加动画时长
        width: auto;  // 移除动态宽度计算
        .marquee-item {
          flex: 0 0 100%;  // 强制每个项占满容器
          min-width: 100%;
          text-align: left;
          padding: 0 15px;
          box-sizing: border-box;
          white-space: nowrap;  // 防止文字换行
        }
      }
    }

    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-245%); }  // 改为相对自身宽度的位移
    }
  }
  .ribbonBox {
    background-color: var(--color-background);

    .ribbon {
      background: var(--color-background-1);
      box-shadow: 0px 0px 6px 1px rgba(0,8,242,0.08);
      border-radius: 16px 16px 16px 16px;
      // color: #fff;
    }
  }
  .quotes {
    padding-top: 5px;
    // padding-bottom: 90px;
    // background: #fff;
    background: var(--color-background-1);
    .rises_falls_btn {
      width: 84px;
      height: 28px;
      border-radius: 6px 6px 6px 6px;
    }
  }
  .news {
    padding-bottom: 90px;
    background: var(--color-background-1);
    .newsTemp {
      .Dot {
        width: 8px;
        height: 8px;
        background: var(--color-light-primary);
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
    border-top: 1px solid var(--color-border-top);
    color: #81858c;
  }
}
</style>