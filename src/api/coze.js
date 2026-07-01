import request from '@/router/axios';

/**
 * 由 OA 后端签发 Coze OAuth access_token（推荐生产环境，私钥不落前端）。
 * 接口需返回 access_token、expires_in（秒）；路径由 VUE_APP_COZE_JWT_TOKEN_API 配置。
 */
export function fetchCozeChatAccessToken(sessionName) {
  var url = process.env.VUE_APP_COZE_JWT_TOKEN_API || '';
  return request({
    url: url,
    method: 'get',
    params: {
      sessionName: sessionName
    }
  });
}
