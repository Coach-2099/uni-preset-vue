import HttpRequest from './http'
import { merge } from 'lodash-es'
import type { HttpRequestOptions, RequestHooks } from './type'
import { getToken } from '../auth'
import { RequestCodeEnum, RequestMethodsEnum } from '@/enums/requestEnums'
import { adaptationUrl } from '@/utils/util'
import cache from '@/utils/cache'
import {i18n} from '@/i18n' // 假设您的i18n配置在此处

const { t } = i18n.global // 获取国际化函数

const requestHooks: RequestHooks = {
    requestInterceptorsHook(options, config) {
        const { baseUrl, withToken } = config
        options.header = options.header ?? {}
        options.url = `${adaptationUrl(options.url)}`
        if (baseUrl) {
            options.url = `${baseUrl}${options.url}`
        }
        const token = getToken()

        // 添加token
        if (withToken && token) {
            options.header['Authorization'] = `Bearer ${options.header.token || token}`
        }

        // 添加终端类型
        const isToc = import.meta.env.VITE_IS_TOC;
        if (isToc === "true") {
            options.header['CLIENT-TOC'] = 'Y'
        }

        // 添加租户ID
        if (cache.getTenant()) {
            options.header['TENANT-ID'] = cache.getTenant()
        }

        const lang = uni.getStorageSync('language')
        options.header['locale'] = lang || 'en'

        return options
    },
    async responseInterceptorsHook(response) {
        const { statusCode, data } = response as any
        switch (statusCode) {
            case RequestCodeEnum.SUCCESS:
                // 判断为登录接口
                if (data.access_token) return data
                if (data.code == RequestCodeEnum.BUSINESS_SUCCESS_CODE) {
                    return data.data
                }
                if (data.code == RequestCodeEnum.BUSINESS_FAIL_CODE) {
                    if (data.msg) return uni.showToast({title: data.msg, icon: 'none'})
                    return uni.showToast({title: t('request.requestFailed'), icon: 'none'})
                }
            case RequestCodeEnum.REQUEST_424_ERROR:
                uni.navigateTo({
                    url: '/pages/login/index'
                })
                return Promise.reject()
            case RequestCodeEnum.REQUEST_CODE_ERROR:
            case RequestCodeEnum.REQUEST_401_ERROR:
                if (data.msg) uni.showToast({ title: data.msg, icon: 'none' });
                if (!data.msg) uni.showToast({ title: t('request.requestFailedTryAgain'), icon: 'none' });
                return Promise.reject(data.msg)
            case RequestCodeEnum.REQUEST_404_ERROR:
                uni.showToast({ title: t('request.apiNotExist'), icon: 'none' });
            case RequestCodeEnum.SYSTEM_ERROR:
                if (data.msg) uni.showToast({ title: data.msg, icon: 'none' });
                if (!data.msg) uni.showToast({ title: t('request.apiErrorRefresh'), icon: 'none' });
                return Promise.reject(response.data)
            default:
                // return data
                return uni.showToast({
                    title: data.msg,
                    icon: 'none'
                })
        }
    },
    async responseInterceptorsCatchHook(options, error) {
        if (options.method?.toUpperCase() == RequestMethodsEnum.POST) {
            uni.showToast({
                title: t('request.requestFailedRetry'),
                icon: 'none'
            })
        }
        return Promise.reject(error)
    }
}

const defaultOptions: HttpRequestOptions = {
    requestOptions: {
        timeout: 10 * 1000
    },
    baseUrl: import.meta.env.VITE_IS_H5 === 'true' ? '/api' : `${import.meta.env.VITE_APP_BASE_URL}`,
    //是否返回默认的响应
    isReturnDefaultResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // 忽略重复请求
    ignoreCancel: false,
    // 是否携带token
    withToken: true,
    isAuth: false,
    retryCount: 2,
    retryTimeout: 1000,
    requestHooks: requestHooks
}

function createRequest(opt?: HttpRequestOptions) {
    return new HttpRequest(
        // 深度合并
        merge(defaultOptions, opt || {})
    )
}
const request = createRequest()
export default request