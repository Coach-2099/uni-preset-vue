export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data   上传资源（图片，视频）
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}

export enum RequestMethodsEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export enum RequestCodeEnum {
  SUCCESS = 200, //成功
  BUSINESS_FAIL_CODE = 1, // 请求成功，业务失败
  BUSINESS_SUCCESS_CODE = 0, // 请求成功，业务成功
  FAILED = 300, // 失败
  PARAMS_VALID_ERROR = 310, //参数校验错误
  PARAMS_TYPE_ERROR = 311, //参数类型错误
  REQUEST_METHOD_ERROR = 312, //请求方法错误
  ASSERT_ARGUMENT_ERROR = 313, //断言参数错误
  ASSERT_MYBATIS_ERROR = 314, //断言mybatis错误
  LOGIN_ACCOUNT_ERROR = 330, //登陆账号或密码错误
  LOGIN_DISABLE_ERROR = 331, //登陆账号已被禁用
  TOKEN_EMPTY = 332, // TOKEN参数为空
  TOKEN_INVALID = 333, // TOKEN参数无效
  NO_PERMISSTION = 403, //无相关权限
  REQUEST_404_ERROR = 404, //请求接口不存在
  REQUEST_401_ERROR = 401, //401
  REQUEST_424_ERROR = 424, //401
  REQUEST_CODE_ERROR = 428, //验证码错误
  SYSTEM_ERROR = 500 //系统错误
}

export enum RequestErrMsgEnum {
  ABORT = 'request:fail abort',
  TIMEOUT = 'request:fail timeout'
}
