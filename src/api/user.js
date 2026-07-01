import request from '@/router/axios';
import website from "@/config/website";

export const loginByUsername = (tenantId, deptId, roleId, username, password, type, key, code, isFleet) => request({
  url: '/api/oa-auth/oauth/token',
  method: 'post',
  headers: Object.assign({
    'tenant-id': tenantId,
    'Dept-Id': (website.switchMode ? deptId : ''),
    'Role-Id': (website.switchMode ? roleId : ''),
    'Captcha-Key': key,
    'Captcha-Code': code,
  }, isFleet ? {
    'User-Type': 'web_fleet',
    'Client-Type': 'WEB',
  } : {}),
  params: {
    tenantId,
    username,
    password,
    grant_type: (website.captchaMode ? "captcha" : "password"),
    scope: "all",
    type
  }
});

// export const codeLogin = ( code) => request({
//   url: '/api/oa-auth/oauth/codeLoginWeb',
//   method: 'post',
//   params: {
//     code,
//   }
// });

export const codeLogin = ( code) => request({
  url: '/api/oa-auth/oauth/idm/codeLoginApp',
  method: 'post',
  params: {
    code,
  }
});

export const loginBySocial = (tenantId, source, code, state) => request({
  url: '/api/oa-auth/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    source,
    code,
    state,
    grant_type: "social",
    scope: "all",
  }
})

export const refreshToken = (refresh_token, tenantId, isFleet) => request({
  url: '/api/oa-auth/oauth/token',
  method: 'post',
  headers: Object.assign({
    'tenant-id': tenantId
  }, isFleet ? {
    'User-Type': 'web_fleet',
    'Client-Type': 'WEB',
  } : {}),
  params: {
    tenantId,
    refresh_token,
    grant_type: "refresh_token",
    scope: "all",
  }
});

export const registerGuest = (form, oauthId) => request({
  url: '/api/oa-user/register-guest',
  method: 'post',
  params: {
    tenantId: form.tenantId,
    name: form.name,
    account: form.account,
    password: form.password,
    oauthId
  }
});

export const getButtons = () => request({
  url: '/api/oa-system/menu/buttons',
  method: 'get'
});

export const getUserByToken = ()=> request({
  url: "/api/oa-app/user/getUserInfoByToken",
  method: 'get'
});

export const getCaptcha = () => request({
  url: '/api/oa-auth/oauth/captcha',
  method: 'get'
});

export const logout = () => request({
  url: '/api/oa-auth/oauth/logout',
  method: 'get'
});

export const getUserInfo = () => request({
  url: '/api/oa-auth/oauth/user-info',
  method: 'get'
});

export const sendLogs = (list) => request({
  url: '/api/oa-auth/oauth/logout',
  method: 'post',
  data: list
});

export const clearCache = () => request({
  url: '/api/oa-auth/oauth/clear-cache',
  method: 'get'
});
