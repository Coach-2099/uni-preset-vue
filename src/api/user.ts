import request from '@/utils/request'

export function getUserCenter(header?: any) {
  return request.get({ url: '/app/appuser/info', header })
}
