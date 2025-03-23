import { defineStore } from 'pinia'

interface ControlStae {  // 修正拼写错误
  inputShow: boolean
}

export const useControlStore = defineStore('controlStore', {
  state: (): ControlStae => ({
    inputShow: false
  }),
  getters: {
    getInputShow: (state) => state.inputShow
  },
  actions: {
    setInputShow(show: boolean) {
      this.inputShow = show
    }
  }
})