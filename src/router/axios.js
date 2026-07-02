/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios';
import store from '@/store/';
import router, {getLoginRouter} from '@/router/router';
import {serialize} from '@/util/util';
import {getToken} from '@/util/auth';
import {Message} from 'element-ui';
import website from '@/config/website';
import {Base64} from 'js-base64';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { env } from '@/config/env';

if (process.env.VUE_APP_BASE_API) {
  axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
}
console.log(env)
console.log(env+'环境下的接口地址为：'+axios.defaults.baseURL)
axios.interceptors.request.use(config => {
  if(env.NODE_ENV==='development')return config;
  if (config.url && typeof config.url === 'string' && config.url.startsWith('/api/')) {
    config.url = config.url.slice(4); // 去掉开头的 '/api'，保留后面的 '/'
  }
  return config;
});
//默认超时时间
axios.defaults.timeout = 1000000;
//返回其他状态码
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500;
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress 配置
NProgress.configure({
  showSpinner: false
});
//http request拦截
axios.interceptors.request.use(async config => {
  //如果是统一登录的页面且没有token的时候，所有请求先拦截
  let TOKEN = getToken()
  //开启 progress bar
  NProgress.start();
  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  config.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
  //给所有的请求都加上tenant-id头，以便ELK中能追踪
  if (!config.headers['tenant-id']) { //登陆页租户切换时，已有的租户号
    config.headers['tenant-id'] = store.getters.userInfo.tenant_id;
  }
  //让每个请求携带token
  // console.log(getToken())
  if (TOKEN && !isToken) {
    config.headers[website.tokenHeader] = 'bearer ' + TOKEN
  }
  //headers中配置text请求
  if (config.text === true) {
    config.headers["Content-Type"] = config.ContentType||"text/plain"; 
  }
  if(localStorage.getItem('isAppWebView')){
    config.headers['is-app-webView'] = localStorage.getItem('isAppWebView')
  }
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});
//http response 拦截
axios.interceptors.response.use(res => {
  //关闭 progress bar
  NProgress.done();
  //获取状态码
  const status = res.data.code || res.status;
  const statusWhiteList = website.statusWhiteList || [];
  const message = res.data.msg || res.data.message || res.data.error_description || '未知错误';
  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res);
  //如果是401则跳转到登录页面
  if (status === 401) store.dispatch('FedLogOut').then(() => router.push({path: getLoginRouter()}));
  // 如果请求为非200否者默认统一处理
  if (status !== 200) {
    Message({
      message: message,
      type: 'error'
    });
  }
  return res;
}, error => {
  NProgress.done();
  // console.log('err', error)
  return Promise.reject(new Error(error));
});


export default axios;
