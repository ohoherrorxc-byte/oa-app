import {
  setStore,
  getStore,
  removeStore
} from '@/util/store'
import website from '@/config/website'

const common = {
  state: {
    language: getStore({name: 'language'}) || 'en',
    isCollapse: false,
    isFullScren: false,
    isMenu: true,
    isShade: false,
    screen: -1,
    isLock: getStore({name: 'isLock'}) || false,
    showTag: true,
    showDebug: false,
    showCollapse: true,
    showSearch: true,
    showLock: true,
    showFullScren: true,
    showTheme: false,
    showMenu: true,
    showColor: false,
    themeName: getStore({name: 'themeName'}) || 'default',
    lockPasswd: getStore({name: 'lockPasswd'}) || '',
    website: website,
    refreshTokenId: 0,
    isMobile:false
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      console.log(language+"SET_LANGUAGE")
      state.language = language
      setStore({
        name: 'language',
        content: state.language
      })
    },
    SET_IS_MOBILE: (state, active) => {
      state.isMobile = active;
    },
    SET_SHADE: (state, active) => {
      state.isShade = active;
    },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    SET_FULLSCREN: (state) => {
      state.isFullScren = !state.isFullScren;
    },
    SET_IS_MENU: (state, menu) => {
      state.isMenu = menu;
    },
    SET_LOCK: (state) => {
      state.isLock = true;
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_SCREEN: (state, screen) => {
      state.screen = screen;
    },
    SET_THEME_NAME: (state, themeName) => {
      state.themeName = themeName;
      setStore({
        name: 'themeName',
        content: state.themeName,
      })
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd;
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state) => {
      state.isLock = false;
      state.lockPasswd = '';
      removeStore({
        name: 'lockPasswd',
        type: 'session'
      });
      removeStore({
        name: 'isLock',
        type: 'session'
      });
    },
    SET_REFRESH_TOKEN_ID: (state, id) => {
      state.refreshTokenId = id;
    },
  }
}
export default common
