import cache from "@/utils/cache";
import request from "@/utils/request";
import { getToken } from '@/utils/auth'

export function uploadImage(file: any) {
  return request.uploadFile({
    url: "/admin/user/uploadImg",
    filePath: file,
    name: "file",
    header: {
      Authorization: `Bearer ${getToken}`,
      "TENANT-ID": cache.getTenant(),
    },
    fileType: "image",
  });
}

