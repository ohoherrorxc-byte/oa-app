/**
 * 全局配置文件
 */
import {baseUrl,indexUrl} from "@/config/env";
export default {
  title: "portal",
  // smallLogo: "SAIC<div style='transform: rotate(90deg)'></div>", // 收缩时的logo，支持html
  smallLogo:'<img class="imgSmall" src="'+baseUrl+'/img/logo1.png" />',
  key: 'saber',//配置主键,目前用于存储
  bigLogo: '<img class="imgSmall"  src="'+baseUrl+'/img/logo1.png" /><div style="font-size:16px;margin-top:10px;line-height: 22px;font-weight:500"><p>自动化办公流程</p><p>及进销存管理平台</p></div>', // 正常的logo，支持html
  bigLogoEn: '<img class="imgSmall"  src="'+baseUrl+'/img/logo1.png" /><div style="font-size:16px;margin-top:10px;line-height: 22px;font-weight:500"><p>OA & Purchase-Sale</p></div>', // 正常的logo，支持html
  clientId: 'saic', // 客户端id
  clientSecret: 'saic_secret', // 客户端密钥
  loginRouter: '/login', // 普通用户登录路由
  loginRouterSwitch: '/login/admin', // 普通用户登录路由（可以切换租户）
  loginRouterFleet: '/fleetlogin', // 大客户用户登录路由
  loginRouterSaic: '/saiclogin', // license管理系统登录路由
  tenantMode: true, // 是否开启租户模式
  tenantId: "000000", // 管理组租户编号
  captchaMode: false, // 是否开启验证码模式
  switchMode: false, // 是否开启部门切换模式
  lockPage: '/lock',
  tokenTime: 3000,
  tokenHeader: 'Blade-Auth',
  //http的status默认放行列表
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "首页",
    value: indexUrl,
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children',
      alias:"alias"
    }
  },
  // 第三方系统授权地址
  authUrl: 'http://localhost/blade-auth/oauth/render',
  // 流程设计器地址
  flowDesignUrl: 'http://10.30.5.175:9999',//http://localhost:9999
  // 报表设计器地址(cloud端口为8108,boot端口为80)
  reportUrl: 'http://localhost:8108/ureport',
  // oss存储路径
  ossPath: 'bladex/vehicle/service/',
  // portal头像存储路径
  avatarPath: 'icarx/portal/avatar/',
}
