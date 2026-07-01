import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
import enAvueOverride from './en-avue-override'
// 升级 vue-cli 5 后 AVUE 从 CDN 改为 npm 打包，window.AVUE 在 lang/index.js 求值时尚未赋值
// （main.js 里 window.AVUE = AVUE 在 import i18n 之后才执行）。直接 import AVUE 模块即可
// 让 ES module 静态分析保证它在 lang/index.js 求值前已加载。
import AVUE from '@smallwei/avue'
import { getStore } from '@/util/store'
import {env} from "@/config/env";
Vue.use(VueI18n)
const Avue = AVUE;
const messages = {
  en: {
    ...elementEnLocale,
    ...Avue.locale.en,
    ...enLocale,
    ...enAvueOverride,
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
    ...Avue.locale.zh,
  }
}
const i18n = new VueI18n({
  locale: getStore({ name: 'language' }) || env.VUE_APP_LANGUAGE || 'zh',
  messages
})

export default i18n
