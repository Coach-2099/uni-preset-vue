import request from "@/utils/request";
import { encryption, encryptionBase64 } from "@/utils/util";
import qs from "qs";

const basicAuth =
  "Basic " + encryptionBase64(import.meta.env.VITE_OAUTH2_APP_CLIENT);

const basicMobileAuth =
    "Basic " + encryptionBase64(import.meta.env.VITE_OAUTH2_MOBILE_CLIENT);


// 账号密码登录
export function accountLogin(data: Record<string, any>) {
  data.grant_type = 'password'
  data.scope = 'server'

  return request.post(
    {
      url: "/auth/oauth2/token?" + qs.stringify(data),
      header: {
        Authorization: basicAuth,
        "content-type": "application/x-www-form-urlencoded",
      },
    },
    { withToken: false }
  );
}

//注册
export function register(data: Record<string, any>) {
  return request.post({ url: "/admin/user/register", data },{withToken: false});
}

// 找回密码
export function findpwd(data:any) {
  return request.put({ url: "/admin/common/findpwd", data },{withToken: false})
}

// 检查手机号-帐号-邮箱是否存在
export function chkAccount(data?: any) {
  return request.get({ url: "/admin/common/chkAccount", data},{withToken: false});
}

// 发送消息验证码
export function sendmsg(data: Record<string, any>) {
  return request.post({ url: "/admin/common/sendmsg", data },{withToken: false});
}

// 获取用户信息
export function getUserInfo(header?: any) {
  return request.get({ url: "/admin/user/getUserInfo", header });
}

// 实名认证kyc
export function userKyc(data: Record<string, any>) {
  return request.post({ url: "/admin/user/kyc", data });
}

// 修改密码
export function updatepwd(data: Record<string, any>) {
  return request.put({ url: "/admin/user/updatepwd", data });
}

// 检测用户名验证码是否正确
export function checkCodeRight(data: Record<string, any>) {
  return request.get({ url: "/admin/user/checkCodeRight", data });
}


