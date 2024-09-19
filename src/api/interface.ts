export enum RESPONSE_CODE {
  /**
   * 成功
   */
  SUCCESS = 200,
  /**
   * 请求失败
   */
  FAIL = 400,
  /**
   * token失效
   */
  TOKEN_INVALID = 401,
  /**
   * 权限不足
   */
  PERMISSION_DENIED = 403,
  /**
   * 服务出错
   */
  ERROR = 500
}

export interface ApiResponse<T = any> {
  data: T;
  error: boolean;
  success: boolean;
  message: string;
}
