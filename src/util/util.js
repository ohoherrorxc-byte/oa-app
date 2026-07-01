import { validatenull } from './validate'
// PDFDocument 不再顶层 import：合并 PDF 不是首屏必备功能,改为调用时再 import
// 原本顶层 import 导致 util.js 任何调用方都会拉进 pdf-lib (~0.93MB)
//表单序列化
export const serialize = data => {
  let list = [];
  Object.keys(data).forEach(ele => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&');
};


export async function mergePDFs(pdfBlobs) {
  if (window.$isMobile) {
    console.warn('[mergePDFs] 小屏跳过 PDF 合并')
    return null
  }
  const { PDFDocument } = await import('pdf-lib')
  const mergedPdf = await PDFDocument.create();

  for (const pdfBlob of pdfBlobs) {
    const pdfBytes = await pdfBlob.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const mergedPdfFile = await mergedPdf.save();
  return new Blob([mergedPdfFile], { type: 'application/pdf' });
}
export const getObjType = obj => {
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  if (obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
};
export const getViewDom = () => {
  return window.document.getElementById('avue-view').getElementsByClassName('el-scrollbar__wrap')[0]
}
/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data);
  var obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status) => {
  if (status) {
    document.body.className = document.body.className + ' grayMode';
  } else {
    document.body.className = document.body.className.replace(' grayMode', '');
  }
};
/**
 * 设置主题
 */
export const setTheme = (name) => {
  document.body.className = name;
}

/**
 * 加密处理
 */
export const encryption = (params) => {
  let {
    data,
    type,
    param,
    key
  } = params;
  let result = JSON.parse(JSON.stringify(data));
  if (type == 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele]);
    })
  } else if (type == 'Aes') {
    param.forEach(ele => {
      result[ele] = window.CryptoJS.AES.encrypt(result[ele], key).toString();
    })

  }
  return result;
};


/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
};
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
  function listen() {
    callback()
  }

  document.addEventListener("fullscreenchange", function () {
    listen();
  });
  document.addEventListener("mozfullscreenchange", function () {
    listen();
  });
  document.addEventListener("webkitfullscreenchange", function () {
    listen();
  });
  document.addEventListener("msfullscreenchange", function () {
    listen();
  });
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  var isFullscreen = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
  return isFullscreen;
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
};
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length != 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id == id) {
          return menu[i];
        } else {
          if (menu[i].children[j].children.length != 0) {
            return findParent(menu[i].children[j].children, id);
          }
        }
      }
    }
  }
};
/**
 * 判断2个对象属性和值是否相等
 */

/**
 * 动态插入css
 */

export const loadStyle = url => {
  const link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
};
/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
  return obj1["value"].split('?')[0] === obj2["value"].split('?')[0]
}
export const diff2 = (obj1, obj2) => {
  delete obj1.close;
  var o1 = obj1 instanceof Object;
  var o2 = obj2 instanceof Object;
  if (!o1 || !o2) { /*  判断不是对象  */
    return obj1 === obj2;
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
    //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (var attr in obj1) {
    /*debugger
    if (attr === "value") {
      if (obj1["value"].split('?')[0] !== obj2["value"].split('?')[0]) {
        return false;
      }
      continue;
    }*/
    var t1 = obj1[attr] instanceof Object;
    var t2 = obj2[attr] instanceof Object;
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr]);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
}
/**
 * 根据字典的value显示label（customKey）
 */
export const findByvalue = (dic, value, customKey) => {
  let result = '';
  if (validatenull(dic)) return value;
  if (typeof (value) == 'string' || typeof (value) == 'number' || typeof (value) == 'boolean') {
    let index = 0;
    index = findArray(dic, value);
    if (index != -1) {
      result = customKey ? eval('dic[index].' + customKey) : dic[index].label;
    } else {
      result = value;
    }
  } else if (value instanceof Array) {
    result = [];
    let index = 0;
    value.forEach(ele => {
      index = findArray(dic, ele);
      if (index != -1) {
        result.push(customKey ? eval('dic[index].' + customKey) : dic[index].label);
      } else {
        result.push(value);
      }
    });
    result = result.toString();
  }
  return result;
};
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value == value) {
      return i;
    }
  }
  return -1;
};
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = '';
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len ? len : 4);
  if (date) random = random + Date.now();
  return random;
};
/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

/**
 * 获取顶部地址栏地址
 */
export const getTopUrl = () => {
  return window.location.href.split("/#/")[0];
}

