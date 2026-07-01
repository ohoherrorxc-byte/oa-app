/**
 * 全站权限配置
 *
 */
import router, { getLoginRouter } from './router/router'
import store from './store'
import i18n from './lang';
import { validatenull } from '@/util/validate'
import { getToken } from '@/util/auth'
import { getUserByToken } from '@/api/user'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { codeLogin } from '@/api/user'
import website from "@/config/website"; // progress bar style

NProgress.configure({ showSpinner: false });
const lockPage = store.getters.website.lockPage; //锁屏页

router.beforeEach(async (to, from, next) => {
  const meta = to.meta || {};
  const isMenu = meta.menu === undefined ? to.query.menu : meta.menu;
  //APP端token共享
  if (to.query.token) {
    localStorage.setItem('token', to.query.token)
    localStorage.setItem('isAppWebView', true)
    store.commit('SET_TOKEN', to.query.token);
    await getUserByToken().then(res => {
      store.commit('SET_USER_INFO', res.data.data);
    })
  }
  if (to.query.lang) {
    store.commit("SET_LANGUAGE", to.query.lang === "en-US" ? 'en' : "zh");
    i18n.locale = to.query.lang === "en-US" ? 'en' : "zh"
  }
  store.commit('SET_IS_MENU', isMenu === undefined);
  if (getToken() || to.query.token) {
    if (store.getters.isLock && to.path !== lockPage) { //如果系统激活锁屏，全部跳转到锁屏页
      next({ path: lockPage })

    } else if (to.path === website.loginRouter || to.path === website.loginRouterFleet || to.path === website.loginRouterSaic) { //如果登录成功访问登录页跳转到主页
      next({ path: '/' })
    } else {
      //如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
      if (store.getters.token.length === 0) {
        store.dispatch('FedLogOut').then(() => {
          next({ path: getLoginRouter() })
        })
      } else {
        const value = to.query.src || to.fullPath;
        const label = to.query.name || to.name;
        const meta = to.meta || router.$avueRouter.meta || {};
        const i18n = to.query.i18n;
        // console.log(router.$avueRouter)
        // console.log('avueRouter')
        if (to.query.target) {
          window.open(value)
        } else if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
          store.commit('ADD_TAG', {
            label: label,
            nameLabel: label,
            value: value,
            params: to.params,
            query: to.query,
            meta: (() => {
              if (!i18n) {
                return meta
              }
              return {
                i18n: i18n
              }
            })(),
            group: router.$avueRouter.group || []
          });
        }
        next()
      }
    }
  } else {

    //判断是否需要认证，没有登录访问去登录页 session_state处理统一登录的问题
    let url = window.location.href
    // console.log(router)
    // console.log(to)
    var query = url.split('?')[1]
    let code = getCodeValue(query, 'code')
    if (code) {
      await getCodeToken(code)
      next()
    } else {
      next()
    }
  }
})

router.onError((error) => {

  // 这里的正则表达式可以根据实际情况下js命名来进行修改,“ (\d)+  ”只匹配数字

  const pattern = /Loading chunk (\d)+ failed/g;

  const isChunkLoadFailed = error.message.match(pattern);

  const targetPath = router.history.pending.fullPath;

  if (isChunkLoadFailed) {

    router.replace(targetPath);

  }

})


function getCodeValue(str, key) {
  const params = new URLSearchParams(str)
  const key1 = params.get(key)
  return key1; // 如果找不到key，返回null
}

async function getCodeToken(code) {
  const routes = router.options.routes;
  console.log('Current Routes:', routes);
  let res = await codeLogin(code)
  let data = res.data
  // debugger
  store.commit('SET_TOKEN', data.access_token);
  store.commit('SET_REFRESH_TOKEN', data.refresh_token);
  store.commit('SET_USER_INFO', data);
  store.commit('DEL_ALL_TAG');
  store.commit('CLEAR_LOCK');
 
  // Router.addRoutes([...PageRouter, ...ViewsRouter]);
  // console.log(Router)
  // console.log('iiiiiiiiiiiiiiii')
  // console.log('Router')
}

router.afterEach(() => {
  NProgress.done();
  let title = store.getters.tag.label;
  let i18n = store.getters.tag.meta.i18n;
  title = router.$avueRouter.generateTitle(title, i18n);
  //判断登录页的情况
  if (router.history.current.fullPath === website.loginRouter) {
    title = "Login";
  } else if (router.history.current.fullPath === website.loginRouterFleet) {
    title = "Fleet Login";
  } else if (router.history.current.fullPath === website.loginRouterSaic) {
    title = "Saic Login";
  }
  //根据当前的标签也获取label的值动态设置浏览器标题
  router.$avueRouter.setTitle(title);
});
