import HttpRequest from './http'
import { merge } from 'lodash-es'
import { HttpRequestOptions, RequestHooks } from './type'
import { getToken } from '../auth'
import { RequestCodeEnum, RequestMethodsEnum } from '@/enums/requestEnums'
import { adaptationUrl } from '@/utils/util'
import cache from '@/utils/cache'

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

        return options
    },
    async responseInterceptorsHook(response) {
        const { statusCode, data } = response as any
        switch (statusCode) {
            case RequestCodeEnum.SUCCESS:
                return response.data
            case RequestCodeEnum.REQUEST_424_ERROR:
                uni.navigateTo({
                    url: '/pages/login/login'
                })
                return Promise.reject()
            case RequestCodeEnum.REQUEST_CODE_ERROR:
            case RequestCodeEnum.REQUEST_401_ERROR:
                return Promise.reject(data.msg)
            case RequestCodeEnum.SYSTEM_ERROR:
                uni.$u.toast('系统错误')
                return Promise.reject(response.data)
            default:
                return data
        }
    },
    async responseInterceptorsCatchHook(options, error) {
        if (options.method?.toUpperCase() == RequestMethodsEnum.POST) {
            uni.$u.toast('请求失败，请重试')
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
