import { TOKEN_KEY } from '@/enums/cacheEnums'
import cache from '@/utils/cache'
import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/account'
import { getCustomerService } from '@/api/common'
import { useSocket } from '@/utils/socket';

interface UserSate {
    userInfo: Record<string, any>
    token: string | null
    temToken: string | null
    customerServiceUrl: string | null
    socketService: any | null
    isTheme: string | undefined
}
export const useUserStore = defineStore('userStore', {
    state: (): UserSate => ({
        userInfo: cache.get('USER_INFO_KEY') || {},
        token: cache.get(TOKEN_KEY) || null,
        temToken: null,
        customerServiceUrl: '',
        socketService: null,
        isTheme: uni.getStorageSync('APP_THEME') || 'light'
    }),
    getters: {
        isLogin: (state) => !!state.token
    },
    actions: {
        async getUser() {
            const data = await getUserInfo()
            this.userInfo = data
            cache.set('USER_INFO_KEY', data)
        },
        async getCustomerServiceFun() {
            const data = await getCustomerService()
            this.customerServiceUrl = data
        },
        login(token: string) {
            console.log('token', token)
            this.token = token
            cache.set(TOKEN_KEY, token)
            // 开启socket 连接
            // this.socketService = useSocket('ws://172.20.10.12:8888/webSocket')
            // this.socketService?.connect();
            this.initSocket() // 初始化socket 连接
        },
        logout() {
            if (this.socketService) {
                this.socketService.disconnect(); // 断开 WebSocket 连接
                this.socketService = null; // 清空 socketService 引用
            }
            this.token = ''
            this.userInfo = {}
            cache.remove(TOKEN_KEY)
            cache.remove('USER_INFO_KEY') // 退出时清除用户信息缓存
            uni.navigateTo({
                url: '/pages/login/index'
            })
        },
        initSocket() {
            if (this.isLogin && !this.socketService) {
                this.socketService = useSocket(import.meta.env.VITE_WEBSOCKET_BASE_URL)
                this.socketService?.connect();
            }
        }
    }
})

