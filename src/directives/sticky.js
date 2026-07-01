import Vue from 'vue'
Vue.directive('sticky1', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted(el, binding) {
   
    // 获取表格
    const thead = el.children[1]
    const tbody = el.children[2]
    // 获取滚动元素
    const scrollParent = document.querySelector(binding.value.parent)
    scrollParent.addEventListener('scroll', function () {
       console.log(122121);
      // 获取thead距离顶部的距离
      let theadTop = thead.getBoundingClientRect().top
      if (theadTop <= binding.value.top) {
        thead.style.position = 'fixed'
        thead.style.zIndex = '2021'
        thead.style.top = binding.value.top + 'px'
        thead.style.width = tbody.offsetWidth + 'px'
      }
      // 判断是否需要回归原来位置
      let originally = tbody.getBoundingClientRect().top
      if (originally > binding.value.top) {
        thead.style.position = 'relative'
        thead.style.zIndex = '0'
        thead.style.top = 0 + 'px'
        thead.style.width = tbody.offsetWidth + 'px'
      }
      // 判断底部距离是否超过表头
      let goBeyond =tbody.getBoundingClientRect().bottom
      if (goBeyond <= thead.offsetHeight) {
        thead.style.position = 'relative'
        thead.style.zIndex = '0'
        thead.style.top = 0 + 'px'
        thead.style.width = tbody.offsetWidth + 'px'
      }
    })
  },
})
