import request from "@/utils/request";

// 发起提币申请 TODO: 接口需要加密
export function withdraw(data: any) {
  return request.post({ url: "/admin/asset/withdraw", data })
}

// 内部账户间转账
export function postTransfer(data: any) {
  return request.post({ url: "/admin/asset/transfer", data })
}

// 获取用户充值地址
export function getRecharge(data: any) {
  return request.get({ url: "/admin/asset/recharge", data})
}

// 获取用户充值记录
export function getRechargeList(data: any) {
  return request.get({ url: "/admin/asset/getRechargeList", data})
}

// 获取用户提币记录
export function getWithdrawList(data: any) {
  return request.get({ url: "/admin/asset/getWithdrawList", data})
}

// 获取内部账户之间转账记录
export function getTrasferList(data: any) {
  return request.get({ url: "/admin/asset/getTrasferList", data})
}

// 获取用户总资产信息
export function getAsset(data: any) {
  return request.get({ url: "/admin/asset/getAsset", data })
}

// 获取用户可充值币种列表
export function getRechargeCoins(data: any) {
  return request.get({ url: "/admin/asset/getRechargeCoins", data })
}

// 获取提币地址列表
export function getWithdrawCoins() {
  return request.get({ url: "/admin/asset/getWithdrawCoins" })
}

// 获取内部转账可转的币种列表
export function getTrasferCoins() {
  return request.get({ url: "/admin/asset/getTrasferCoins"})
}

// 获取用户现货交易对每种资产信息
export function getSpotBalance(data: any) {
  return request.get({ url: "/admin/asset/getSpotBalance", data })
}

// 获取合约or 贵金属账户余额
export function getSwapBalance(data: any) {
  return request.get({ url: "/admin/asset/getSwapBalance", data })
}

// 根据账户类型获取余额信息
export function getBalance(data: any) {
  return request.get({ url: "/admin/asset/getBalance", data })
}

// 验证地址的准确性
export function checkAddress(data: any) {
  return request.get({ url: "/admin/asset/checkAddress", data })
}

// 获取提币手续费
export function getTokenFee(data: any) {
  return request.get({ url: "/admin/asset/getTokenFee", data })
}