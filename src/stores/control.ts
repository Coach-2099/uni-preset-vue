import { defineStore } from 'pinia'

interface ControlStae {  // 修正拼写错误
  inputShow: boolean
  quotesData: Record<string, any>
  noPopupWindows: boolean //是否弹窗显示下单信息
}

export const useControlStore = defineStore('controlStore', {
  state: (): ControlStae => ({
    inputShow: false,
    quotesData: {},
	noPopupWindows: false, //是否弹窗显示下单信息
  }),
  getters: {
    getInputShow: (state) => state.inputShow,
    getQuotesData: (state) => state.quotesData, // 修正拼写错误，应该是 getQuotesData 而不是 getQuotesDat
	getNoPopupWindows: (state) => state.noPopupWindows
  },
  actions: {
    setInputShow(show: boolean) {
      this.inputShow = show
    },
    setQuotesData(data: any) {
      this.quotesData = data
    },
	setNoPopupWindows(show: boolean){
		this.noPopupWindows = show
	}
  }
})