/**
 * 获取url参数
 * @param name 参数名
 */
export const getQueryString = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(decodeURI(r[2]));
  return null;
}

/**
 * 获取url参数2
 * @param str
 * @param name
 * @returns {string|null}
 */
export const getQueryString2 = (str, name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = str.substr(0).match(reg);
  if (r != null) return r[2];
  return null;
}

/**
 * 下载文件
 * @param {String} path - 文件地址
 * @param {String} name - 文件名,eg: test.png
 */
export const downloadFileBlob = (path, name) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', path);
  xhr.responseType = 'blob';
  xhr.send();
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      // 如果是IE10及以上，不支持download属性，采用msSaveOrOpenBlob方法，但是IE10以下也不支持msSaveOrOpenBlob
      if ('msSaveOrOpenBlob' in navigator) {
        navigator.msSaveOrOpenBlob(this.response, name);
        return;
      }
      const url = URL.createObjectURL(this.response);
      console.log(url)
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
}
export const downBlobFile = (path, name) => {
  let url = window.URL.createObjectURL(path)
  let a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.setAttribute('download', name)
  document.body.appendChild(a)
  a.click() //执行下载
  window.URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}
export function isGoogleChrome() {
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  return isChrome;
}
export const fileDownload = (url, name) => {
  var link = document.createElement('a');
  link.style.display = 'none';
  // 设置下载链接和文件名
  link.setAttribute('href', url);
  link.setAttribute('download', name);
  link.download = name;
  document.body.appendChild(link);
  // 模拟点击下载
  link.click();
  // 清理操作
  document.body.removeChild(link);
}
function findTag(value, tagList) {
  let tag, key;
  tagList.map((item, index) => {
    if (item.value === value) {
      tag = item;
      key = index;
    }
  });
  return { tag: tag, key: key };
}
export const menuTagRemove = (value, tagList, that) => {
  let { tag, key } = findTag(value, tagList);
  if (tag) {
    that.$store.commit("DEL_TAG", tag);
  }
}
export const HHMMSS = () => {
  let time = new Date();
  let hh = time.getHours()
  // 获取分
  let mm = time.getMinutes()
  // 获取秒
  let ss = time.getSeconds()
  return `${hh}:${mm}:${ss}`
}
/**
 * 下载文件
 * @param {String} path - 文件地址
 * @param {String} name - 文件名,eg: test.png
 */
export const downloadFileBase64 = (path, name) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', path);
  xhr.responseType = 'blob';
  xhr.send();
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.response);
      fileReader.onload = function () {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = this.result;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    }
  };
}

/**
 * 获取文件扩展名
 * @param name
 * @returns {*}
 */
export const getFileSuffix = (name) => {
  let arr = name.split('.');
  return arr[arr.length - 1];
}

/**
 * 检查数组重复元素
 * @param arr
 * @returns {[]}
 */
export const getArrayRepeat = (arr) => {
  var sarr = arr.sort();
  var result = [];
  for (let i = 0; i < sarr.length; i++) {
    if (sarr[i] === sarr[i + 1]) {
      result.push(sarr[i]);
    }
  }
  return result;
}

/**
 * 检查A数组在B数组中不存在的元素
 * @param {[]} arrA - 数组A
 * @param {[]} arrB - 数组B
 * @returns {[]} - 不存在的元素组成的数组
 */
export const getItemNotInclude = (arrA, arrB) => {
  let c = []
  arrA.forEach(item => {
    if (arrA.includes(item) && !arrB.includes(item)) {
      c.push(item)
    }
  })
  return c;
}

/**
 * 过滤前后空格
 * @param params
 */
export const trimParams = (params) => {
  for (let i in params) {
    if (typeof (params[i]) === 'string') {
      params[i] = params[i].trim();
    }
  }
}

/**
 * 清理查询参数
 * @param params
 * @returns {{}}
 */
export const cleanParams = (params) => {
  let paramsNew = deepClone(params);
  Object.keys(paramsNew).forEach(key => {
    if (key.startsWith('$') || paramsNew[key].length === 0) delete (paramsNew[key])
  })
  return paramsNew;
}



/**
 * 首字母大写
 * @param str
 * @returns {string}
 */
export const titleCase = (str) => {
  let newStr = str.slice(0, 1).toUpperCase() + str.slice(1);
  return newStr;
}

export const fixdata = data => {
  let o = ''
  let l = 0
  const w = 10240
  for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
  return o
}

