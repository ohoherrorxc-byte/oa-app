module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    // element-ui 按需引入：style: false 表示不注入 per-component CSS，
    // 全部样式由 src/styles/common.scss 的 SCSS 源 import 统一提供（带项目自定义主题色 #203b71）。
    // 第二个无 name 的 import 配置是给 element-ui 子路径（如 'element-ui/lib/.../index'）兜底的。
    ['import', {
      libraryName: 'element-ui',
      style: false
    }, 'element-ui'],
    ['import', {
      libraryName: 'element-ui',
      style: false
    }],
    ["transform-es2015-arrow-functions", { spec: true }]
  ]
}
