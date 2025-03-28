import { defineStore } from 'pinia'

interface ControlStae {  // 修正拼写错误
  inputShow: boolean
  quotesData: Record<string, any>
}

export const useControlStore = defineStore('controlStore', {
  state: (): ControlStae => ({
    inputShow: false,
    quotesData: {}
  }),
  getters: {
    getInputShow: (state) => state.inputShow,
    getQuotesData: (state) => state.quotesData // 修正拼写错误，应该是 getQuotesData 而不是 getQuotesDat
  },
  actions: {
    setInputShow(show: boolean) {
      this.inputShow = show
    },
    setQuotesData(data: any) {
      this.quotesData = data
    }
  }
})