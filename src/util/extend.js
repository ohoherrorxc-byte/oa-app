// 直接 Array.prototype.xxx = 会被 for...in 枚举到,会污染 Array.prototype。
// pdfjs-dist@2.16+ 启动时主动检查 Array.prototype,发现非预期 enumerable 属性会抛 BaseException,
// 导致整个 PDF 预览链路挂掉。用 Object.defineProperty 把 enumerable 设为 false,
// 功能不变且 for...in 不会枚举到。
if (!Array.prototype.remove) {
  Object.defineProperty(Array.prototype, 'remove', {
    value: function(val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    },
    enumerable: false,
    writable: true,
    configurable: true
  });
}

if (!Date.prototype.Format) {
  Object.defineProperty(Date.prototype, 'Format', {
    value: function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    },
    enumerable: false,
    writable: true,
    configurable: true
  });
}
export const getLastDate =  function (format) {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  if (month === 0) {
    year = year - 1;
    month = '12';
  }
  let lastMonth = year + "-" + (month > 9 ? month : "0" + month)
  
  if (format === "timestamp") {
    return new Date(lastMonth).getTime();
  }
  return lastMonth
 
}