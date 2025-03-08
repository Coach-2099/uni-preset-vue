import cache from "@/utils/cache";
import request from "@/utils/request";

//发送短信
export function smsSend(mobile: any) {
  return request.get({ url: "/app/appmobile/" + mobile });
}

export function queryTenantList() {
  return request.get({ url: "/admin/tenant/list" });
}

export function getConfig() {
  return request.get({ url: "/app/index/config" });
}

export function getPolicy(data: any) {
  return request.get({ url: "/app/index/policy", data: data });
}

export function uploadImage(file: any, token?: string) {
  return request.uploadFile({
    url: "/admin/sys-file/upload",
    filePath: file,
    name: "file",
    header: {
      Authorization: `Bearer ${token}`,
      "TENANT-ID": cache.getTenant(),
    },
    fileType: "image",
  });
}

export function wxJsConfig(data: any) {
  return request.get({ url: "/app/wechat/jsConfig", data });
}
