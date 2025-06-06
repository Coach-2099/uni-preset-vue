import { defineStore } from 'pinia'

interface ControlStae {  // 修正拼写错误
  inputShow: boolean
  quotesData: Record<string, any>
  noPopupWindows: boolean //是否弹窗显示下单信息
  canceled: boolean
}

export const useControlStore = defineStore('controlStore', {
  state: (): ControlStae => ({
    inputShow: false,
    quotesData: {}, //根据类型交易对监听
	noPopupWindows: false, //是否弹窗显示下单信息
	canceled:false, //是否已撤单
  }),
  getters: {
    getInputShow: (state) => state.inputShow,
    // getQuotesData: (state) => state.quotesData, // 修正拼写错误，应该是 getQuotesData 而不是 getQuotesDat
	getNoPopupWindows: (state) => state.noPopupWindows,
	getCanceled: (state) =>state.canceled
  },
  actions: {
    setInputShow(show: boolean) {
      this.inputShow = show
    },
    setQuotesData(type:string,data: any) {
      this.quotesData[type] = data
    },
	getQuotesData(type:string){
		return this.quotesData[type]
	},
	setNoPopupWindows(show: boolean){
		this.noPopupWindows = show
	},
	setCanceled(flag: boolean){
		this.canceled = flag
	}
  }
})