import { getUserInfo } from '@/api/account'
import { TOKEN_KEY } from '@/enums/cacheEnums'
import cache from '@/utils/cache'
import { defineStore } from 'pinia'

interface UserSate {
    userInfo: Record<string, any>
    token: string | null
    temToken: string | null
}
export const useUserStore = defineStore('userStore', {
    state: (): UserSate => ({
        userInfo: {},
        token: cache.get(TOKEN_KEY) || null,
        temToken: null
    }),
    getters: {
        isLogin: (state) => !!state.token
    },
    actions: {
        async getUser() {
            const { data } = await getUserInfo()
            this.userInfo = data
        },
        login(token: string) {
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