export const debounce = (func, context, delay = 500, ...args) => {
  return (function () {
    if (context.timeout) {
      clearTimeout(context.timeout);
    } else {
      func(...args);
    }
    context.timeout = setTimeout(() => {
      context.timeout = null;
    }, delay);
  })();
};

export const getYearMonth = (timer) => {
  var currentDate = new Date(timer);
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1; // 注意月份是从0开始计数，需加1来获得正确的月份
  month = month > 9 ? month : `0${month}`
  return `${year}年${month}月`
}

export const getYearMonthNum = (timer) => {
  var currentDate = !timer ? new Date() : new Date(timer);
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1; // 注意月份是从0开始计数，需加1来获得正确的月份
  month = month > 9 ? month : `0${month}`
  return `${year}-${month}`
}

export const getYear = (timer) => {
  var currentDate = !timer ? new Date() : new Date(timer);
  var year = currentDate.getFullYear();
  return `${year}`
}

export const getMonth = (timer) => {
  var currentDate = !timer ? new Date() : new Date(timer);
  var month = currentDate.getMonth() + 1; // 注意月份是从0开始计数，需加1来获得正确的月份
  return `${month}`
}

export const getLastDay = () => {
  const currentDate = new Date();
  // 使用 setDate 方法获取前一天的日期
  currentDate.setDate(currentDate.getDate() - 1)
  var year = currentDate.getFullYear(); //得到年份
  var month = currentDate.getMonth() + 1;//得到月份
  month = month > 9 ? month : `0${month}`
  var date = currentDate.getDate();//得到日期
  date = date > 9 ? date : `0${date}`
  return `${year}.${month}.${date}`
}
export const getFormatDate = (date) => {
  var currentDate = date ? new Date(date) : new Date();
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1; // 注意月份是从0开始计数，需加1来获得正确的月份
  var day = currentDate.getDate();
  month = month > 9 ? month : `0${month}`
  day = day > 9 ? day : `0${day}`
  return `${year}-${month}-${day}`
}

export const getWeek = (timer) => {
  var currentDate = new Date(timer);
  // 获取当前的月份和星期几
  var month = currentDate.getMonth();
  // 获取当前的日期和年份
  var date = currentDate.getDate();
  var year = currentDate.getFullYear();
  // 创建一个新的Date对象设置为当月的1号
  var firstDayOfMonth = new Date(year, month, 1);
  // 获取1号是星期几
  var firstDayOfWeek = firstDayOfMonth.getDay();
  // 计算当前日期是第几个星期
  var weekNumber = Math.ceil((date + firstDayOfWeek) / 7);
  return weekNumber
}

export const yearMonthDayWeek = (timer) => {
  let now = new Date(timer);
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth() + 1;//得到月份
  var date = now.getDate();//得到日期
  var day = now.getDay();//得到周几
  var week;
  var arr_week = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
  week = arr_week[day];
  var time = "";
  time = year + "年" + month + "月" + date + "日" + " " + week;
  return time
}

export const yearMonth = () => {
  let now = new Date();
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth() + 1;//得到月份
  var time = "";
  time = year + "-" + month
  return time
}

export function getNextThreeMonths(date) {
  const now = new Date(date); // 可替换为 new Date() 获取当前真实时间
  const result = [];

  for (let i = 0; i < 3; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    result.push(`${year}-${month}`);
  }

  return result;
}

// 去重后的重复项（每个重复值只出现一次）
export const findUniqueDuplicates = (arr) => {
  const duplicates = arr.filter(
    (item, index) => arr.indexOf(item) !== index
  );
  return [...new Set(duplicates)];
}

