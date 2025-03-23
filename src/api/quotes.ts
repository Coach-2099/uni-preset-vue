import request from "@/utils/request";

// 获取所有交易对最新行情列表
export function getSymbolsLastPrice(header?: any) {
  return request.get({ url: '/admin/kline/getSymbolsLastPrice', header })
}

// 获取交易对的成交数据
export function getTradeDetail(header?: any) {
  return request.get({ url: '/admin/kline/getTradeDetail', header })
}

// 获取单个交易对最新的实时ticker数据
export function getTicker(header?: any) {
  return request.get({ url: '/admin/kline/getTicker', header })
}

// 获取K线历史行情数据
export function getKlineHistory(header?: any) {
  return request.get({ url: '/admin/kline/getKlineHistory', header })
}

// 获取交易对的深度数据
export function getDepth(header?: any) {
  return request.get({ url: '/admin/kline/getDepth', header })
}
