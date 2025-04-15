import request from "@/utils/request";

// 获取所有交易对最新行情列表
export function getSymbolsLastPrice(data?: any) {
  return request.get(
    { url: '/admin/kline/getSymbolsLastPrice', data },
    { withToken: false }
  )
}

// 获取交易对的成交数据
export function getTradeDetail(data?: any) {
  return request.get({ url: '/admin/kline/getTradeDetail', data },{withToken: false})
}

// 获取单个交易对最新的实时ticker数据
export function getTicker(data?: any) {
  return request.get(
    { url: '/admin/kline/getTicker', data },
    {  withToken: false }
  )
}

// 获取K线历史行情数据
export function getKlineHistory(data?: any) {
  return request.get(
    { url: '/admin/kline/getKlineHistory', data },{withToken: false})
}

// 获取交易对的深度数据
export function getDepth(data?: any) {
  return request.get(
    { url: '/admin/kline/getDepth', data },
    {  withToken: false }
  )
}