export const uniqueArray = (array,key) => {
  return Array.from(
    new Map(array.map(item => [item[key], item])).values()
  );
}
export const diffDays = (day1, day2) => {
  const date1 = new Date(day1);
  const date2 = new Date(day2);

  const timeDiff = Math.abs(date1.getTime() - date2.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return diffDays
}

// 格式化数字 200,000.00（表格中所有的交易数量都保留两位小数）
/**
 * 将数值转换成千分位, dot表示保留的小数位
 * @param {number} num 要转换的数字
 * @param {number} decimal 保留的小数位
 */
export const formatAmt = (num, dot = 2) => {
  if (num === null) {
    return ''
  }
  if ((!num || num === 0) && dot === 0) {
    return "0"
  } else if ((!num || num === 0)) {
    return '0.00'
  }
  if (isNaN(num)) return '0.00'
  // num = parseFloat(num).toFixed(dot)
  const numStr = Number(num).toLocaleString('zh-CN', { minimumFractionDigits: dot, useGrouping: true })
  const res = numStr.split('.')
  const integer = res[0]
  const dicimal = (res[1] || '').padEnd(dot, '0').slice(0, dot)
  return integer + (dicimal ? '.' + dicimal : '')
}

export function dealTimerSecond(v) {
  if (!v || (v && v.length > 13)) {
    return v
  } else {
    return `${v} 00:00:00`
  }
}

export function numberToTraditionalChinese(money) {
  //汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  var cnInteger = '整';
  //整型完以后的单位
  var cnIntLast = '元';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  if (money == '') { return ''; }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;


}

export function calculateTimeDifference(startTime, endTime) {
  // 将字符串转换为日期格式
  var start = new Date('2019-01-01 ' + startTime);
  var end = new Date('2019-01-01 ' + endTime);

  // 获取相差的毫秒数
  var diffInMilliseconds = Math.abs(end - start);

  // 计算小时差
  var hoursDiff = Math.floor((diffInMilliseconds % (365 * 86400000)) / (3600000));

  // 计算分钟差（考虑到小时差后）
  var minutesDiff = Math.round((diffInMilliseconds % (3600000)) / (60000));

  return [hoursDiff, minutesDiff];
}
/**
 * 生成从起始日期到结束日期的所有周区间（每7天一周）
 * @param {Date|string} startDate - 起始日期，默认'2025-12-01'
 * @param {Date} endDate - 结束日期，默认为今天
 * @returns {Array<{start: Date, end: Date, startStr: string, endStr: string, weekNumber: number}>} 周数组
 */
export function generateWeeksFrom(startDate = '2025-12-01', endDate = new Date()) {
  // 确保起始日期为Date对象
  let start = new Date(startDate);
  let end = new Date(endDate);

  // 重置时间为零点，避免时区干扰
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // 结束日期增加4个月
  end.setMonth(end.getMonth() + 4);
  // 再次重置时间（setMonth 可能影响时分秒，但我们已经归零过，不过为了安全）
  end.setHours(0, 0, 0, 0);

  const weeks = [];
  let currentStart = new Date(start);
  let weekIndex = 0;

  while (currentStart <= end) {
      // 计算本周的结束日期：当前开始 + 6 天
      let weekEnd = new Date(currentStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      // 如果本周结束超出总体结束日期，则截断
      if (weekEnd > end) {
          weekEnd = new Date(end);
      }

      weeks.push({
          start: `${formatDate(currentStart)} 00:00:00`,
          end: `${formatDate(weekEnd)} 00:00:00`,
          startStr: formatDate(currentStart),
          endStr: formatDate(weekEnd),
          weekNumber: ++weekIndex,
          titleStr:`${formatDateStr(currentStart)}-${formatDateStr(weekEnd)}`
      });

      // 移动到下一周（+7天）
      currentStart.setDate(currentStart.getDate() + 7);
  }

  return weeks;
}

/**
 * 辅助函数：格式化日期为 YYYY-MM-DD
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

// 示例用法
const weeks = generateWeeksFrom('2025-12-01', new Date());
console.log(weeks);
export function getDatesInCurrentMonth(value) {
  const currentDate = value ? new Date(value) : new Date();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(month, year);

  const dates = [];

  for (let i = 0; i < daysInMonth; i++) {
    const date = new Date(year, month, i + 1);
    dates.push(getFormatDate(date));
  }

  return dates;
}

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

export function getDateDifference(date1, date2) {
  const dateTime1 = new Date(date1).getTime();
  const dateTime2 = new Date(date2).getTime();

  const diffInMs = (dateTime2 - dateTime1);
  const diffInDays = Math.floor(diffInMs / 86400000);

  return diffInDays;
}


export function isPDF(file) {
  // 通过文件扩展名判断
  if (file.name.toLowerCase().endsWith('.pdf')) {
    return true;
  }
  // 通过文件的MIME类型判断
  if (file.type === 'application/pdf') {
    return true;
  }
  return false;
}

export function getCurrentDateTime(value) {
  const now = value ? new Date(value) : new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // 每天的毫秒数
  const firstDate = new Date(date1);
  const secondDate = new Date();
  if (firstDate >= secondDate) {
    return 0
  }
  // 计算时间差
  const diff = Math.abs(secondDate - firstDate);


  // 返回差值除以每天的毫秒数
  return Math.round(diff / oneDay) - 1;
}