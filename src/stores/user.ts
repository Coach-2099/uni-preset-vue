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
}
export const useUserStore = defineStore('userStore', {
    state: (): UserSate => ({
        userInfo: {},
        token: cache.get(TOKEN_KEY) || null,
        temToken: null,
        customerServiceUrl: '',
        socketService: null
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

            // 开启socket 连接
            this.socketService = useSocket('ws://172.20.10.12:8888/webSocket')
            // this.socketService?.connect();

            // 添加连接状态监听
            this.socketService?.on('connect_error', (err: Error) => {
                console.error('连接错误:', err , err.message);
            });

            // 带延迟的异步连接
            setTimeout(() => {
                this.socketService?.connect();
                console.log('启动socket连接');
            }, 500);  // 延迟500ms确保组件初始化完成

            // 订阅用户相关数据
            // this.socketService.subscribeUser(this.userInfo.id, ['orders', 'balance']);
        },
        logout() {
            if (this.socketService) {
                this.socketService.disconnect(); // 断开 WebSocket 连接
                this.socketService = null; // 清空 socketService 引用
            }
            this.token = ''
            this.userInfo = {}
            cache.remove(TOKEN_KEY)
        }
    }
})
