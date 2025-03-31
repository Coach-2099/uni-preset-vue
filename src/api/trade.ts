import request from "@/utils/request";

// 新增交易对管理
export function addTradeSymbol(data: any) {
  return request.post({ url: "/admin/tradeSymbol", data })
}

// 修改交易对管理
export function updateTradeSymbol(data: any) {
  return request.put({ url: "/admin/tradeSymbol", data })
}

// 删除交易对管理
export function deleteTradeSymbol(data: any) {
  return request.delete({ url: "/admin/tradeSymbol", data })
}

// 获取交易对相关参数信息
export function getSymbolInfo(data?: any) {
  return request.get({ url: '/admin/trade/getSymbolInfo', data })
}

// 获取现货订单列表
export function getOrderList(data?: any) {
  return request.get({ url: '/admin/trade/getOrderList', data })
}

// 获取合约or贵金属交易订单列表
export function getFuturesOrderList(data?: any) {
  return request.get({ url: '/admin/trade/getFuturesOrderList', data })
}