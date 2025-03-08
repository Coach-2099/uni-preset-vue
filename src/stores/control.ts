import { defineStore } from 'pinia'

interface ControlSate {
  inputShow: boolean
}

export const useControlStore = defineStore({
  id: 'controlStore',
  state: (): ControlSate => ({
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