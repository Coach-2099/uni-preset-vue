import request from '@/utils/request'

export function getUserCenter(header?: any) {
  return request.get({ url: '/app/appuser/info', header })
}

// 设置或修改资金密码
export function setTradepwd(data: any) {
  return request.put({ url: '/admin/user/setTradepwd', data }) 
}

// 绑定手机号或邮箱
export function bindPhoneOrEmail(data: any) {
  return request.post({ url: '/admin/user/bindPhoneOrEmail', data })
}

// 修改用户昵称or上传头像
export function editUserInfo(data: any) {
  return request.post({ url: '/admin/user/editUserInfo', data })
}
