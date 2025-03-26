import { TOKEN_KEY } from '@/enums/cacheEnums'
import cache from '@/utils/cache'
import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/account'
import { getCustomerService } from '@/api/common'

interface UserSate {
    userInfo: Record<string, any>
    token: string | null
    temToken: string | null
    customerServiceUrl: string | null
}
export const useUserStore = defineStore('userStore', {
    state: (): UserSate => ({
        userInfo: {},
        token: cache.get(TOKEN_KEY) || null,
        temToken: null,
        customerServiceUrl: ''
    }),
    getters: {
        isLogin: (state) => !!state.token
    },
    actions: {
        async getUser() {
            const data = await getUserInfo()
            console.log('走这', data)
            this.userInfo = data
        },
        async getCustomerServiceFun() {
            const data = await getCustomerService()
            this.customerServiceUrl = data
        },
        login(token: string) {
            console.log('token', token)
            this.token = token
            cache.set(TOKEN_KEY, token)
        },
        logout() {
            this.token = ''
            this.userInfo = {}
            cache.remove(TOKEN_KEY)
        }
    }
})
