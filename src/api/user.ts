import request from '@/utils/request'

export function getUserCenter(header?: any) {
  return request.get({ url: '/app/appuser/info', header })
}

// 设置或修改资金密码
export function setTradepwd(data: any) {
  return request.put({ url: '/admin/user/setTradepwd', data }) 
}
