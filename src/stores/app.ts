import { defineStore } from 'pinia'
import { getConfig } from '@/api/app'

interface AppSate {
    config: Record<string, any>
}

export const useAppStore = defineStore('appStore', {
    state: (): AppSate => ({
        config: {}
    }),
    getters: {
        getWebsiteConfig: (state) => state.config.website || {},
        getLoginConfig: (state) => state.config.login || {},
        getTabbarConfig: (state) => state.config.tabbar || [],
        getStyleConfig: (state) => state.config.style || {},
        getH5Config: (state) => state.config.h5 || {}
    },
    actions: {
        getImageUrl(url: string) {
            const { VITE_APP_BASE_URL, VITE_IS_H5 } = import.meta.env
            if (url && url.startsWith('http')) {
                return url
            }
            // Otherwise, append VITE_APP_BASE_URL to the url
            return VITE_IS_H5 === 'true' ? `/api${url}` : `${VITE_APP_BASE_URL}${url}`
        },
        async getConfig() {
            const { data } = await getConfig()
            this.config = data
        }
    }
})
