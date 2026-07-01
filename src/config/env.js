//环境变量放.env文件中，不再在代码中进行判断
let env = process.env
let baseUrl = env.BASE_URL.replace(/\/$/, '');
let iconfontVersion = ['567566_pwc3oottzol'];
let iconfontUrl = `${baseUrl}/cdn/iconfont/alicdn/font_$key.css`;
let codeUrl = `${baseUrl}/code`
let indexUrl = env.VUE_APP_INDEX || "/oa/homePage/index";

export {
    baseUrl,
    iconfontUrl,
    iconfontVersion,
    codeUrl,
  indexUrl,
    env
}
