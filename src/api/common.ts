import request from "@/utils/request";

// 获取banner
export function getBanner(data: any) {
  return request.get({ url: "/admin/common/banner", data },{withToken: false})
}

// 获取公告
export function getNotice(data: any) {
  return request.get({ url: "/admin/common/notice", data },{withToken: false})
}

// 获取客服链接
export function getCustomerService(header?: any) {
  return request.get({ url: "/admin/common/getCustomerService", header },{withToken: false});
}