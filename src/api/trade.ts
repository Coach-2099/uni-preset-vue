import request from "@/utils/request";

// 获取交易对相关参数信息
export function getSymbolInfo(data?: any) {
  return request.get({ url: '/admin/trade/getSymbolInfo', data })
}

// 获取合约交易杠杆列表
export function getLeverages(data?: any) {
  return request.get({ url: '/admin/trade/getLeverages', data })
}


// 现货交易下单
export function spotTrade(data?: any) {
  return request.post({ url: '/admin/trade/spotTrade', data })
}

// 根据订单号取消现货订单
export function cancelOrder(data?: any) {
  return request.post({ url: '/admin/trade/cancelOrder', data })
}

// 根据现货订单号查询订单信息
export function getOrderInfo(data?: any) {
  return request.get({ url: '/admin/trade/getOrderInfo', data })
}

// 根据现货id查询成交明细列表
export function getOrderDetail(data?: any) {
  return request.get({ url: '/admin/trade/getOrderDetail', data })
}

// 获取现货订单列表
export function getOrderList(data?: any) {
  return request.get({ url: '/admin/trade/getOrderList', data })
}

// 获取合约or贵金属交易订单列表
export function getFuturesOrderList(data?: any) {
  return request.get({ url: '/admin/trade/getFuturesOrderList', data })
}

// 合约交易下单
export function futuresTrade(data?: any) {
  return request.post({ url: '/admin/trade/futuresTrade', data })
}

// 合约or贵金属交易撤单
export function cancelFuturesOrder(data?: any) {
  return request.post({ url: '/admin/trade/cancelFuturesOrder', data })
}

// 合约or贵金属交易平仓处理
export function closeOrder(data?: any) {
  return request.post({ url: '/admin/trade/closeOrder', data })
}

// 贵金属交易下单
export function metalsTrade(data?: any) {
  return request.post({ url: '/admin/trade/metalsTrade', data })
}

// 设置止盈止损
export function setProfitOrLoss(data?: any) {
  return request.post({ url: '/admin/trade/setProfitOrLoss', data })
}