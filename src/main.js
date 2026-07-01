/*
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-05-30 16:45:17
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-07-31 10:44:49
 * @FilePath: \icarx-ui\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import Vue from 'vue';
import Vue from 'vue';
// element-ui 按需引入（babel-plugin-import 处理）；style: false 表示不注入 CSS，
// 所有样式由 src/styles/common.scss 统一提供（带项目自定义主题色 #203b71）
import {
  Alert, Autocomplete, Avatar, Badge, Breadcrumb, BreadcrumbItem,
  Button, ButtonGroup, Calendar, Card, Carousel, CarouselItem,
  Cascader, Checkbox, CheckboxGroup, Col, Collapse, CollapseItem,
  ColorPicker, Container, DatePicker, Dialog, Divider, Drawer,
  Dropdown, DropdownItem, DropdownMenu, Empty, Form, FormItem,
  Image, Input, InputNumber, Link, Loading, Menu, MenuItem, Message,
  MessageBox, Notification, Option, OptionGroup, PageHeader, Pagination,
  Popover, Progress, Radio, RadioButton, RadioGroup, Row, Scrollbar, Select,
  Skeleton, SkeletonItem, Slider, Submenu, Switch, TabPane, Table, TableColumn,
  Tabs, Tag, TimePicker, TimeSelect, Timeline, TimelineItem,
  Tooltip, Tree, Upload
} from 'element-ui';
// AVUE 从 CDN 改为 npm 打包（@smallwei/avue@2.8.25，匹配原 CDN 版本号）
import AVUE from '@smallwei/avue';
import axios from './router/axios';
// import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import './cache';//页面缓存
import './util/extend';
import watermark from '@/util/watermark'
import store from './store';
import {loadStyle} from './util/util'
import * as urls from '@/config/env';
import {
  iconfontUrl,
  iconfontVersion
} from '@/config/env';
import i18n from './lang'; // Internationalization
import './styles/common.scss';
import basicBlock from './components/basic-block/main';
import basicContainer from './components/basic-container/main';
import thirdRegister from './components/third-register/main';
import searchForm from "@/components/searchForm";
import tableForm from './components/tableForm';
// avue-plugin-ueditor 不能再顶层 import:它内部依赖 wangeditor (~157KB),
// 静态 import 会让 vendors.js 无条件拖进 wangeditor + ueditor 全家桶
// 改成下面 Vue.component('avueUeditor', ...) 时按需 import
import website from '@/config/website';
import crudCommon from '@/mixins/crud';
// import VideoPlayer from 'vue-video-player'
// import 'vue-video-player/src/custom-theme.css'
// import 'video.js/dist/video-js.css'
import fullscreen from 'vue-fullscreen'
import { formatAmt,findByvalue } from "@/util/util";
// import formCreate from '@form-create/form-create'
import formCreate from '@form-create/element-ui'
import draggable from 'vuedraggable'
// import enLocale from 'element-ui/lib/locale/lang/en'
// import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// @form-create/designer 不再在这里静态 import + Vue.use：
//   在 views/oa/formEditor/index.vue 里按需 import,小屏 (window.$isMobile)
//   时直接提示"请用电脑访问",不再下载这 1.46MB 的 designer
Vue.use(formCreate)
// 屏幕宽度标记：用于 main.js / 各业务模块按屏幕大小跳过重型依赖
// iframe 嵌到 OAmobile 里时 innerWidth 通常 < 768，可以省下 form-create designer、PDF 预览等大头
window.$isMobile = window.innerWidth <= 768

// import VueSignaturePad from "vue-signature-pad";
// Vue.use(VueSignaturePad);

Vue.use(fullscreen)
// Vue.use(VideoPlayer)
Vue.use(draggable)
// Vue.use(formCreate)
// @form-create/designer 改为在表单设计器页面按需加载（见 views/oa/formEditor/index.vue）
// Vue.use(FcDesigner)

window.axios = axios
Vue.prototype.$axios = axios
// Vue.use(SkuForm);
// Vue.use(Vant);
// 注册全局crud驱动
window.$crudCommon = crudCommon;
// 加载Vue拓展
Vue.use(router);
// Vue.use(VueAxios, axios);
// 设置 Input 组件默认 clearable 属性
// Element.Input.props.clearable.default = true;
// // 设置 Select 组件默认 clearable、filterable 属性
// // Element.Select.props.clearable.default = true;
// Element.Select.props.filterable.default = true;
// element-ui 按需：先在原型上设 $ELEMENT（组件 install 时读这里的默认 size/i18n），再批量注册
Vue.prototype.$ELEMENT = {
  size: 'mini',
  zIndex: 3000,
  i18n: (key, value) => i18n.t(key, value),
}
const ElComponents = [
  Alert, Autocomplete, Avatar, Badge, Breadcrumb, BreadcrumbItem,
  Button, ButtonGroup, Calendar, Card, Carousel, CarouselItem,
  Cascader, Checkbox, CheckboxGroup, Col, Collapse, CollapseItem,
  ColorPicker, Container, DatePicker, Dialog, Divider, Drawer,
  Dropdown, DropdownItem, DropdownMenu, Empty, Form, FormItem,
  Image, Input, InputNumber, Link, Menu, MenuItem, Option,
  OptionGroup, PageHeader, Pagination, Popover, Progress, Radio,
  RadioButton, RadioGroup, Row, Scrollbar, Select, Skeleton,
  SkeletonItem, Slider, Submenu, Switch, TabPane, Table, TableColumn,
  Tabs, Tag, TimePicker, TimeSelect, Timeline, TimelineItem,
  Tooltip, Tree, Upload
]
ElComponents.forEach(comp => Vue.use(comp))

// 按需引入时 ElementUI 不会再自动挂载这些 prototype 方法（老代码 this.$message / this.$confirm / this.$notify / this.$loading 都在用）
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

// lang/index.js 在模块加载时会访问 Avue.locale，所以必须先挂在 window
window.AVUE = AVUE
Vue.use(AVUE, {
  size: 'mini',
  tableSize: 'small',
  calcHeight: 65,
  i18n: (key, value) => i18n.t(key, value)
});
import '@/directives/table-sticky.js'
// import stacky from '@/util/table-sticky'
// Vue.mixin(stacky)

// 注册全局容器
Vue.component('basicContainer', basicContainer);
Vue.component('basicBlock', basicBlock);
Vue.component('thirdRegister', thirdRegister);
// avueUeditor 统一走异步组件：仅当某个 avue-form 列配了 type:'ueditor' 真正渲染时才下载
// avue-plugin-ueditor 内部依赖 wangeditor (~157KB),不能静态 import 否则 wangeditor 必进 vendors
// 桌面/手机都用异步路径,行为完全一致,只是省掉了 wangeditor 的首屏加载
// Vue.component('avueUeditor', () => import('avue-plugin-ueditor'))
Vue.component('SearchForm', searchForm);
Vue.component('TableForm', tableForm);
// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
});
// 加载website
Vue.prototype.website = website;
Vue.prototype.$formatAmt = formatAmt // 全局格式化金额
Vue.prototype.$findByvalue = findByvalue // 根据字典的value查找对应的index
// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele));
});

Vue.config.productionTip = false;
Vue.config.silent = true; // 关闭浏览器控制台里的 [Vue warn] 噪音（升级 vue-cli 5 后大量历史代码触发警告刷屏）
let screenWidth = window.innerWidth;
if (screenWidth > 768) {
  watermark.set()
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');

